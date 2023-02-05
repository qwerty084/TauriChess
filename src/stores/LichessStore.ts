import { defineStore } from 'pinia';
import type { User } from '@/types/LichessApi';

export const useLichessUser = defineStore('lichess-user', {
  state: (): User => ({
    user: null,
  }),
});
