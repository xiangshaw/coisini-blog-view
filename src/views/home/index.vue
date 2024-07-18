<template>
  <div class="home-container">
    <!--fixed固定头部-->
    <van-nav-bar class="page-nav-bar" fixed>
      <template #left>
        <div class="left-content">
          <img src="../../assets/coisini-128-128.ico"
               alt="Logo"
               class="logo"/>
          <span class="app-name">coisini博客</span>
        </div>
      </template>
      <template #right>
        <van-button
            type="info"
            size="small"
            round
            icon="search"
            class="search-button"
            to="/search"
        >搜索
        </van-button>
      </template>
    </van-nav-bar>
    <!--导航栏-->
    <van-tabs
        v-if="tabsVisible"
        class="channels-tabs"
        v-model:active="active"
        color="#C396ED"
        title-active-color="#F979B7"
        line-width="20px"
        line-height="6px"
        swipeable
    >
      <van-tab
          v-for="category in categorys"
          :key="category.id"
          :title="category.category_name"
      >
        <!--文章列表-->
        <article-list :category="category"></article-list>
      </van-tab>
      <template #nav-right>
        <!--占位符-->
        <i class="placeholder"></i>
        <van-icon name="wap-nav" class="wap-nav-icon"
                  @click="categoryEditShow = true"/>
      </template>
    </van-tabs>
    <!--弹出层-->
    <van-popup
        v-model:show="categoryEditShow"
        closeable
        position="right"
        close-icon-position="top-right"
        :style="{ width: '100%', height: '100%' }"
    >
      <category-edit
          :categorys="categorys"
          :active="active"
          @update-active="onUpdateActive"
      ></category-edit>
    </van-popup>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {categoryViewListService} from "@/api/home.js";
import ArticleList from "@/views/home/components/article-list.vue";
import CategoryEdit from "@/views/home/components/category-edit.vue";

const categorys = ref({
  id: '',
  category_name: '',
  status: '1'
})

onMounted(async () => {
  await fetchCategorys()
});
const tabsVisible = ref(false);
// 获取标签列表
const fetchCategorys = async () => {
  const result = await categoryViewListService();
  categorys.value = result.data.data;
  // 延迟设置激活标签状态和显示tabs
  setTimeout(() => {
    active.value = 0;
    tabsVisible.value = true;
  }, 0.01);
}

// 标签栏
const active = ref(0);
// 弹出层
const categoryEditShow = ref(false);

const onUpdateActive = (index, categoryEditShows = true) => {
  // 在我的分类点击后激活当前标签
  active.value = index;
  // 并且关闭弹出层
  categoryEditShow.value = categoryEditShows;
}
</script>

<style scoped>
.left-content {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
}

.app-name {
  font-size: 24px;
  margin-left: 10px;
}

/*导航栏*/
.home-container .search-button {
  width: 300px;
  height: 60px;
  background-color: #dfdfdf;
  /*去除边框*/
  border: none;
  font-size: 24px;
  color: #929293;
}

/*标签栏*/
.channels-tabs ::v-deep(.van-tab) {
  min-width: 120px;
  border-right: 1px solid #f2f3f5;
  font-size: 30px;
  color: #4e5969;
}

.channels-tabs ::v-deep(.van-tabs__line) {
  background-color: #3296fa;
  width: 20px;
  height: 6px;
}

.channels-tabs .wap-nav-icon {
  /*右边图标 固定定位*/
  position: fixed;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: #fff;
  /*透明度*/
  opacity: 0.9;
  /*图标大小*/
  font-size: 60px;
}

/*右边图标占位符，避免覆盖分类*/
.channels-tabs .placeholder {
  flex-shrink: 0;
  width: 60px;
  height: 32px;
}

.home-container {
  /*底栏占位符*/
  padding-bottom: 100px;
}

/*固定导航栏*/
::v-deep(.van-tabs__wrap) {
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  z-index: 1;
  background: transparent;

}
</style>
