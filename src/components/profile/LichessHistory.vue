<script setup lang="ts">
import { dateFormatter } from '@/helper/formatter';
import { pgnParser } from '@/helper/pgn';
import { useLichessUser } from '@/stores/LichessStore';
import { LichessGame } from '@/types/LichessApi';
import {
  getClient,
  ResponseType,
  type Client,
  type Response,
} from '@tauri-apps/api/http';
import { onMounted, ref } from 'vue';
import GameHistoryTable, { ExternalGame } from './GameHistoryTable.vue';

const user = useLichessUser();
const historyData = ref<ExternalGame[]>([]);
const httpClient = ref<Client | null>(null);
const latestTimestamp = ref<number | null>(null);
const failedToFetch = ref<boolean>(false);

async function fetchGameHistory() {
  let res: Response<string> | undefined;

  if (latestTimestamp.value == null) {
    res = await httpClient.value?.get<string>(
      `https://lichess.org/api/games/user/${user.user?.username}?max=20&pgnInJson=true`,
      {
        headers: {
          Accept: 'application/x-ndjson',
        },
        responseType: ResponseType.Text,
      }
    );
  } else {
    res = await httpClient.value?.get<string>(
      `https://lichess.org/api/games/user/${user.user?.username}?max=20&pgnInJson=true&until=${latestTimestamp.value}`,
      {
        headers: {
          Accept: 'application/x-ndjson',
        },
        responseType: ResponseType.Text,
      }
    );
  }

  if (!res?.ok) {
    failedToFetch.value = true;
    return;
  }

  try {
    const games = res.data
      .match(/.+/g)
      ?.map((text) => JSON.parse(text)) as LichessGame[];

    games.forEach((game) => {
      const pgn = pgnParser(game.pgn);
      let ownerColor: string;
      if (user.user?.username === game.players.white?.user?.name) {
        ownerColor = 'white';
      } else {
        ownerColor = 'black';
      }
      const newGame: ExternalGame = {
        id: game.id,
        externalUrl: (pgn['Site'] as string) ?? '',
        moves: game.moves,
        playedAt: dateFormatter(game.lastMoveAt),
        result: game.winner === ownerColor ? 'Win' : 'Lose',
        white: {
          name: game.players.white?.user?.name ?? 'Anonymous',
          rating: game.players.white?.rating ?? 0,
        },
        black: {
          name: game.players.black?.user?.name ?? 'Anonymous',
          rating: game.players.black?.rating ?? 0,
        },
      };
      historyData.value.push(newGame);
    });
    latestTimestamp.value = games.at(-1)?.lastMoveAt ?? Date.now();
  } catch {
    failedToFetch.value = true;
  }
}

onMounted(async () => {
  httpClient.value = await getClient();
  fetchGameHistory();
});
</script>

<template>
  <h1>Match History</h1>
  <p v-if="failedToFetch">Failed to fetch data from Lichess</p>
  <GameHistoryTable
    v-if="historyData"
    :games="historyData"
    :site="'Lichess'"
    @load-more="fetchGameHistory"
  />
</template>
