<script setup>
import { ref, computed } from 'vue';

// --- 상태 관리 ---
const activeTab = ref('expenses'); // 'expenses' | 'members' | 'play'
const groupName = ref('자취방 친구들');

// 요약 정보
const totalInfo = ref({
  totalAmount: 130000,
  perPersonAmount: 43333,
});

// 지출 내역 더미 데이터
const expenses = ref([
  {
    id: 1,
    title: '치킨',
    payer: '지수',
    date: '04/05',
    amount: 30000,
    icon: '🍔',
  },
  {
    id: 2,
    title: '세탁기 세제',
    payer: '민준',
    date: '04/04',
    amount: 15000,
    icon: '🏠',
  },
  {
    id: 3,
    title: '공과금',
    payer: '나',
    date: '04/03',
    amount: 60000,
    icon: '🏠',
  },
  {
    id: 4,
    title: '편의점',
    payer: '지수',
    date: '04/02',
    amount: 25000,
    icon: '🍔',
  },
]);

// 멤버 더미 데이터
const members = ref([
  { id: 'u1', nickname: '나', icon: '😊', role: 'owner', amount: 60000 },
  { id: 'u2', nickname: '지수', icon: '🐱', role: 'member', amount: 55000 },
  { id: 'u3', nickname: '민준', icon: '🐸', role: 'member', amount: 15000 },
]);

// --- 핸들러 함수 ---
const handleClose = () => console.log('메인 화면으로 돌아가기');
const handleDeleteExpense = (id) => console.log('지출 내역 삭제:', id);
const copyInviteLink = () => alert('초대 링크가 복사되었습니다!');
const removeMember = (nickname) => {
  if (confirm(`${nickname}님을 그룹에서 내보내시겠습니까?`)) {
    console.log('멤버 강퇴:', nickname);
  }
};

// ==========================================
// [탭 3] 플레이 영역을 위한 추가 로직
// ==========================================

// 1. 랭킹 계산
const rankings = computed(() => {
  // 멤버들을 지출 금액 내림차순으로 정렬한 새 배열
  const sorted = [...members.value].sort((a, b) => b.amount - a.amount);

  if (sorted.length < 2) return [];

  return [
    {
      title: '이번 달 결제왕 👑',
      desc: '가장 지갑을 많이 연 대인배',
      user: sorted[0],
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
    },
    {
      title: '이번 달 짠돌이 🪙',
      desc: '가장 돈을 적게 쓴 절약왕',
      user: sorted[sorted.length - 1],
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
  ];
});

// 2. 랜덤 룰렛 로직
const isSpinning = ref(false);
const rouletteWinner = ref(null);
const currentSpinItem = ref({ icon: '🎯', nickname: '누가 걸릴까?' });

const spinRoulette = () => {
  if (isSpinning.value || members.value.length === 0) return;

  isSpinning.value = true;
  rouletteWinner.value = null;

  let elapsed = 0;
  let intervalTime = 50; // 처음엔 0.05초마다 아주 빠르게 넘어감
  const totalDuration = 3000; // 총 3초 동안 진행

  // 재귀적으로 setTimeout을 호출하여 점점 느려지는 효과 구현
  const spin = () => {
    // 랜덤으로 아무 멤버나 화면에 띄움
    const randomMember =
      members.value[Math.floor(Math.random() * members.value.length)];
    currentSpinItem.value = {
      icon: randomMember.icon,
      nickname: randomMember.nickname,
    };

    elapsed += intervalTime;
    intervalTime *= 1.1; // 호출될 때마다 10%씩 느려짐 (마찰력 효과)

    if (elapsed < totalDuration) {
      setTimeout(spin, intervalTime);
    } else {
      // 스핀 종료 후 진짜 당첨자 결정
      const finalWinner =
        members.value[Math.floor(Math.random() * members.value.length)];
      rouletteWinner.value = finalWinner;
      isSpinning.value = false;
    }
  };
  spin();
};
</script>

<template>
  <div class="min-h-screen bg-[#f4f3ff] flex flex-col">
    <header class="bg-violet-600 pt-12 text-white">
      <div class="px-5 mb-6 flex items-center gap-3">
        <button
          @click="handleClose"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
        >
          ✕
        </button>
        <h1 class="text-xl font-bold flex items-center gap-2">
          🏠 {{ groupName }}
        </h1>
      </div>

      <div class="px-5 mb-6">
        <div
          class="bg-white/10 rounded-2xl p-5 border border-white/20 flex justify-between items-center backdrop-blur-sm shadow-sm"
        >
          <div>
            <p class="text-xs text-violet-200 mb-1 font-medium">총 지출</p>
            <p class="text-2xl font-bold">
              {{ totalInfo.totalAmount.toLocaleString() }}원
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-violet-200 mb-1 font-medium">1인당</p>
            <p class="text-lg font-semibold">
              {{ totalInfo.perPersonAmount.toLocaleString() }}원
            </p>
          </div>
        </div>
      </div>

      <div class="relative px-5">
        <div class="flex relative z-10">
          <button
            @click="activeTab = 'expenses'"
            class="flex-1 pb-4 text-center text-sm font-medium transition-colors"
            :class="activeTab === 'expenses' ? 'text-white' : 'text-violet-300'"
          >
            지출 내역
          </button>
          <button
            @click="activeTab = 'members'"
            class="flex-1 pb-4 text-center text-sm font-medium transition-colors"
            :class="activeTab === 'members' ? 'text-white' : 'text-violet-300'"
          >
            멤버 관리
          </button>
          <button
            @click="activeTab = 'play'"
            class="flex-1 pb-4 text-center text-sm font-medium transition-colors"
            :class="activeTab === 'play' ? 'text-white' : 'text-violet-300'"
          >
            플레이
          </button>
        </div>

        <div
          class="absolute bottom-0 left-5 right-5 h-[1px] bg-violet-400/30"
        ></div>
        <div
          class="absolute bottom-0 h-1 bg-white rounded-t-md transition-transform duration-300 ease-out"
          style="width: calc((100% - 2.5rem) / 3)"
          :class="{
            'translate-x-0': activeTab === 'expenses',
            'translate-x-[100%]': activeTab === 'members',
            'translate-x-[200%]': activeTab === 'play',
          }"
        ></div>
      </div>
    </header>

    <main class="flex-1 px-5 py-6">
      <div
        v-show="activeTab === 'expenses'"
        class="animate-in fade-in duration-300"
      >
        <button
          class="w-full border-2 border-dashed border-violet-300 text-violet-600 rounded-2xl py-4 font-medium mb-6 hover:bg-violet-50 transition flex items-center justify-center gap-2"
        >
          <span>+</span> 지출 추가
        </button>

        <div class="space-y-3">
          <div
            v-for="expense in expenses"
            :key="expense.id"
            class="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div class="flex items-center gap-4">
              <div
                class="text-3xl bg-slate-50 rounded-xl w-12 h-12 flex items-center justify-center"
              >
                {{ expense.icon }}
              </div>
              <div>
                <p class="font-bold text-slate-900 mb-0.5">
                  {{ expense.title }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ expense.payer }} 결제 · {{ expense.date }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-bold text-slate-900"
                >{{ expense.amount.toLocaleString() }}원</span
              >
              <button
                @click="handleDeleteExpense(expense.id)"
                class="text-red-400 hover:text-red-600 p-1"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="activeTab === 'members'"
        class="animate-in fade-in duration-300"
      >
        <button
          @click="copyInviteLink"
          class="w-full bg-violet-100 text-violet-700 rounded-2xl py-4 font-semibold mb-6 hover:bg-violet-200 transition flex items-center justify-center gap-2"
        >
          🔗 초대 링크 복사하기
        </button>

        <div class="space-y-3">
          <div
            v-for="member in members"
            :key="member.id"
            class="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div class="flex items-center gap-4">
              <div
                class="text-2xl bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center border border-slate-100 shadow-sm"
              >
                {{ member.icon }}
              </div>
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <p class="font-bold text-slate-900">{{ member.nickname }}</p>
                  <span
                    v-if="member.role === 'owner'"
                    class="px-2 py-0.5 bg-violet-100 text-violet-600 text-[10px] font-bold rounded-md"
                    >방장</span
                  >
                </div>
                <p class="text-xs text-slate-500">
                  결제액: {{ member.amount.toLocaleString() }}원
                </p>
              </div>
            </div>
            <button
              v-if="member.role !== 'owner'"
              @click="removeMember(member.nickname)"
              class="text-xs font-medium text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 px-3 py-2 rounded-lg transition"
            >
              내보내기
            </button>
          </div>
        </div>
      </div>

      <div
        v-show="activeTab === 'play'"
        class="animate-in fade-in duration-300 space-y-6 pb-10"
      >
        <div>
          <h2 class="text-lg font-bold text-slate-800 mb-3 ml-1">
            🏆 명예의 전당
          </h2>
          <div class="space-y-3">
            <div
              v-for="(rank, idx) in rankings"
              :key="idx"
              class="rounded-2xl p-4 flex flex-col gap-1 shadow-sm"
              :class="rank.bg"
            >
              <div class="flex items-center gap-4 mb-1">
                <div
                  class="text-3xl bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-sm shrink-0"
                >
                  {{ rank.user.icon }}
                </div>
                <div class="flex-1">
                  <p class="font-bold text-sm mb-0.5" :class="rank.text">
                    {{ rank.title }}
                  </p>
                  <div class="flex items-end justify-between">
                    <span class="font-extrabold text-xl text-slate-900">{{
                      rank.user.nickname
                    }}</span>
                    <span class="font-bold text-lg text-slate-700"
                      >{{ rank.user.amount.toLocaleString() }}원</span
                    >
                  </div>
                </div>
              </div>
              <p class="text-xs font-medium text-slate-500 text-right">
                {{ rank.desc }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300"
          ></div>

          <h2 class="text-lg font-bold text-slate-800 mb-1">
            🎲 이번엔 누가 쏠까?
          </h2>
          <p class="text-sm text-slate-500 mb-6">
            남은 잔돈이나 다음 결제자를 뽑아보세요!
          </p>

          <div class="h-36 flex flex-col items-center justify-center mb-6">
            <div v-if="isSpinning" class="flex flex-col items-center w-full">
              <div
                class="text-5xl mb-3 bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-slate-200 fast-spin-blur"
              >
                {{ currentSpinItem.icon }}
              </div>
              <p class="text-xl font-bold text-slate-400">
                {{ currentSpinItem.nickname }}
              </p>
            </div>

            <div
              v-else-if="rouletteWinner"
              class="animate-in zoom-in duration-300 flex flex-col items-center w-full"
            >
              <div
                class="text-6xl mb-3 bg-violet-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-violet-200 winner-bounce"
              >
                {{ rouletteWinner.icon }}
              </div>
              <p class="text-2xl font-bold text-slate-900">
                당첨!
                <span class="text-violet-600">{{
                  rouletteWinner.nickname
                }}</span>
              </p>
            </div>

            <div v-else class="text-slate-300 flex flex-col items-center">
              <div class="text-6xl mb-2">🎯</div>
              <p class="text-sm font-medium">버튼을 눌러 돌려주세요</p>
            </div>
          </div>

          <button
            @click="spinRoulette"
            :disabled="isSpinning"
            class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold text-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md relative overflow-hidden"
          >
            <div
              v-if="isSpinning"
              class="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%] animate-sweep"
            ></div>
            {{ isSpinning ? '뽑는 중...' : '랜덤 뽑기 시작!' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
.zoom-in {
  animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 룰렛 돌아갈 때 약간 흔들리며 잔상이 남는 듯한 효과 */
.fast-spin-blur {
  animation: shake 0.1s infinite alternate;
}

/* 당첨되었을 때 통통 튀는 효과 */
.winner-bounce {
  animation: popBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 버튼 안쪽 반짝임 효과 */
.animate-sweep {
  animation: sweep 1.5s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shake {
  0% {
    transform: translateY(-2px) scale(0.98);
  }
  100% {
    transform: translateY(2px) scale(1.02);
  }
}

@keyframes popBounce {
  0% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes sweep {
  0% {
    transform: translateX(-150%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}
</style>
