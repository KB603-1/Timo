<script setup>
import { ref, computed } from 'vue';
import PigIcon from '@/components/PigIcon.vue';

const props = defineProps({
  groupName: String,
  currentYear: Number,
  currentMonth: Number,
  totalInfo: Object,
  members: Array,
  activeTab: String, // 'expenses' | 'members' | 'play'
  budgetGoal: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close', 'changeMonth', 'update:activeTab']);

const viewMode = ref('spending'); // 'spending' | 'saving'

const currentTotal = computed(() => {
  return viewMode.value === 'spending'
    ? props.totalInfo.totalExpense
    : props.totalInfo.totalIncome;
});

const currentPerPerson = computed(() => {
  return viewMode.value === 'spending'
    ? props.totalInfo.perPersonExpense
    : props.totalInfo.perPersonIncome;
});

const progressPercent = computed(() => {
  if (props.budgetGoal <= 0) return 0;
  return Math.min(
    Math.round((currentTotal.value / props.budgetGoal) * 100),
    100,
  );
});

const isOverBudget = computed(() => {
  return viewMode.value === 'spending' && currentTotal.value > props.budgetGoal;
});

// 예산 진행률에 따른 돼지 상태 및 애니메이션 계산
const pigState = computed(() => {
  if (props.budgetGoal <= 0)
    return { variant: 'normal', class: 'animate-wiggle' };
  const p = progressPercent.value;

  if (viewMode.value === 'spending') {
    if (p < 50) return { variant: 'happy', class: 'animate-happy-shake' };
    if (p < 80) return { variant: 'normal', class: 'animate-wiggle' };
    return { variant: 'panic', class: 'animate-panic' };
  } else {
    if (p < 100) return { variant: 'happy', class: 'animate-happy-shake' };
    return { variant: 'happy', class: 'animate-bounce' };
  }
});

// 예산 진행률에 따른 색상 (pigState 기준과 동일하게 적용)
const progressColorClass = computed(() => {
  if (props.budgetGoal <= 0) return 'text-white';
  const p = progressPercent.value;

  if (viewMode.value === 'spending') {
    if (p < 50) return 'text-emerald-400';
    if (p < 80) return 'text-white';
    return 'text-red-400';
  } else {
    return 'text-emerald-400';
  }
});
</script>

<template>
  <header class="bg-[#836BC2] pt-12 text-white relative overflow-hidden">
    <div
      class="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full"
    ></div>
    <div
      class="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full"
    ></div>

    <div class="px-5 mb-4 flex items-center justify-between relative z-10">
      <div class="flex items-center gap-3">
        <button
          @click="emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm"
        >
          ✕
        </button>
        <h1 class="text-xl font-bold flex items-center gap-2">
          🏠 {{ groupName }}
        </h1>
      </div>
      <div class="flex -space-x-2">
        <div
          v-for="member in members"
          :key="member.id"
          class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm border-2 border-[#836BC2] shadow-sm z-10"
        >
          {{ member.icon }}
        </div>
      </div>
    </div>

    <div class="px-5 mb-5 flex items-center justify-center gap-4 relative z-10">
      <button
        @click="emit('changeMonth', -1)"
        class="text-white/70 hover:text-white p-2 transition"
      >
        ◀
      </button>
      <span class="text-lg font-bold tracking-wide w-32 text-center"
        >{{ currentYear }}년 {{ currentMonth }}월</span
      >
      <button
        @click="emit('changeMonth', 1)"
        class="text-white/70 hover:text-white p-2 transition"
      >
        ▶
      </button>
    </div>

    <div class="px-5 mb-8 relative z-10">
      <!-- 뷰 모드 토글 (세련된 세그먼트 컨트롤) -->
      <div class="flex justify-center mb-5 relative z-10">
        <div
          class="flex bg-white/20 p-1 rounded-2xl w-full max-w-[260px] backdrop-blur-md border border-white/10 shadow-inner"
        >
          <button
            @click="viewMode = 'spending'"
            :class="
              viewMode === 'spending'
                ? 'bg-white text-[#836BC2] shadow-md'
                : 'text-white/80 hover:text-white'
            "
            class="flex-1 py-2 rounded-xl text-xs font-extrabold transition-all"
          >
            <div class="flex items-center justify-center gap-1">
              <img
                src="../../assets/icons/spending.png"
                alt="회비통"
                class="w-5 h-5"
              />
              회비통
            </div>
          </button>
          <button
            @click="viewMode = 'saving'"
            :class="
              viewMode === 'saving'
                ? 'bg-white text-[#836BC2] shadow-md'
                : 'text-white/80 hover:text-white'
            "
            class="flex-1 py-2 rounded-xl text-xs font-extrabold transition-all"
          >
            <div class="flex items-center justify-center gap-1">
              <img
                src="../../assets/icons/coin.png"
                alt="저금통"
                class="w-6 h-6"
              />
              저금통
            </div>
          </button>
        </div>
      </div>

      <div
        class="bg-white/10 rounded-3xl p-5 border border-white/20 backdrop-blur-md shadow-lg shadow-[#836BC2]/20 transition-all duration-300"
      >
        <div
          v-if="budgetGoal > 0"
          class="flex items-center gap-3 min-[360px]:gap-4 sm:gap-5"
        >
          <!-- 좌측: 원형 프로그레스 바 -->
          <div
            class="relative w-16 h-16 min-[360px]:w-20 min-[360px]:h-20 sm:w-24 sm:h-24 shrink-0"
          >
            <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
              <path
                class="text-white/20"
                stroke-width="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                :class="progressColorClass"
                stroke-dasharray="100, 100"
                :stroke-dashoffset="100 - progressPercent"
                stroke-linecap="round"
                stroke-width="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div
              class="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span
                class="text-base min-[360px]:text-lg sm:text-xl font-bold tracking-tighter transition-colors duration-500"
                :class="progressColorClass"
                >{{ progressPercent
                }}<span
                  class="text-[10px] sm:text-xs font-semibold text-white/70"
                >
                  %</span
                ></span
              >
            </div>
          </div>

          <!-- 우측: 금액 정보와 돼지 -->
          <div class="flex flex-col flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <div class="flex-1 min-w-0">
                <p class="text-[11px] text-white/80 font-medium mb-0.5">
                  {{ viewMode === 'spending' ? '현재 지출' : '모은 금액' }}
                </p>
                <div class="flex items-baseline gap-0.5">
                  <p
                    class="text-lg min-[360px]:text-xl sm:text-2xl font-extrabold text-white truncate"
                  >
                    {{ currentTotal.toLocaleString() }}
                  </p>
                  <span class="text-sm font-medium text-white/80 shrink-0"
                    >원</span
                  >
                </div>
              </div>
              <!-- 상태에 따라 변하는 돼지 아이콘 -->
              <div
                class="w-8 h-8 min-[360px]:w-10 min-[360px]:h-10 sm:w-12 sm:h-12 shrink-0 drop-shadow-md origin-bottom"
                :class="pigState.class"
              >
                <PigIcon
                  :variant="pigState.variant"
                  eyeColor="#836BC2"
                  bodyColor="white"
                  noseSpotColor="#b09ddb"
                />
              </div>
            </div>

            <div class="mt-3 bg-black/10 rounded-lg p-2 border border-white/5">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] text-white/60">{{
                  viewMode === 'spending' ? '지출한도' : '목표예산'
                }}</span>
                <span class="text-[10px] text-white/90 font-bold"
                  >{{ budgetGoal.toLocaleString() }}원</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-white/60">1인 평균</span>
                <span class="text-[10px] text-white/90 font-bold"
                  >{{ currentPerPerson.toLocaleString() }}원</span
                >
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mt-4 pt-3 border-t border-white/10 text-center">
          <p class="text-[10px] text-white/60">
            멤버 관리 탭에서 그룹 예산을 설정해보세요!
          </p>
        </div>
      </div>
    </div>

    <div class="relative px-5 z-10">
      <div class="flex relative">
        <button
          @click="emit('update:activeTab', 'expenses')"
          class="flex-1 pb-4 text-center text-sm font-bold transition-colors"
          :class="activeTab === 'expenses' ? 'text-white' : 'text-white/50'"
        >
          수입 / 지출
        </button>
        <button
          @click="emit('update:activeTab', 'members')"
          class="flex-1 pb-4 text-center text-sm font-bold transition-colors"
          :class="activeTab === 'members' ? 'text-white' : 'text-white/50'"
        >
          멤버 관리
        </button>
        <button
          @click="emit('update:activeTab', 'play')"
          class="flex-1 pb-4 text-center text-sm font-bold transition-colors"
          :class="activeTab === 'play' ? 'text-white' : 'text-white/50'"
        >
          플레이 🎲
        </button>
      </div>
      <div class="absolute bottom-0 left-5 right-5 h-[1px] bg-white/20"></div>
      <div
        class="absolute bottom-0 h-1 bg-white rounded-t-md transition-transform duration-300 ease-out shadow-[0_-2px_10px_rgba(255,255,255,0.3)]"
        style="width: calc((100% - 2.5rem) / 3)"
        :class="{
          'translate-x-0': activeTab === 'expenses',
          'translate-x-[100%]': activeTab === 'members',
          'translate-x-[200%]': activeTab === 'play',
        }"
      ></div>
    </div>
  </header>
</template>

<style scoped>
/* 기분 좋게 흔들리는 애니메이션 */
@keyframes happy-shake {
  0%,
  100% {
    transform: rotate(-7deg);
  }
  50% {
    transform: rotate(7deg);
  }
}
.animate-happy-shake {
  animation: happy-shake 1s ease-in-out infinite;
}

/* 가볍게 흔들리는 애니메이션 */
@keyframes wiggle {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}
.animate-wiggle {
  animation: wiggle 1.2s ease-in-out infinite;
}

/* 다급하게 뛰어다니는 애니메이션 (패닉) */
@keyframes panic {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-2px, -2px) rotate(-5deg);
  }
  50% {
    transform: translate(2px, 2px) rotate(5deg);
  }
  75% {
    transform: translate(-2px, 2px) rotate(-5deg);
  }
  100% {
    transform: translate(2px, -2px) rotate(5deg);
  }
}
.animate-panic {
  animation: panic 0.5s linear infinite;
}
</style>
