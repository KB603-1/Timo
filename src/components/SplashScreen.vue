<template>
  <div class="splash">
    <div class="logo-row">
      <span ref="tRef" class="t-letter">T</span>
      <span class="im-text">im</span>
      <div ref="pigRef" class="pig-slot">
        <svg viewBox="0 0 100 112" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">
          <circle cx="24" cy="26" r="18" fill="white" />
          <circle cx="76" cy="26" r="18" fill="white" />
          <rect x="68" y="11" width="16" height="6" rx="3" fill="#7c5cbf" />
          <circle cx="50" cy="68" r="44" fill="white" />
          <circle cx="37" cy="58" r="5.5" fill="#7c5cbf" />
          <circle cx="63" cy="58" r="5.5" fill="#7c5cbf" />
          <ellipse cx="50" cy="76" rx="14" ry="11" fill="#e0ccf5" />
          <circle cx="44" cy="77" r="3.5" fill="#b09ddb" />
          <circle cx="56" cy="77" r="3.5" fill="#b09ddb" />
          <rect x="32" y="106" width="16" height="10" rx="5" fill="white" />
          <rect x="52" y="106" width="16" height="10" rx="5" fill="white" />
        </svg>
      </div>
    </div>

    <p class="tagline" :class="{ visible: done }">당신의 소비를 똑똑하게</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['finish'])

const pigRef = ref(null)
const tRef   = ref(null)
const done   = ref(false)

let rafId = null

function lerp(a, b, t) { return a + (b - a) * t }
function easeIn(t)  { return t * t }
function easeOut(t) { return 1 - Math.pow(1 - t, 3) }

function animateT() {
  const el  = tRef.value
  const dur = 400
  const times  = [0, 0.35, 1]
  const sxVals = [1, 1.24, 1]
  const syVals = [1, 0.58, 1]
  let start = null

  function tick(ts) {
    if (!start) start = ts
    const p = Math.min((ts - start) / dur, 1)

    let idx = 0
    for (let i = 0; i < times.length - 1; i++) {
      if (p >= times[i] && p <= times[i + 1]) idx = i
    }
    const lt = (p - times[idx]) / (times[idx + 1] - times[idx])
    const sx = lerp(sxVals[idx], sxVals[idx + 1], lt)
    const sy = lerp(syVals[idx], syVals[idx + 1], lt)
    el.style.transform = `scaleX(${sx}) scaleY(${sy})`

    if (p < 1) requestAnimationFrame(tick)
    else el.style.transform = ''
  }
  requestAnimationFrame(tick)
}

async function runAnim() {
  await document.fonts.ready

  const pigEl    = pigRef.value
  const splashEl = pigEl.closest('.splash')

  const splashR = splashEl.getBoundingClientRect()
  const pigR    = pigEl.getBoundingClientRect()
  const tR      = tRef.value.getBoundingClientRect()

  const pigCX = pigR.left - splashR.left + pigR.width  / 2
  const pigCY = pigR.top  - splashR.top  + pigR.height / 2

  const startX = -pigCX - pigR.width  * 0.1
  const startY = -pigCY - pigR.height * 0.1

  const tLandX = (tR.left + tR.width / 2 - splashR.left) - pigCX
  const tLandY = (tR.top  - splashR.top) - pigR.height / 2 - pigCY

  const peakX = tLandX * 0.25
  const peakY = tLandY - 80

  const DURATION = 1600
  const T_HIT    = 0.40
  const T_PEAK   = 0.60
  const T_SQUASH = 0.84

  pigEl.style.opacity   = '1'
  pigEl.style.transform = ''

  let startTime = null
  let tShook    = false
  done.value    = false

  function frame(ts) {
    if (!startTime) startTime = ts
    const p = Math.min((ts - startTime) / DURATION, 1)

    let x, y, sx, sy

    if (p <= T_HIT) {
      const t = p / T_HIT
      x = lerp(startX, tLandX, easeOut(t))
      y = lerp(startY, tLandY, easeIn(t))
      sx = 1; sy = 1
    } else if (p <= T_PEAK) {
      const t = (p - T_HIT) / (T_PEAK - T_HIT)
      x  = lerp(tLandX, peakX, easeOut(t))
      y  = lerp(tLandY, peakY, easeOut(t))
      sx = lerp(1.28, 0.86, easeOut(t))
      sy = lerp(0.68, 1.20, easeOut(t))
    } else if (p <= T_SQUASH) {
      const t = (p - T_PEAK) / (T_SQUASH - T_PEAK)
      x  = lerp(peakX, 0, easeIn(t))
      y  = lerp(peakY, -8, easeIn(t))
      sx = lerp(0.86, 1.22, t)
      sy = lerp(1.20, 0.74, t)
    } else {
      const t = (p - T_SQUASH) / (1 - T_SQUASH)
      x  = 0
      y  = lerp(-8, 0, easeOut(t))
      sx = lerp(1.22, 1, easeOut(t))
      sy = lerp(0.74, 1, easeOut(t))
    }

    pigEl.style.transform = `translate(${x}px, ${y}px) scaleX(${sx}) scaleY(${sy})`

    if (p >= T_HIT && !tShook) {
      tShook = true
      animateT()
    }

    if (p < 1) {
      rafId = requestAnimationFrame(frame)
    } else {
      pigEl.style.transform = 'translate(0,0) scaleX(1) scaleY(1)'
      setTimeout(() => {
        done.value = true
        // 태그라인 페이드인(0.55s) 후 앱으로 전환
        setTimeout(() => emit('finish'), 800)
      }, 200)
    }
  }

  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  setTimeout(runAnim, 300)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;800&display=swap');

.splash {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #7c5cbf;
  z-index: 9999;
}

.logo-row {
  display: flex;
  align-items: flex-end;
  font-family: 'Nunito', 'Arial Rounded MT Bold', sans-serif;
  font-size: clamp(64px, 12vw, 120px);
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
  line-height: 1;
  user-select: none;
}

.t-letter {
  display: inline-block;
  transform-origin: bottom center;
}

.im-text {
  display: inline-block;
}

.pig-slot {
  width: clamp(38px, 6.8vw, 70px);
  height: clamp(50px, 8.8vw, 90px);
  flex-shrink: 0;
  margin-bottom: clamp(4px, 0.8vw, 9px);
  transform-origin: bottom center;
  opacity: 0;
}

.tagline {
  position: absolute;
  bottom: 30%;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Nunito', sans-serif;
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 500;
  letter-spacing: 0.08em;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.tagline.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
