<script setup>
import {onMounted, ref} from 'vue';
import {articleViewListService} from "@/api/home.js";
import {showToast} from "vant";
import ArticleItem from "@/components/article-item/index.vue";


// 接收 category 作为属性
const props = defineProps({
  category: {
    type: Object,
    required: true
  }
});

const articleList = ref([]);
const loading = ref(false);
const finished = ref(false);
// 控制列表加载失败的提示状态
const error = ref(false);
// 控制下拉刷新的loading状态
const refreshing = ref(false);
let refreshSuccessText = "刷新成功"

const categoryKeyWord = ref({
  keyword: '',
  categoryId: '',
  current: 1,
  limit: 10,
});

// 监听 category.id 的变化并更新 categoryKeyWord
watch(() => props.category.id, (newId) => {
  categoryKeyWord.value.categoryId = String(newId);
  // 重置分页
  categoryKeyWord.value.current = 1;
  // 清空当前文章列表
  articleList.value = [];
  // 重置 finished 状态
  finished.value = false;
  // 重新加载文章列表
  onLoad();
});

// 加载更多
const onLoad = async () => {
  loading.value = true;
  try {
    // 发送异步请求获取数据
    const result = await articleViewListService(categoryKeyWord.value);
    if (result.data.data.length > 0) {
      // 将获取到的数据添加到 articleList 数组中
      articleList.value.push(...result.data.data);
      // 更新当前页码
      categoryKeyWord.value.current++;
      // 检查是否还有更多数据
      if (result.data.data.length < categoryKeyWord.value.limit) {
        finished.value = true;
      }
    } else {
      // 没有更多数据了
      finished.value = true;
    }
  } catch (error) {
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

onMounted(() => {
  if (props.category.id !== undefined) {
    // 初始化时进行转换
    categoryKeyWord.value.categoryId = String(props.category.id);
    categoryKeyWord.value.keyword = String(props.category.category_name);
    onLoad();
  }
});

// 下拉刷新
const onRefresh = async () => {
  try {
    // 追加数据
    const result = await articleViewListService(categoryKeyWord.value)
    // 数据追加到列表顶部
    articleList.value.unshift(...result.data.data);
    // 完成下拉刷新
    refreshing.value = false;
    refreshSuccessText = `刷新成功，更新了${result.data.data.length}条数据`
  } catch (e) {
    // 刷新失败 关闭下拉刷新
    refreshing.value = false;
    refreshSuccessText = `刷新失败`
  }
};
</script>

<template>
  <div class="article-list">
    <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        :success-text="refreshSuccessText"
        success-duration="1500"
    >
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          v-model:error="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
      >
        <!--文章列表组件-->
        <article-item v-for="article in articleList"
                      :key="article.id"
                      :article="article"
                      class="cell-list">
        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style scoped>
.cell-list {
  min-height: 100px;
}

.article-list {
  /*距离顶部的距离*/
  margin-top: 190px;
  /*占据高度*/
  height: calc(100vh - 190px);
  flex: 1;
  /*独立的滚动区域*/
  overflow-y: auto;
}
</style>
