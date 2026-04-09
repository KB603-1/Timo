<script setup>
import {useModalStore} from "@/stores/modal.js";
import {Dialog, DialogContent} from "@/components/ui/dialog/index.js";

const modal = useModalStore();
</script>

<template>
  <Dialog :open="modal.isOpen" @update:open="modal.closeModal">
    <DialogContent class="max-h-[90vh] overflow-y-auto overflow-x-hidden">
      <component
          v-if="modal.component"
          :is="modal.component"
          v-bind="modal.props"
          @close="modal.closeModal"
      />
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>