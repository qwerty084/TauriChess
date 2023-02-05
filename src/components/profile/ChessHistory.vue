<script setup lang="ts">
import { useChessUser } from '@/stores/ChessStore';
import { getClient, type Client } from '@tauri-apps/api/http';
import { onMounted, ref } from 'vue';
import { open } from '@tauri-apps/api/shell';
import { ChessGame } from '@/types/ChessApi';

const user = useChessUser();
const gameHistory = ref<ChessGame[] | null>(null);
const httpClient = ref<Client | null>(null);

async function fetchGameHistory(
  YYYY: number | undefined = undefined,
  MM: string | undefined = undefined
) {
  if (typeof YYYY === 'undefined') {
    YYYY = new Date().getFullYear();
  }
  if (typeof MM === 'undefined') {
    MM = new Date().getMonth().toString().padStart(2, '0');
  }
  const res = await httpClient.value?.get<ChessGame[]>(
    `https://api.chess.com/pub/player/${user.user?.username}/games/${YYYY}/${MM}`
  );
  if (!res?.ok) {
    console.warn('ERROR fetching chess.com games');
    return;
  }
  gameHistory.value = res.data;
  console.log(gameHistory.value);
}

onMounted(async () => {
  httpClient.value = await getClient();
  fetchGameHistory();
});
</script>

<template>
  <h1>Match History</h1>
  <button @click="open('https://www.chess.com/game/live/68043740339')">
    Hello World
  </button>
</template>
