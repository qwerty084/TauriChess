import { ref } from 'vue';
import { Command, type Child } from '@tauri-apps/api/shell';
import type { BoardApi, SquareKey } from 'vue3-chessboard';

export class Stockfish {
  public engineName: string | undefined;
  private startingPosition: string;
  private stockfish: Child | null = null;
  private boardApi: BoardApi;
  private process: Command | null = null;
  public maxDepth = 20;
  public eval = ref<string>('0.00');
  public depth = ref<number | undefined>();
  public isMate = ref(false);
  private initialPos =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  constructor(boardApi: BoardApi) {
    this.startingPosition = boardApi.getFen() ?? this.initialPos;
    this.boardApi = boardApi;
    this.init();
  }

  private async init() {
    // @TODO implement proper error handling
    try {
      this.process = Command.sidecar('binaries/stockfish');
      this.stockfish = await this.process.spawn();

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
    this.stockfish?.kill();
  }

  public async sendCmd(cmd: string): Promise<void> {
    await this.stockfish?.write(`${cmd}\n`);
  }

  public async startEngine(moves: string[]) {
    this.sendCmd(
      `position fen ${this.startingPosition} moves ${moves.join(' ')}`
    );
    this.sendCmd('go depth 25');
  }

  public async processStdout(data: string) {
    const parts = data.trim().split(/\s+/g);
    if (parts[0] === 'uciok') {
      this.sendCmd('ucinewgame');
      this.sendCmd('isready');
    } else if (parts[0] === 'readyok') {
      this.startEngine([]);
    } else if (parts[0] === 'id' && parts[1] === 'name') {
      this.engineName = parts.slice(2).join(' ');
    } else if (parts[0] === 'bestmove') {
      this.boardApi.drawMove(
        parts[1].slice(0, 2) as SquareKey,
        parts[1].slice(2, 4) as SquareKey,
        'paleBlue'
      );
    } else if (parts[0] === 'info') {
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
    } else if (parts[0] === 'Final') {
      this.eval.value = parts[2];
    }
  }
}
