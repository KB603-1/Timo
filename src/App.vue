<script setup>
import {useRecordStore} from "@/stores/record.js";
import GlobalModal from "@/components/GlobalModal.vue";

const recordStore = useRecordStore();
recordStore.fetchCategories();
</script>

<template>
  <div class="h-screen flex flex-col">
    <RouterView/>
    <GlobalModal/>
  </div>
</template>

<style scoped></style>
