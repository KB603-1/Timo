<script setup>
import { TabsList as TabsListPrimitive } from 'reka-ui';
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
  <TabsListPrimitive
    data-slot="tabs-list"
    :class="cn('inline-flex items-center justify-center', props.class)"
  >
    <slot />
  </TabsListPrimitive>
</template>
