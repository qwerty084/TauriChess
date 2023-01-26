import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/settings',
      component: () => import('@/views/SettingsView.vue'),
    },
    {
      path: '/play',
      component: () => import('@/views/PlayView.vue'),
    },
    {
      path: '/study',
      component: () => import('@/views/StudyView.vue'),
    },
    {
      path: '/profile',
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
});

export default router;
