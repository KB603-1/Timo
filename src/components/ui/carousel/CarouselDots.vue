<script setup>
import { inject } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});

const carousel = inject('carousel');
</script>

<template>
  <div :class="cn('flex justify-center gap-2', props.class)">
    <button
      v-for="(_, i) in carousel.scrollSnaps"
      :key="i"
      @click="carousel.scrollTo(i)"
      :class="cn(
        'rounded-full transition-all duration-200',
        carousel.selectedIndex === i ? 'w-5 h-2 bg-purple-600' : 'w-2 h-2 bg-gray-300'
      )"
    />
  </div>
</template>
