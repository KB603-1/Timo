<script setup>
import { TabsTrigger as TabsTriggerPrimitive } from 'reka-ui';
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
  <TabsTriggerPrimitive
    data-slot="tabs-trigger"
    :value="value"
    :class="cn(
      'flex-1 h-full rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
      'text-gray-500',
      'data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm',
      props.class
    )"
  >
    <slot />
  </TabsTriggerPrimitive>
</template>
