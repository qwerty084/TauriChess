<script setup lang="ts">
import { LichessUser } from '@/types/LichessApi';
import { defineAsyncComponent, ref } from 'vue';
import { getClient } from '@tauri-apps/api/http';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
import { NotificationType } from '@/types/Types';
import { useLichessUser } from '@/stores/LichessStore';
import LichessHistory from './LichessHistory.vue';

const username = ref('');
const lichessUser = useLichessUser();
const showDialog = ref(false);
const notificationType = ref<NotificationType>();
const notificationTitle = ref('');
const NotificationDialog = defineAsyncComponent(
  () => import('../ui/NotificationDialog.vue')
);

async function fetchProfile() {
  if (username.value === '') {
    console.warn('Username is empty');
  }

  const client = await getClient();
  const res = await client.get<LichessUser>(
    `https://lichess.org/api/user/${username.value}`
  );

  if (res.ok) {
    lichessUser.user = res.data;
    notificationType.value = 'Success';
    notificationTitle.value = 'Your Lichess account has been added!';
  } else {
    if (res.status === 404) {
      notificationType.value = 'Error';
      notificationTitle.value = 'Your Lichess account could not be found!';
    } else {
      notificationType.value = 'Error';
      notificationTitle.value = 'Your Lichess account could not be added!';
    }
  }

  showDialog.value = true;

  setTimeout(() => {
    showDialog.value = false;
  }, 3500);
}
</script>

<template>
  <div class="divide-y-blue-gray-200 space-y-8 divide-y">
    <div class="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
      <div class="sm:col-span-3">
        <label
          for="username"
          class="block text-sm font-medium text-blue-gray-900"
          >Username</label
        >
        <div class="relative mt-1 rounded-md shadow-sm">
          <input
            id="username"
            v-model="username"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <CheckCircleIcon
              v-if="lichessUser.user != null"
              class="w-6 h-6 text-green-600 block"
            />
          </div>
        </div>
      </div>
    </div>

    <NotificationDialog v-if="showDialog" :notification-type="notificationType"
      ><template #title>{{ notificationTitle }}</template></NotificationDialog
    >

    <div class="flex justify-end pt-8">
      <button
        type="submit"
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="fetchProfile"
      >
        Save
      </button>
    </div>
    <div
      v-if="lichessUser.user != null"
      class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow"
    >
      <div class="px-4 py-5 sm:px-6">
        <h2>{{ lichessUser.user.username }}</h2>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <LichessHistory />
      </div>
    </div>
  </div>
</template>
