<script setup lang="ts">
import { Engine } from '@/types/Engine';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import AlertDialog from '../ui/AlertDialog.vue';
import EngineTable from './Layout/EngineTable.vue';
import type { NotificationType } from '@/types/Types';
import Database from 'tauri-plugin-sql-api';

const engineDb = ref<Database | null>(null);
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

async function fetchEngines() {
  engines.value =
    (await engineDb.value?.select(
      'SELECT id, engine_name as name, engine_path as path, is_default as isDefault FROM engines'
    )) ?? [];
}

async function addEngine(name: string, path: string): Promise<boolean> {
  const result = await engineDb.value?.execute(
    'INSERT INTO engines VALUES(NULL, $1, $2, 0)',
    [name, path]
  );

  if (result?.rowsAffected === 1) {
    return true;
  }

  return false;
}

async function handleSetDefaultEngine(id: string) {
  await engineDb.value?.execute('UPDATE engines SET is_default = 0');
  const result = await engineDb.value?.execute(
    'UPDATE engines SET is_default = 1 WHERE id = $1',
    [id]
  );
  console.log(result);
  fetchEngines();
}

async function editEngine(
  id: string,
  name: string,
  path: string
): Promise<boolean> {
  const result = await engineDb.value?.execute(
    'UPDATE engines SET engine_name = $1, engine_path = $2, is_default = 0 WHERE id = $3',
    [name, path, id]
  );

  if (result?.rowsAffected === 1) {
    return true;
  }

  return false;
}

onMounted(async () => {
  await loadDb();
  fetchEngines();
});

async function loadDb() {
  engineDb.value = await Database.load('sqlite:engines.db');
}

const submitButtonText = computed(() => (isEditing.value ? 'Edit' : 'Add'));

function showNotification(
  type: NotificationType,
  title: string,
  description: string
) {
  // hide current window if there is a new notification
  if (showNotificationWindow.value) {
    showNotificationWindow.value = false;
  }
  showNotificationWindow.value = true;
  notificationType.value = type;
  notificationTitle.value = title;
  notificationDescription.value = description;

  setTimeout(() => {
    showNotificationWindow.value = false;
  }, 3500);
}

async function handleDialogClose(confirmDeletion: boolean) {
  if (confirmDeletion) {
    const result = await engineDb.value?.execute(
      'DELETE FROM engines WHERE id = $1',
      [engineId.value]
    );

    if (result?.rowsAffected === 1) {
      showNotification('Success', 'Engine has been deleted', '');
    } else {
      showNotification('Error', 'Failed to delete engine', 'Please try again.');
    }
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

  fetchEngines();
  clearInputs();
  if (isEditing.value) {
    if (success) {
      showNotification('Success', 'Engine successfully edited.', '');
    } else {
      showNotification('Error', 'Failed to edit engine.', 'Please try again.');
    }
  } else {
    if (success) {
      showNotification('Success', 'Engine has been added.', '');
    } else {
      showNotification('Error', 'Failed to add engine', 'Please try again.');
    }
  }

  isAdding.value = false;
  isEditing.value = false;
}

async function handleRemoveEngine(id: string) {
  isDeleting.value = true;
  engineId.value = id;
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
    @set-default-engine="handleSetDefaultEngine"
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
