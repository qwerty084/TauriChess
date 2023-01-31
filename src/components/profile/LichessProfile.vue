<script setup lang="ts">
import { LichessUser } from '@/types/LichessApi';
import { ref } from 'vue';

const username = ref('');
const userData = ref<LichessUser | null>(null);

async function fetchProfile() {
  if (username.value === '') {
    console.warn('Username is empty');
  }

  const res = await fetch(`https://lichess.org/api/user/${username.value}`);
  userData.value = await res.json();

  console.log(userData.value);
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
        <input
          id="username"
          v-model="username"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <div class="flex justify-end pt-8">
      <button
        type="button"
        class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="fetchProfile"
      >
        Save
      </button>
    </div>
  </div>
</template>
