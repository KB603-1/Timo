<script setup>
import { useRouter } from 'vue-router';
import BottomNav from '@/components/BottomNav.vue';
import Card from '@/components/ui/card/Card.vue';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '@/components/ui/carousel';
import { useRecordStore } from '@/stores/record';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

const router = useRouter();
const recordStore = useRecordStore();
const { expenses } = storeToRefs(recordStore);

const totalExpenses = computed(() => {
  let sum = 0;
  for (const expense of expenses.value) {
    sum += expense.amount;
  }
  return sum;
});

onMounted(() => {
  recordStore.fetchRecord();
});

const activeTab = ref('개인');

const transactions = [
  {
    emoji: '🍔',
    bg: 'bg-orange-100',
    title: '점심 식사',
    sub: '오늘 12:30',
    amount: '-12,000원',
  },
  {
    emoji: '🚌',
    bg: 'bg-blue-100',
    title: '교통카드',
    sub: '오늘 09:10',
    amount: '-1,500원',
  },
  {
    emoji: '☕',
    bg: 'bg-yellow-100',
    title: '카페라떼',
    sub: '어제 15:00',
    amount: '-5,500원',
  },
];
</script>

<template>
  <div class="min-h-screen bg-[#f2f0fb] flex flex-col pb-24">
    <!-- 상단 헤더 -->
    <div class="flex items-center justify-between px-5 pt-6 pb-2">
      <div>
        <p class="text-xs text-gray-400">4월 9일 목요일</p>
        <h2 class="text-2xl font-bold text-gray-800 mt-0.5">안녕하세요! 👋</h2>
      </div>

      <!-- 개인/그룹 토글 (shadcn Tabs) -->
      <Tabs v-model="activeTab" default-value="개인">
        <TabsList class="bg-gray-200 rounded-full p-1 h-9 w-[120px]">
          <TabsTrigger value="개인">개인</TabsTrigger>
          <TabsTrigger value="그룹">그룹</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <!-- 총 지출 카드 -->
    <div
      @click="router.push('/stats')"
      class="mx-5 mt-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-5 shadow-lg relative overflow-hidden cursor-pointer"
    >
      <div
        class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-purple-400/30"
      ></div>
      <div
        class="absolute right-10 bottom-2 w-16 h-16 rounded-full bg-purple-400/20"
      ></div>
      <p class="text-purple-200 text-sm">4월 총 지출</p>
      <h1 class="text-white text-4xl font-bold mt-1">
        {{ totalExpenses.toLocaleString()
        }}<span class="text-2xl font-semibold">원</span>
      </h1>
      <div
        class="mt-3 inline-flex items-center gap-1.5 bg-purple-600/50 rounded-full px-3 py-1 text-white text-xs"
      >
        <span class="text-green-300">↘</span>
        지난 달 대비
        <span class="text-green-300 font-semibold">▼ 56% 절약</span>
      </div>
    </div>

    <!-- 동기부여 카드 -->
    <Card
      class="mx-5 mt-3 rounded-2xl border-0 px-4 py-3.5 gap-0 flex-row items-center gap-3 shadow-sm"
    >
      <div
        class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0"
      >
        ✨
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-800">잘 기록하고 있어요!</p>
        <p class="text-xs text-gray-400 mt-0.5">
          꾸준한 기록이 최고의 절약이에요
        </p>
      </div>
      <span class="text-purple-400 text-lg">✦</span>
    </Card>

    <!-- 캐러셀 (shadcn Carousel + embla) -->
    <Carousel
      class="mx-5 mt-3"
      :opts="{ align: 'center', containScroll: false }"
    >
      <CarouselContent class="gap-3">
        <!-- 슬라이드 1: 이달의 지출왕 -->
        <CarouselItem class="basis-[88%]">
          <div
            class="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 flex flex-col h-[300px]"
          >
            <span
              class="inline-flex items-center gap-1.5 bg-purple-400/40 text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-4"
            >
              🏆 이달의 지출왕
            </span>
            <div class="flex flex-col flex-1 justify-between">
              <div
                class="flex items-center bg-purple-400/30 rounded-xl px-4 py-3.5"
              >
                <span class="text-2xl mr-3">👑</span>
                <span class="flex-1 text-white font-semibold text-base"
                  >김민준</span
                >
                <span
                  class="bg-purple-700/60 text-white text-sm font-bold px-3 py-1 rounded-lg"
                  >312,000원</span
                >
              </div>
              <div
                class="flex items-center bg-purple-400/30 rounded-xl px-4 py-3.5"
              >
                <span class="text-2xl mr-3">🥈</span>
                <span class="flex-1 text-white font-semibold text-base"
                  >나</span
                >
                <span
                  class="bg-purple-700/60 text-white text-sm font-bold px-3 py-1 rounded-lg"
                  >195,000원</span
                >
              </div>
              <div
                class="flex items-center bg-purple-400/30 rounded-xl px-4 py-3.5"
              >
                <span class="text-2xl mr-3">🥉</span>
                <span class="flex-1 text-white font-semibold text-base"
                  >이수연</span
                >
                <span
                  class="bg-purple-700/60 text-white text-sm font-bold px-3 py-1 rounded-lg"
                  >129,000원</span
                >
              </div>
            </div>
          </div>
        </CarouselItem>

        <!-- 슬라이드 2: 그룹 공동 목표 -->
        <CarouselItem class="basis-[88%]">
          <div
            class="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 flex flex-col h-[300px]"
          >
            <span
              class="inline-flex items-center gap-1.5 bg-purple-400/40 text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-3"
            >
              🎯 그룹 공동 목표
            </span>
            <p class="text-purple-200 text-sm">이번 달 그룹 목표</p>
            <p class="text-white text-3xl font-bold mt-1">
              600,000<span class="text-xl font-semibold">원</span>
            </p>
            <p class="text-purple-200 text-xs mt-1">
              현재 482,000원 사용 중 · 남은 예산 118,000원
            </p>
            <div class="mt-3">
              <div class="w-full bg-purple-400/30 rounded-full h-2.5">
                <div
                  class="bg-teal-300 h-2.5 rounded-full"
                  style="width: 80%"
                ></div>
              </div>
              <div class="flex justify-between text-purple-200 text-xs mt-1">
                <span>0원</span>
                <span class="font-semibold text-white">80% 달성</span>
                <span>600,000원</span>
              </div>
            </div>
            <div class="flex gap-2 mt-3 flex-1 items-end">
              <div
                v-for="m in [
                  { name: '나', pct: '40%' },
                  { name: '김민준', pct: '33%' },
                  { name: '이수연', pct: '27%' },
                ]"
                :key="m.name"
                class="flex-1 bg-purple-400/30 rounded-xl py-2.5 flex flex-col items-center"
              >
                <span class="w-2 h-2 rounded-full bg-purple-300 mb-1.5"></span>
                <span class="text-purple-200 text-xs">{{ m.name }}</span>
                <span class="text-white text-sm font-bold mt-0.5">{{
                  m.pct
                }}</span>
              </div>
            </div>
          </div>
        </CarouselItem>

        <!-- 슬라이드 3: 멍청 비용 -->
        <CarouselItem class="basis-[88%]">
          <div
            class="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 flex flex-col h-[300px]"
          >
            <span
              class="inline-flex items-center gap-1.5 bg-purple-400/40 text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-2"
            >
              🐔 멍청 비용
            </span>
            <p class="text-purple-200 text-sm">이번 달 아까운 지출</p>
            <p class="text-white text-3xl font-bold mt-1 mb-3">
              47,500<span class="text-xl font-semibold">원</span>
            </p>
            <div class="flex flex-col flex-1 justify-between">
              <div
                v-for="item in [
                  {
                    emoji: '🛒',
                    label: '충동구매 (옷)',
                    tag: '후회',
                    amount: '35,000원',
                  },
                  {
                    emoji: '🧋',
                    label: '비싼 음료',
                    tag: '과소비',
                    amount: '8,500원',
                  },
                  {
                    emoji: '📦',
                    label: '미사용 구독',
                    tag: '낭비',
                    amount: '4,000원',
                  },
                ]"
                :key="item.label"
                class="flex items-center bg-purple-400/30 rounded-xl px-3 py-2.5"
              >
                <span class="text-lg mr-2.5 flex-shrink-0">{{
                  item.emoji
                }}</span>
                <span
                  class="flex-1 text-white text-sm font-medium min-w-0 truncate mr-2"
                  >{{ item.label }}</span
                >
                <span
                  class="bg-purple-300/30 text-purple-100 text-xs px-2 py-0.5 rounded-full mr-2 flex-shrink-0"
                  >{{ item.tag }}</span
                >
                <span class="text-white text-sm font-bold flex-shrink-0">{{
                  item.amount
                }}</span>
              </div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>

      <!-- Dot indicator -->
      <CarouselDots class="mt-3" />
    </Carousel>

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
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0',
              tx.bg,
            ]"
          >
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
