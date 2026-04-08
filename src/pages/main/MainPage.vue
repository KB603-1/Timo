<script setup>
import { useRouter } from 'vue-router';
import BottomNav from '@/components/BottomNav.vue';
import Card from '@/components/ui/card/Card.vue';
import Avatar from '@/components/ui/avatar/Avatar.vue';
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue';

const router = useRouter();

const categories = [
  { emoji: '🍔', label: '식비', amount: '58,500원', color: 'text-red-400' },
  { emoji: '🛍️', label: '쇼핑', amount: '53,000원', color: 'text-purple-500' },
  { emoji: '☕', label: '카페', amount: '14,000원', color: 'text-amber-400' },
  { emoji: '🚌', label: '교통', amount: '4,500원', color: 'text-blue-400' },
];

const transactions = [
  { emoji: '🍔', bg: 'bg-orange-100', title: '점심 - 제육볶음', sub: '식비 · 04/07', amount: '-12,000원' },
  { emoji: '☕', bg: 'bg-amber-100', title: '아이스 아메리카노', sub: '카페 · 04/07', amount: '-4,500원' },
  { emoji: '🚌', bg: 'bg-blue-100', title: '지하철', sub: '교통 · 04/06', amount: '-1,500원' },
  { emoji: '🛍️', bg: 'bg-purple-100', title: '옷 구매', sub: '쇼핑 · 04/06', amount: '-35,000원' },
];
</script>

<template>
  <div class="min-h-screen bg-[#f2f0fb] flex flex-col pb-24">
    <!-- 상단 헤더 -->
    <div class="flex items-center justify-between px-5 pt-6 pb-2">
      <div>
        <p class="text-xs text-gray-400">4월 7일 화요일</p>
        <h2 class="text-2xl font-bold text-gray-800 mt-0.5">안녕하세요! 👋</h2>
      </div>
      <Avatar class="w-11 h-11 bg-purple-500 shadow-md">
        <AvatarFallback class="bg-purple-500 text-xl">😊</AvatarFallback>
      </Avatar>
    </div>

    <!-- 총 지출 카드 -->
    <div
      @click="router.push('/stats')"
      class="mx-5 mt-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-5 shadow-lg relative overflow-hidden cursor-pointer"
    >
      <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-purple-400/30"></div>
      <div class="absolute right-10 bottom-2 w-16 h-16 rounded-full bg-purple-400/20"></div>

      <p class="text-purple-200 text-sm">4월 총 지출</p>
      <h1 class="text-white text-4xl font-bold mt-1">
        195,000<span class="text-2xl font-semibold">원</span>
      </h1>
      <div class="mt-3 inline-flex items-center gap-1.5 bg-purple-600/50 rounded-full px-3 py-1 text-white text-xs">
        <span class="text-green-300">↘</span>
        지난 달 대비
        <span class="text-green-300 font-semibold">▼ 56% 절약</span>
      </div>
    </div>

    <!-- 동기부여 카드 -->
    <Card class="mx-5 mt-3 rounded-2xl border-0 px-4 py-3.5 gap-0 flex-row items-center gap-3 shadow-sm">
      <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">✨</div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-800">잘 기록하고 있어요!</p>
        <p class="text-xs text-gray-400 mt-0.5">꾸준한 기록이 최고의 절약이에요</p>
      </div>
      <span class="text-purple-400 text-lg">✦</span>
    </Card>

    <!-- 카테고리 그리드 -->
    <div class="mx-5 mt-3 grid grid-cols-2 gap-3">
      <Card
        v-for="cat in categories"
        :key="cat.label"
        @click="router.push('/stats')"
        class="rounded-2xl p-4 border-0 gap-0 shadow-sm cursor-pointer"
      >
        <span class="text-2xl">{{ cat.emoji }}</span>
        <p class="text-xs text-gray-400 mt-2">{{ cat.label }}</p>
        <p class="text-base font-bold mt-0.5" :class="cat.color">{{ cat.amount }}</p>
      </Card>
    </div>

    <!-- 최근 내역 -->
    <div class="mx-5 mt-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-base font-bold text-gray-800">최근 내역</h3>
        <a href="#" class="text-xs text-purple-500 font-medium">전체보기 ›</a>
      </div>

      <div class="flex flex-col gap-2">
        <Card
          v-for="tx in transactions"
          :key="tx.title"
          class="rounded-2xl px-4 py-3.5 border-0 gap-0 flex-row items-center gap-3 shadow-sm"
        >
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0', tx.bg]">
            {{ tx.emoji }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">{{ tx.title }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ tx.sub }}</p>
          </div>
          <p class="text-sm font-semibold text-gray-700">{{ tx.amount }}</p>
        </Card>
      </div>
    </div>

    <BottomNav />
  </div>
</template>
