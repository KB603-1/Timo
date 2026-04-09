<script setup>
import {useRecordStore} from "@/stores/record.js";
import GlobalModal from "@/components/GlobalModal.vue";
const recordStore = useRecordStore();
recordStore.fetchCategories();
</script>

<template>
  <RouterView/>
  <GlobalModal/>
</template>

<style scoped></style>
