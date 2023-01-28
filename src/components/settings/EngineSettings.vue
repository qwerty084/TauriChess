<script setup lang="ts">
import { Engine } from '@/types/Engine';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import AlertDialog from '../ui/AlertDialog.vue';
import EngineTable from './Layout/EngineTable.vue';
import type { NotificationType } from '@/types/Types';

async function fetchEngines() {
  engines.value = await invoke('get_engines');
}

async function addEngine(name: string, path: string): Promise<boolean> {
  return await invoke<boolean>('add_engine', {
    name,
    path,
  });
}

async function editEngine(
  id: string,
  name: string,
  path: string
): Promise<boolean> {
  return await invoke<boolean>('edit_engine', {
    id,
    name,
    path,
  });
}

const engines = ref<Engine[]>([]);
const enginePath = ref('');
const engineName = ref('');
const engineId = ref('');
const showNotificationWindow = ref(false);
const isAdding = ref(false);
const notificationType = ref<NotificationType>();
const notificationTitle = ref('');
const notificationDescription = ref('');
const isEditing = ref(false);
const isDeleting = ref(false);
const NotificationDialog = defineAsyncComponent(
  () => import('../ui/NotificationDialog.vue')
);
const AddDialog = defineAsyncComponent(() => import('../ui/InputDialog.vue'));

onMounted(() => {
  fetchEngines();
});

const submitButtonText = computed(() => (isEditing.value ? 'Edit' : 'Add'));

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

async function handleDialogClose(confirmDeletion: boolean) {
  if (confirmDeletion) {
    engineId.value = '';
    fetchEngines();
  }
  isDeleting.value = false;
}

function clearInputs() {
  engineName.value = '';
  enginePath.value = '';
  engineId.value = '';
}

async function handleAddEngine() {
  let success: boolean;
  if (isEditing.value) {
    success = await editEngine(
      engineId.value,
      engineName.value,
      enginePath.value
    );
  } else {
    success = await addEngine(engineName.value, enginePath.value);
  }
  console.log(success);
  fetchEngines();
  clearInputs();
  if (isEditing.value) {
    showNotification('Success', 'Engine successfully edited.', '');
  } else {
    showNotification('Success', 'Engine has been added.', '');
  }

  isAdding.value = false;
  isEditing.value = false;
}

function handleRemoveEngine(id: string) {
  isDeleting.value = true;
  engineId.value = id;
  invoke('delete_engine', { id });
  // TODO: show message depending on result
  fetchEngines();
}

function handleEditEngine(id: string) {
  isEditing.value = true;
  isAdding.value = true;
  const engineToEdit = engines.value.filter((engine) => engine.id === id)[0];
  engineId.value = engineToEdit.id;
  engineName.value = engineToEdit.name;
  enginePath.value = engineToEdit.path;
}

function cancelEditing() {
  isAdding.value = false;
  isEditing.value = false;
  clearInputs();
}
</script>

<template>
  <AddDialog v-if="isAdding" :open="isAdding" @input-closed="cancelEditing">
    <template #title>Add Engine</template>
    <template #form>
      <form @submit.prevent="handleAddEngine">
        <div class="mb-2">
          <label
            for="engine-name"
            class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <div class="mt-1">
            <input
              id="engine-name"
              v-model="engineName"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label for="path" class="block text-sm font-medium text-gray-700"
            >Path</label
          >
          <div class="mt-1">
            <input
              id="path"
              v-model="enginePath"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div class="mt-5 sm:mt-6">
          <button
            type="submit"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            {{ submitButtonText }}
          </button>
        </div>
      </form>
    </template>
  </AddDialog>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Engines</h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all your configured engines.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          @click="isAdding = true"
        >
          Add Engine
        </button>
      </div>
    </div>
  </div>
  <EngineTable
    :engines="engines"
    @delete-engine="handleRemoveEngine"
    @edit-engine="handleEditEngine"
  />
  <div class="max-w-md">
    <AlertDialog v-if="isDeleting" @dialog-closed="handleDialogClose"
      ><template #title>Delete Engine</template
      ><template #description
        >Do you really want to delete this engine?</template
      >
    </AlertDialog>
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
