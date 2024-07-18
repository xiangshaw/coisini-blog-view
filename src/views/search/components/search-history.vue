<script setup>
// 接收父组件传递的参数
import {deleteAllSearchHistoryService, deleteSearchHistoryService} from "@/api/search.js";

const props = defineProps({
  searchHistories: {
    // 对应类型
    type: Array,
    // 表示必须传递
    required: true
  }
})
const historyData = ref({
  keyword: ''
})
// 删除展现
const deleteShow = ref(false)
// 传递搜索内容，从父组件传递
const emit = defineEmits(['search'])
const onSearchItemClick = (item, index) => {
  if (deleteShow.value) {
    // 删除
    props.searchHistories.splice(index, 1)
    // 调用接口删除
    historyData.value = {keyword: item}
    deleteSearchHistoryService(historyData.value)
  } else {
    // 非删除状态 直接搜索
    emit("search", item)
  }
}
// 处理全部删除
const deleteAllHistory = () => {
  props.searchHistories.splice(0, props.searchHistories.length)
  // 调用接口删除
  deleteAllSearchHistoryService(props.searchHistories)
}
import {BackTop} from 'vant';
</script>

<template>
  <div class="search-history">
    <van-cell>
      <template #title>
        <span>搜索历史</span>
      </template>
      <template #value>
        <div v-if="deleteShow" class="delete-actions">
          <span @click="deleteAllHistory">全部删除</span>
          <span>&nbsp;&nbsp;</span>
          <span @click="deleteShow = !deleteShow">完成</span>
        </div>
        <van-icon name="delete" v-else @click="deleteShow = !deleteShow"/>
      </template>
    </van-cell>
    <van-cell
        v-for="(item, index) in props.searchHistories"
        :key="item"
        @click="onSearchItemClick(item, index)"
        class="history-item">
      <template #title>
        <span class="search-history-text">{{ item }}</span>
      </template>
      <template #right-icon>
        <van-icon name="close" v-if="deleteShow"/>
      </template>
    </van-cell>
  </div>
</template>

<style scoped>
</style>