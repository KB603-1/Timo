import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/page/MainPage.vue';
import ChartPage from '@/page/ChartPage.vue';
import AddPage from '@/page/AddPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: MainPage },
    { path: '/stats', component: ChartPage },
    { path: '/add', component: AddPage },
  ],
});

export default router;
