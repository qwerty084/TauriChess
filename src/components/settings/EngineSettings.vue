<script setup lang="ts">
import { Engine } from '@/types/Engine';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import AlertDialog from '../ui/AlertDialog.vue';
import EngineTable from './Layout/EngineTable.vue';
import { XMarkIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';

invoke<string>('add_engine', {
  name: 'Stockfish 15',
  path: '/Downloads/stockfish',
}).then((message) => console.log(message));

invoke('get_engines').then((message) => console.log(message));

type NotificationType = 'Success' | 'Error' | 'Warning';

const engines = ref<Engine[]>([]);
const enginePath = ref('');
const engineName = ref('');
const engineId = ref('');
const showNotificationWindow = ref(false);
const notificationType = ref<NotificationType>();
const notificationTitle = ref('');
const notificationDescription = ref('');
const isEditing = ref(false);
const isDeleting = ref(false);
const NotificationDialog = defineAsyncComponent(
  () => import('../ui/NotificationDialog.vue')
);

// onMounted(() => {
//   fetchEngines();
// });

const heading = computed(() => (isEditing.value ? 'Edit' : 'Add') + ' Engine');

// function fetchEngines() {
//   GetEngines().then((registeredEngines) => {
//     engines.value = registeredEngines as unknown as Engine[]; // fix this :)
//   });
// }

function showNotification(
  type: NotificationType,
  title: string,
  description: string
) {
  showNotificationWindow.value = true;
  notificationType.value = type;
  notificationTitle.value = title;
  notificationDescription.value = description;

  setTimeout(() => {
    showNotificationWindow.value = false;
  }, 5000);
}

// async function handleDialogClose(confirmDeletion: boolean) {
//   if (confirmDeletion) {
//     await RemoveEngine(engineId.value);
//     engineId.value = '';
//     fetchEngines();
//   }
//   isDeleting.value = false;
// }

function clearInputs() {
  engineName.value = '';
  enginePath.value = '';
  engineId.value = '';
}

// async function handleAddEngine() {
//   let success: boolean;
//   if (isEditing.value) {
//     success = await EditEngine(
//       engineId.value,
//       engineName.value,
//       enginePath.value
//     );
//   } else {
//     success = await AddEngine(engineName.value, enginePath.value);
//   }

//   fetchEngines();
//   clearInputs();
//   if (isEditing.value) {
//     showNotification('Success', 'Engine successfully edited.', '');
//   } else {
//     showNotification('Success', 'Engine has been added.', '');
//   }

//   isEditing.value = false;
// }

function handleRemoveEngine(id: string) {
  isDeleting.value = true;
  engineId.value = id;
}

function handleEditEngine(id: string, name: string, path: string) {
  isEditing.value = true;
  engineId.value = id;
  engineName.value = name;
  enginePath.value = path;
}

function cancelEditing() {
  isEditing.value = false;
  clearInputs();
}
</script>

<template>
  <EngineTable :engines="engines" @delete-engine="handleRemoveEngine" />
  <div class="max-w-md">
    <!-- <form @submit.prevent="handleAddEngine">
      <h3>{{ heading }}</h3>
      <div>
        <label for="engine-path" class="block text-sm font-medium text-gray-700"
          >Engine Name</label
        >
        <div class="mt-1">
          <input
            id="engine-name"
            v-model="engineName"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <label for="engine-path" class="block text-sm font-medium text-gray-700"
          >Engine Path</label
        >
        <div class="mt-1">
          <input
            id="engine-path"
            v-model="enginePath"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <button type="submit" class="button">
        {{ heading }}
      </button>
      <button
        v-show="isEditing"
        type="button"
        class="button"
        @click="cancelEditing"
      >
        Cancel Editing
      </button>
    </form>
    <AlertDialog v-if="isDeleting" @dialog-closed="handleDialogClose"
      ><template #title>Delete Engine</template
      ><template #description
        >Do you really want to delete this engine?</template
      >
    </AlertDialog> -->
    <NotificationDialog
      v-if="showNotificationWindow"
      :notification-type="notificationType"
      ><template #title>{{ notificationTitle }}</template
      ><template #description>{{
        notificationDescription
      }}</template></NotificationDialog
    >
  </div>
</template>

<style>
.isEditing {
  outline: 1px solid #aaa;
}
</style>
