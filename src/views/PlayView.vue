<script setup lang="ts">
import { ref } from 'vue';
import { TheChessboard, type ChessboardAPI } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';

const boardAPI = ref<ChessboardAPI>();
</script>

<template>
  <TheChessboard @board-created="(api) => (boardAPI = api)" />
</template>
