import { defineStore } from 'pinia';
import type { User } from '@/types/ChessApi';

export const useChessUser = defineStore('chess-user', {
  state: (): User => ({
    user: null,
  }),
});
