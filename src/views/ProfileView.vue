<script lang="ts" setup>
import SettingsTab from '@/components/settings/Layout/SettingsTab.vue';
import SettingsWrapper from '@/components/settings/Layout/SettingsWrapper.vue';
import ChessProfile from '@/components/profile/ChessProfile.vue';
import LichessProfile from '@/components/profile/LichessProfile.vue';
</script>

<template>
  <div class="flex-1 xl:overflow-y-auto">
    <div class="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
      <h2 class="text-3xl font-bold tracking-tight text-blue-gray-900 mb-2">
        Profile
      </h2>
      <p class="mt-1 mb-6 text-sm text-blue-gray-500">
        Here you can configure your profile settings.
      </p>

      <div>
        <SettingsWrapper>
          <SettingsTab title="Lichess"><LichessProfile /></SettingsTab>
          <SettingsTab title="Chess.com"><ChessProfile /></SettingsTab>
        </SettingsWrapper>
      </div>
    </div>
  </div>
</template>
