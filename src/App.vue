<script lang="ts" setup>
import { ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { RouterView } from 'vue-router';
import DesktopBar from '@/components/sidebar/DesktopBar.vue';
import MobileBar from '@/components/sidebar/MobileBar.vue';
import { useUser } from './stores/UserStore';

const sidebarOpen = ref(false);
const user = useUser();

// keep track of connection state
window.addEventListener('offline', () => (user.hasInternetConnection = false));
window.addEventListener('online', () => (user.hasInternetConnection = true));
</script>

<template>
  <div>
    <MobileBar />
    <DesktopBar />
    <div class="flex flex-1 flex-col md:pl-64">
      <div
        class="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden"
      >
        <button
          type="button"
          class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main class="flex-1">
        <div class="py-6">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <RouterView v-slot="{ Component }">
              <Transition>
                <template v-if="Component">
                  <KeepAlive>
                    <component :is="Component"></component>
                  </KeepAlive>
                </template>
              </Transition>
            </RouterView>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
.v-enter-active {
  transition: opacity 0.4s;
}
.v-enter-from {
  opacity: 0;
}
.fade-leave-active,
.fade-enter-active {
  transition: opacity 0.4s;
}
.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}
</style>
