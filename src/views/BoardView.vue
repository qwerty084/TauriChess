<script setup lang="ts">
import { ref } from 'vue';
import { TheChessboard, type BoardApi, type MoveEvent } from 'vue3-chessboard';
import { Stockfish } from '@/classes/stockfish';
import { invoke } from '@tauri-apps/api/tauri';
import { useUser } from '@/stores/UserStore';

const boardAPI = ref<BoardApi>();
const moves = ref<string[]>([]);
const sf = ref<Stockfish>();
const opening = ref('');
const user = useUser();

async function move(move: MoveEvent) {
  if (move?.lan) {
    moves.value.push(move?.lan);
    sf.value?.startEngine(moves.value);
  }

  if (moves.value.length < 8) {
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
    <div>
      <button @click="startStockfish">Enable Stockfish</button>
    </div>
    <TheChessboard @move="move" @board-created="(api) => (boardAPI = api)" />
  </div>
</template>
