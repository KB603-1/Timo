<script setup>
import { TabsContent as TabsContentPrimitive } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  value: { type: String, required: true },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});
</script>

<template>
  <TabsContentPrimitive
    data-slot="tabs-content"
    :value="value"
    :class="cn('outline-none', props.class)"
  >
    <slot />
  </TabsContentPrimitive>
</template>
