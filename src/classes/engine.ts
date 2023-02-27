import { ref } from 'vue';
import { Command, type Child } from '@tauri-apps/api/shell';
import type { BoardApi, SquareKey } from 'vue3-chessboard';

export class Engine {
  public name: string | undefined;
  public bestMove: string | undefined;
  private startingPosition: string;
  private child: Child | null = null;
  private boardApi: BoardApi;
  private process: Command | null = null;
  public maxDepth = 20;
  public eval = ref<string>('0.00');
  public depth = ref<number | undefined>();
  public isMate = ref(false);

  constructor(boardApi: BoardApi) {
    this.startingPosition = boardApi.getFen();
    this.boardApi = boardApi;
    this.init();
  }

  private async init() {
    // @TODO implement proper error handling
    try {
      this.process = Command.sidecar('binaries/stockfish');
      this.child = await this.process.spawn();

      this.process.stdout.addListener('data', (data) =>
        this.processStdout(data)
      );
      this.sendCmd('uci');
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.log(e);
      }
    }
  }

  public async setOption(name: string, value: string | number): Promise<void> {
    this.sendCmd(`setoption name ${name} value ${value}`);
  }

  public stop(): void {
    this.child?.kill();
  }

  public async sendCmd(cmd: string): Promise<void> {
    await this.child?.write(`${cmd}\n`);
  }

  private get getMoves() {
    return this.boardApi
      .getHistory(true)
      .map((move) => {
        if (typeof move === 'object') {
          return move.lan;
        }
        return move;
      })
      .join(' ');
  }

  public async startEngine() {
    this.sendCmd(
      `position fen ${this.startingPosition} moves ${this.getMoves}`
    );
    this.sendCmd('go depth 25');
  }

  public async processStdout(data: string) {
    if (data === 'uciok') {
      this.sendCmd('ucinewgame');
      this.sendCmd('isready');
    } else if (data === 'readyok') {
      this.sendCmd('ucinewgame');
      this.startEngine();
    } else if (data.startsWith('id name')) {
      this.name = data.slice(8);
    } else if (data.startsWith('bestmove')) {
      this.bestMove = data.slice(9, 13);
      this.boardApi.drawMove(
        this.bestMove.slice(0, 2) as SquareKey,
        this.bestMove.slice(2, 4) as SquareKey,
        'paleBlue'
      );
    } else if (data.startsWith('info')) {
      const parts = data.trim().split(/\s+/g);
      for (let i = 1; i < parts.length; i++) {
        if (parts[i] === 'depth') {
          this.depth.value = parseInt(parts[++i]);
          if (this.depth.value === this.maxDepth) {
            this.sendCmd('eval');
          }
        } else if (parts[i] === 'score') {
          this.isMate.value = parts[++i] === 'mate';
        }
      }
    } else if (data.startsWith('Final')) {
      const parts = data.trim().split(/\s+/g);
      this.eval.value = parts[2];
    }
  }
}
