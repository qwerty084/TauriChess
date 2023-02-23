<script setup lang="ts">
import { ref } from 'vue';
import {
  BoardConfig,
  SquareKey,
  TheChessboard,
  type BoardApi,
  type MoveEvent,
} from 'vue3-chessboard';
import { Stockfish } from '@/classes/stockfish';
import { invoke } from '@tauri-apps/api/tauri';
import { useUser } from '@/stores/UserStore';

const boardAPI = ref<BoardApi>();
const sf = ref<Stockfish>();
const opening = ref('');
const user = useUser();
const boardConfig: BoardConfig = {
  events: {
    select: () => {
      if (sf.value?.bestMove) {
        boardAPI.value?.drawMove(
          sf.value?.bestMove.slice(0, 2) as SquareKey,
          sf.value?.bestMove.slice(2, 4) as SquareKey,
          'paleBlue'
        );
      }
    },
  },
};

async function move() {
  // add small delay to keep gui responsive
  setTimeout(() => {
    sf.value?.startEngine();
  }, 150);

  if (boardAPI.value && boardAPI.value?.getCurrentTurnNumber() < 8) {
    try {
      opening.value = await invoke<string>('get_opening', {
        inputPgn: boardAPI.value?.getPgn(),
      });
    } catch {
      if (!user.hasInternetConnection) return;
      const res = await boardAPI.value?.getOpeningName();
      if (res != null) {
        opening.value = res;
      }
    }
  }
}

async function startStockfish() {
  if (typeof boardAPI.value === 'undefined') return;
  sf.value = new Stockfish(boardAPI.value);
}
</script>

<template>
  <div>
    <p>Opening: {{ opening }}</p>
    <p>Eval: {{ sf?.eval }}</p>
    <p class="text">Depth: {{ sf?.depth }}</p>
    <p>Engine: {{ sf?.engineName }}</p>
    <div>
      <button @click="startStockfish">Enable Stockfish</button>
    </div>
    <TheChessboard
      :board-config="boardConfig"
      @move="move"
      @board-created="(api) => (boardAPI = api)"
    />
  </div>
</template>
