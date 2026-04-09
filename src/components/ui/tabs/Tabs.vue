<script setup>
import { TabsRoot } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps({
  defaultValue: { type: String, required: false },
  modelValue: { type: String, required: false },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});

const emits = defineEmits(['update:modelValue']);
</script>

<template>
  <TabsRoot
    data-slot="tabs"
    :default-value="defaultValue"
    :model-value="modelValue"
    :class="cn('flex flex-col', props.class)"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <slot />
  </TabsRoot>
</template>
