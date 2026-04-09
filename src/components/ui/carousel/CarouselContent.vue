<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import EmblaCarousel from 'embla-carousel';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});

const state = inject('carousel');
const viewportEl = ref(null);
let api = null;

onMounted(() => {
  if (!viewportEl.value) return;
  api = EmblaCarousel(viewportEl.value, state.opts);
  state.scrollSnaps = api.scrollSnapList();
  state.selectedIndex = api.selectedScrollSnap();
  state.scrollTo = (i) => api.scrollTo(i);
  api.on('select', () => {
    state.selectedIndex = api.selectedScrollSnap();
  });
});

onBeforeUnmount(() => {
  api?.destroy();
});
</script>

<template>
  <div ref="viewportEl" class="overflow-hidden rounded-2xl">
    <div data-slot="carousel-content" :class="cn('flex', props.class)">
      <slot />
    </div>
  </div>
</template>
