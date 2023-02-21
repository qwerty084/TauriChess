import { defineStore } from 'pinia';

export const useUser = defineStore('user', {
  state: () => ({
    user: null,
    hasInternetConnection: true,
  }),
});
