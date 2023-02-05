<script setup lang="ts">
import { useLichessUser } from '@/stores/LichessStore';
import { LichessGame } from '@/types/LichessApi';
import { getClient, ResponseType, type Client } from '@tauri-apps/api/http';
import { onMounted, ref } from 'vue';

const user = useLichessUser();
const httpClient = ref<Client | null>(null);

async function fetchGameHistory() {
  const res = await httpClient.value?.get<string>(
    `https://lichess.org/api/games/user/${user.user?.username}?max=10&pgnInJson=true`,
    {
      headers: {
        Accept: 'application/x-ndjson',
      },
      responseType: ResponseType.Text,
    }
  );
  if (!res?.ok) {
    console.warn('ERROR');
    return;
  }

  const data = res.data
    .match(/.+/g)
    ?.map((text) => JSON.parse(text)) as LichessGame[];
  console.log(data);
}

onMounted(async () => {
  httpClient.value = await getClient();
  fetchGameHistory();
});
</script>

<template>
  <h1>Match History</h1>
</template>
