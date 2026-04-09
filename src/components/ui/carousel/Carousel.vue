<script setup>
import { provide, reactive } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps({
  opts: { type: Object, required: false },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});

const state = reactive({
  opts: props.opts ?? {},
  selectedIndex: 0,
  scrollSnaps: [],
  scrollTo: null,
});

provide('carousel', state);
</script>

<template>
  <div data-slot="carousel" :class="cn('relative', props.class)">
    <slot />
  </div>
</template>
