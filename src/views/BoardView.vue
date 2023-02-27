<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
  BoardConfig,
  SquareKey,
  TheChessboard,
  type BoardApi,
} from 'vue3-chessboard';
import { Switch } from '@headlessui/vue';
import { Stockfish } from '@/classes/stockfish';
import { getClient, type Client } from '@tauri-apps/api/http';

const boardAPI = ref<BoardApi>();
const client = ref<Client | null>(null);
const sf = ref<Stockfish>();
const engineEnabled = ref(false);
const opening = ref('');
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

onMounted(async () => {
  client.value = await getClient();
});

watch(engineEnabled, async (enabled) => {
  if (enabled) {
    startStockfish();
  } else {
    sf.value?.stop();
    boardAPI.value?.hideMoves();
  }
});

async function move() {
  boardAPI.value?.getHistory(true);
  // add small delay to keep gui responsive
  setTimeout(() => sf.value?.startEngine(), 100);

  if (!boardAPI.value) return;
  if (boardAPI.value?.getCurrentTurnNumber() < 7) {
    const res = await boardAPI.value?.getOpeningName();
    if (res != null) {
      opening.value = res;
    }
  }
}

async function startStockfish() {
  if (typeof boardAPI.value === 'undefined') return;
  sf.value = new Stockfish(boardAPI.value);
}
</script>

<template>
  <section aria-label="Game Analysis">
    <TheChessboard
      :board-config="boardConfig"
      @move="move"
      @board-created="(api) => (boardAPI = api)"
    />
    <div>
      <Switch
        v-model="engineEnabled"
        :class="[
          engineEnabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        ]"
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="[
            engineEnabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          ]"
        />
      </Switch>
    </div>
  </section>
</template>
