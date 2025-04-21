import { createRouter, createWebHistory } from 'vue-router'
import GameScreen from '@/components/GameScreen.vue'
import FlipCoin from '@/components/FlipCoin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GameScreen',
      component: GameScreen,
    },
    {
      path: '/FlipCoin',
      name: 'FlipCoin',
      component: FlipCoin,
    },
  ],
})

export default router
