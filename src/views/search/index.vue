<script setup>
import {showToast} from "vant";
import SearchHistory from "@/views/search/components/search-history.vue";
import SearchResult from "@/views/search/components/search-result.vue";
import SearchSuggestion from "@/views/search/components/search-suggestion.vue";
import {useMySearch} from '@/stores/search.js'
import router from "@/router/index.js";

const mySearchHistories = useMySearch()

const searchText = ref('')
// 搜索点击的值
const onSearch = (val) => {
  // 将点击的val值赋值给searchText搜索框
  searchText.value = val;
  // 判断搜索历史是否存在
  const index = searchHistories.value.indexOf(val);
  if (index !== -1) {
    // 存在，则从数组移除
    searchHistories.value.splice(index, 1);
  }
  // 不存在，则添加到数组最前面
  searchHistories.value.unshift(val);
  // 搜索结果展示之前渲染完历史记录
  searchResultShow.value = true;
}

const onCancel = () => {
  // 点击取消按钮返回上一页
  router.back();
};

// 搜索结果展示
const searchResultShow = ref(false);

// 搜索历史
const searchHistories = ref(mySearchHistories.mySearch || []);

// 监听搜索历史数组的变化，当数组发生变化时，执行回调函数
watch(searchHistories.value, function (newValue, oldValue) {
  mySearchHistories.setMySearch(newValue)
})

</script>

<template>
  <div class="search-container">
    <form action="/" class="search-form">
      <van-search
          v-model="searchText"
          show-action
          placeholder="请输入搜索关键词"
          input-align="center"
          shape="round"
          background="#90E9E1"
          @search="onSearch"
          @cancel="onCancel"
          @focus="searchResultShow=false"
          maxlength="50"
          action-text="返回"
      />
    </form>
    <!--搜索结果-->
    <search-result v-if="searchResultShow"
                   :search-text="searchText"
    ></search-result>
    <!--搜索联想-->
    <search-suggestion
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
    ></search-suggestion>
    <!--搜索历史-->
    <search-history
        v-else
        :search-histories="searchHistories"
        @search="onSearch"
    ></search-history>
    <van-back-top right="10vw" bottom="5vh"/>

  </div>
</template>

<style scoped>
.search-container {
  padding-top: 100px;
}

.search-container :deep(.van-search__action) {
  color: #4D1B00;
}

.search-container .search-form {
  /*固定搜索框*/
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>