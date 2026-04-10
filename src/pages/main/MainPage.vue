<script setup>
import { useRouter } from 'vue-router';
import Card from '@/components/ui/card/Card.vue';
import RecentTransactions from '@/components/main/RecentTransactions.vue';
import { useRecordStore } from '@/stores/record';
import { useGroupStore } from '@/stores/group';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import GroupInfo from '@/components/GroupInfo.vue';
import MyInfo from '@/components/MyInfo.vue';
import FloatingActionButton from '@/components/FloatingActionButton.vue';
import GroupDrawer from '@/components/GroupDrawer.vue';

const router = useRouter();
const recordStore = useRecordStore();
const { expenses } = storeToRefs(recordStore);

const groupStore = useGroupStore();
const { currentGroup } = storeToRefs(groupStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const userName = computed(() => user.value?.nickname || '사용자');

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1);
const lastYear = lastMonthDate.getFullYear();
const lastMonth = lastMonthDate.getMonth();

const monthTotalExpenses = computed(() =>
  getMonthSum(currentMonth, currentYear),
);

const lastMonthTotalExpenses = computed(() => getMonthSum(lastMonth, lastYear));

// 1인당 예상 지출액 (모임 모드일 때 1/N 계산)
const perPersonAmount = computed(() => {
  if (!currentGroup.value) return 0;
  const memberCount = currentGroup.value.members?.length || 1;
  return Math.floor(monthTotalExpenses.value / memberCount);
});

const lastMonthResult = computed(() => {
  if (lastMonthTotalExpenses.value === 0) return { hasData: false };

  const percent = Math.round(
    ((lastMonthTotalExpenses.value - monthTotalExpenses.value) /
      lastMonthTotalExpenses.value) *
      100,
  );
  return { hasData: true, percent };
});

// 소비 유형
const SPENDING_TYPES = {
  식비: { label: '식도락가형', emoji: '🍽️', desc: '맛있는 걸 아는 당신!' },
  교통비: { label: '이동왕형', emoji: '🚌', desc: '어디든 달려가는 당신!' },
  문화생활: { label: '문화인형', emoji: '🎭', desc: '삶의 여유를 아는 당신!' },
};

const spendingType = computed(() => {
  if (expenses.value.length === 0) return null;
  const totals = {};
  for (const e of expenses.value) {
    const name = e.category?.name ?? '기타';
    totals[name] = (totals[name] ?? 0) + e.amount;
  }
  const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  return (
    SPENDING_TYPES[top] ?? {
      label: '절약가형',
      emoji: '💰',
      desc: '알뜰살뜰 당신!',
    }
  );
});

const getMonthSum = (month, year) =>
  expenses.value
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((acc, e) => acc + e.amount, 0);
</script>

<template>
  <!-- 상단 환영 인사 영역 -->
  <div class="mx-5 mb-5 mt-1 flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-500 mb-0.5">
        오늘도 현명한 하루 💸
      </p>
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
        <span class="text-purple-600">{{ userName }}</span
        >님, 안녕하세요!
      </h2>
    </div>
    <GroupDrawer />
  </div>

  <!-- 총 지출 영역 (개인 / 모임 모드 동적 레이아웃) -->
  <div class="mx-5 flex gap-3 items-stretch">
    <!-- 좌측: 공통 총 지출 메인 카드 -->
    <div
      @click="router.push('/stats')"
      class="flex-1 rounded-2xl bg-linear-to-br from-purple-500 to-purple-700 p-5 shadow-lg relative overflow-hidden cursor-pointer flex flex-col justify-center"
    >
      <div
        class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-purple-400/30"
      ></div>
      <div
        class="absolute right-10 bottom-2 w-16 h-16 rounded-full bg-purple-400/20"
      ></div>
      <p class="text-purple-200 text-sm">{{ currentMonth + 1 }}월 총 지출</p>
      <h1
        class="text-white font-bold mt-1"
        :class="currentGroup ? 'text-3xl' : 'text-4xl'"
      >
        {{ monthTotalExpenses.toLocaleString() }}
        <span
          class="font-semibold"
          :class="currentGroup ? 'text-xl' : 'text-2xl'"
          >원</span
        >
      </h1>
      <div
        class="mt-3 inline-flex items-center gap-1.5 bg-purple-600/50 rounded-full px-3 py-1 text-white text-[11px] self-start"
      >
        <span
          v-if="!lastMonthResult.hasData"
          class="text-green-300 font-semibold"
          >지난 달 데이터가 없어요!</span
        >
        <span
          v-else-if="lastMonthResult.percent > 0"
          class="text-green-300 font-semibold"
          >지난 달 대비 ▼ {{ lastMonthResult.percent }}% 절약</span
        >
        <span v-else class="text-green-300 font-semibold"
          >지난 달 대비 ▲ {{ Math.abs(lastMonthResult.percent) }}% 증가</span
        >
      </div>
    </div>

    <!-- 우측: 모임 상세 요약 카드 (모임 모드일 때만 표시) -->
    <div
      v-if="currentGroup"
      @click="router.push('/group')"
      class="w-32 rounded-2xl bg-white p-3.5 shadow-lg flex flex-col justify-between cursor-pointer border border-purple-50 transition hover:shadow-xl"
    >
      <div>
        <div class="flex justify-between items-start">
          <div
            class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-base"
          >
            {{ currentGroup.icon || '🏠' }}
          </div>
          <span
            class="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
          >
            👥 {{ currentGroup.members?.length || 1 }}
          </span>
        </div>
        <div class="mt-3">
          <p class="text-[10px] font-medium text-gray-400">1인당 예상</p>
          <p class="text-sm font-extrabold text-gray-800 tracking-tight mt-0.5">
            {{ perPersonAmount.toLocaleString()
            }}<span class="text-[10px] font-medium ml-0.5 text-gray-500"
              >원</span
            >
          </p>
        </div>
      </div>
      <div
        class="mt-2 flex items-center justify-between text-purple-600 bg-purple-50/50 rounded-lg px-2 py-1.5"
      >
        <span class="text-[10px] font-bold">모임 상세</span>
        <svg
          class="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </div>

  <!-- 동기부여 카드 -->
  <Card
    class="mx-5 mt-3 rounded-2xl border-0 px-4 py-3.5 gap-3 flex-row items-center shadow-sm"
  >
    <div
      class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl shrink-0"
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

  <!-- 개인 모드: 소비 유형 카드 -->
  <MyInfo v-if="!currentGroup" />

  <!-- 모임 모드: 캐러셀 (shadcn Carousel + embla) -->
  <GroupInfo v-if="currentGroup" />

  <!-- 최근 내역 -->
  <RecentTransactions />

  <!-- 우측 하단 플로팅 액션 버튼 (FAB) -->
  <FloatingActionButton />
</template>
