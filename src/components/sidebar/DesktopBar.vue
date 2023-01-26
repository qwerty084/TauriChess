<script setup lang="ts">
import ProfileIcon from '@/components/sidebar/ProfileIcon.vue';
import NavigationItems from '@/components/sidebar/NavigationItems.vue';
</script>

<template>
  <div class="hidden md:fixed md:inset-y-0 md:flex md:w-56 md:flex-col">
    <div class="flex min-h-0 flex-1 flex-col bg-gray-800">
      <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div class="flex flex-shrink-0 items-center px-4">
          <img
            class="h-10 w-auto"
            src="/src/assets/images/rook.svg"
            alt="Wails Chess"
            role="presentation"
          />
          <h1 class="text-white text-xl">Wails Chess</h1>
        </div>
        <NavigationItems />
      </div>
      <div class="flex flex-shrink-0 bg-gray-700 p-4">
        <ProfileIcon />
      </div>
    </div>
  </div>
</template>
