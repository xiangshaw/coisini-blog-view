<!--文章列表项组件-->
<script setup>
// 接收 article 作为属性
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});
import dayjs from '@/utils/day.js'
</script>

<template>
  <van-cell
      class="article-item"
      :to="{
        name: 'article',
        params: {
          articleId: article.id
        }
      }">
    <template #title>
      <span class="title van-multi-ellipsis--l2">
        {{ article.title }}
      </span
      >
    </template>
    <template #label>
      <span>{{ article.createUser }}</span>&nbsp;&nbsp;
      <span>{{ article.commCount }}</span>&nbsp;&nbsp;
      <span>{{ dayjs().to(dayjs(article.createTime)) }}</span>
    </template>
    <template #right-icon>
      <van-image
          width="100"
          height="100"
          :src="article.coverImg"
      ></van-image>
    </template>
  </van-cell>
</template>

<style scoped>
.article-item .title {
  font-size: 26px;
  color: #3a3a3a;
}

.article-item .van-cell__value {
  flex: unset;
  width: 232px;
  height: 146px;
  padding-left: 25px;
}

.article-item .right-cover {
  width: 132px;
  height: 146px;
}

.article-item .label-info-wrap span {
  font-size: 20px;
  color: #b4b4b4;
  margin-right: 25px;
}

.article-item .cover-wrap {
  display: flex;
}

.article-item .cover-wrap .cover-item {
  /* 平分宽度 */
  flex: 1;
  padding-right: 4px;
}
</style>