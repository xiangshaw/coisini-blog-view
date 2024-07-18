<script setup>
// 接收从父组件传递的搜索参数
import {showToast} from "vant";

const props = defineProps({
  searchText: {
    type: String,
    // 表示必须传递
    required: true
  }
})
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
// 控制列表加载失败的提示状态
const error = ref(false);
import {getSearchResultService} from '@/api/search.js'

// 搜索结果条件
const searchResult = ref({
  keyword: props.searchText,
  current: 1,
  limit: 10
})
const onLoad = async () => {
  loading.value = true;
  try {
    const result = await getSearchResultService(searchResult.value)
    const searchResultData = result.data.data;
    // 添加搜索结果
    list.value.push(...searchResultData);
    // 关闭加载
    loading.value = false;
    // 判断是否有更多数据
    if (searchResultData.length > 0) {
      // 将获取到的数据添加到list数组中
      list.value.push(...searchResultData);
      // 更新当前页码
      searchResult.value.current++;
      // 判断是否还有更多数据
      if (searchResultData.length < searchResult.value.limit) {
        finished.value = true;
      }
    } else {
      // 没有更多数据
      finished.value = true;
    }
  }catch (error){
    showToast({type: 'fail', message: '数据加载失败'});
    // 避免在出现错误时不断重试
    finished.value = true;
    error.value = true;
    loading.value = false;
  } finally {
    // 数据加载结束
    loading.value = false;
  }

};

</script>

<template>
  <div class="search-result">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        v-model:error="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.id" :title="item.title" class="cell-list"/>
    </van-list>

  </div>
</template>

<style scoped>
.cell-list {
  min-height: 200px;
}
</style>