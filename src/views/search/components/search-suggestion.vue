<script setup>
// 接收父组件传递的参数
const props = defineProps({
  searchText: {
    type: String,
    // 表示必须传递
    required: true
  }
})
// 时刻监听搜索文本的变化
watch(
    () => props.searchText,
    debounce(function (newValue, oldValue) {
      fetchSearchSuggestion(newValue);
    }, 500),
    {
      // 一直监听
      immediate: true
    }
)
import {getSearchSuggestionService} from '@/api/search.js'
// 调用接口查询联想数据
const searchSuggestionData = ref([])
onMounted(() => {
  fetchSearchSuggestion(props.searchText)
})
// 获取联想数据并更新 searchSuggestionData
const fetchSearchSuggestion = async (query) => {
  const result = await getSearchSuggestionService(query)
  searchSuggestionData.value = result.data.data;
}
// 优化防抖处理
import {debounce} from 'lodash'
// 搜索关键字高亮显示
const highlight = (text) => {
  // 高亮文本
  const highStr = `<span style="color: #F54E4E">${props.searchText}</span>`
  // 匹配的正则（i大小写不限制、g匹配全部）
  const reg = new RegExp(props.searchText, 'ig')
  // 返回数据
  return text.replace(reg, highStr)
}
// 传递搜索内容，从父组件传递
const emit = defineEmits(['search'])
const onSearch = (text) => {
  emit('search', text)
}
</script>

<template>
  <div class="search-suggestion">
    <van-cell-group>
      <van-cell v-for="(text, index) in searchSuggestionData"
                icon="search" :key="index"
                @click="onSearch(text.associateWord)">
        <template #title>
          <div v-html="highlight(text.associateWord)"></div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped>

</style>