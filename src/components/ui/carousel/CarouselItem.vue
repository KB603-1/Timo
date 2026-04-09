<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});
</script>

<template>
  <div
    data-slot="carousel-item"
    :class="cn('min-w-0 shrink-0 grow-0 basis-full', props.class)"
  >
    <slot />
  </div>
</template>
