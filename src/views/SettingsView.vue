<script setup lang="ts">
import SettingsTab from '@/components/settings/Layout/SettingsTab.vue';
import SettingsWrapper from '@/components/settings/Layout/SettingsWrapper.vue';
import AppSettings from '@/components/settings/AppSettings.vue';
</script>

<template>
  <div>
    <SettingsWrapper>
      <SettingsTab title="App Settings"><AppSettings /></SettingsTab>
    </SettingsWrapper>
  </div>
</template>
