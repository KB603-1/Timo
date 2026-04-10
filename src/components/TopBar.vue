<script setup>

import GroupDrawer from "@/components/GroupDrawer.vue";
</script>

<template>
  <header class="flex flex-col z-50 w-full bg-[#f2f0fb]">
    <div class="flex h-14 items-center px-4">

      <!-- 좌측 슬롯 (직접 채워넣으세요) -->
      <div class="flex flex-1 items-center gap-4">
        <GroupDrawer/>
      </div>

      <!-- 우측 아바타 -->
      <div class="flex items-center">
      </div>

    </div>
  </header>
</template>

<style scoped>

</style>