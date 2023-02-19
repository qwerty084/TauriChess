<script setup lang="ts">
import { ref } from 'vue';
import { TheChessboard, type BoardApi, type MoveEvent } from 'vue3-chessboard';
import { Stockfish } from '@/classes/stockfish';
import { invoke } from '@tauri-apps/api/tauri';

const boardAPI = ref<BoardApi>();
const moves = ref<string[]>([]);
const sf = ref<Stockfish>();
const opening = ref('');

async function move(move: MoveEvent) {
  if (move?.lan) {
    moves.value.push(move?.lan);
    sf.value?.startEngine(moves.value);
  }

  opening.value = await invoke('get_opening_for_pgn', {
    inputPgn: boardAPI.value?.getPgn() ?? '',
  });
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
    <div>
      <button @click="startStockfish">Enable Stockfish</button>
    </div>
    <TheChessboard @move="move" @board-created="(api) => (boardAPI = api)" />
  </div>
</template>
