<script setup lang="ts">
import { ref, toRef, watch } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'inputClosed'): void;
}>();

const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

const openRef = toRef(props, 'open');

const dialogOpen = ref(true);

watch(openRef, () => {
  if (openRef.value === false) {
    dialogOpen.value = false;
  }
});

watch(dialogOpen, () => emit('inputClosed'));
</script>

<template>
  <TransitionRoot as="template" :show="dialogOpen">
    <Dialog as="div" class="relative z-10" @close="dialogOpen = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div>
                <div class="text-center">
                  <XMarkIcon
                    class="w-6 h-6 cursor-pointer absolute top-3 right-3"
                    @click="dialogOpen = false"
                  />
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                    ><slot name="title">Title</slot></DialogTitle
                  >
                </div>
              </div>
              <slot name="form"></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
