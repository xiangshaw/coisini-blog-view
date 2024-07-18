<script setup>
import router from "@/router/index.js";
// 接收文章id
const props = defineProps({
  articleId: {
    type: String,
    required: true
  }
})
// 点击返回按钮
const onClickLeft = () => {
  // 返回上一个页面
  router.back();
};

import {articleViewDetailService} from '@/api/home.js'
// 图片预览
import {showImagePreview} from 'vant';

const article = ref({
  id: '',
  title: '',
  content: '',
  coverImg: '',
  categoryId: '',
  categoryName: '',
  tagName: '',
  tagColor: '',
  createUser: '',
  tagId: '',
  createTime: '',
  updateTime: '',

})

onMounted(() => {
  loadArticle()
  //console.log("获取地址：", import.meta.env.VITE_APP_URL);
})

import dayjs from '@/utils/day.js'
// 设置文章加载状态
const loading = ref(true)
// 文章加载错误状态
const errorLoading = ref(0)

// 实现图片预览效果
function previewImage(articleContent) {
  const imgs = articleContent.value.querySelectorAll("img")
  const images = []
  imgs.forEach((img, index) => {
    // 设置详情图片样式
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    // 设置预览图片
    images.push(img.src)
    img.onclick = () => {
      showImagePreview({
        images,
        startPosition: index,
        closeable: true,
      });
    }
  })
}

const loadArticle = async (id) => {
  loading.value = true
  try {
    const result = await articleViewDetailService(props.articleId ? props.articleId : id)
    article.value = result.data.data
    // 数据获取完
    setTimeout(() => {
      previewImage(articleContent)
    }, 0)
  } catch (e) {
    if (e.response && e.response.status === 404) {
      errorLoading.value = 404
    }
  }
  loading.value = false
}
// 获取内容中图片
const articleContent = ref(null)
</script>
<template>
  <div class="article-container">
    <!--导航栏-->
    <van-nav-bar
        class="page-nav-bar"
        fixed
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        title="-"
    >
      <template #right>
        <router-link to="/search">
          <van-icon name="search" class="search-button" color="#1989fa" size="26px"/>
        </router-link>
      </template>
    </van-nav-bar>

    <!--加载中-->
    <div class="main-wrap">
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#1989fa" vertical>loading...</van-loading>
      </div>

      <!--文章详情-->
      <div class="article-detail" v-else-if="article.title">
        <!--文章标题-->
        <h1 class="article-title">{{ article.title }}</h1>
        <!--用户信息-->
        <van-cell class="user-info">
          <div class="user-info-container">
            <van-image
                class="avatar"
                round
                fit="cover"
                :src="article.coverImg"
                width="45"
                height="45"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20"/>
              </template>
              <template v-slot:error>加载失败</template>
            </van-image>
            <div class="user-info-text">
              <div class="user-name">{{ article.createUser }}</div>
              <div class="publish-date">{{ dayjs().to(dayjs(article.createTime)) }}</div>
            </div>
            <van-button
                color="linear-gradient(to right, #ff6034, #ee0a24)"
                class="follow-btn"
                size="small"
                round
                icon="plus"
            >
              <van-swipe
                  vertical
                  class="notice-swipe"
                  :autoplay="2000"
                  :touchable="false"
                  :show-indicators="false"
              >
                <van-swipe-item>关注作者</van-swipe-item>
                <van-swipe-item>不迷路</van-swipe-item>
              </van-swipe>
            </van-button>
          </div>
        </van-cell>
        <!--文章内容-->
        <div class="article-content"
             v-html="article.content"
             ref="articleContent">
        </div>
        <van-divider
            :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">END
        </van-divider>
      </div>

      <!--加载失败 404-->
      <div class="error-wrap" v-else-if="errorLoading === 404">
        <van-icon size="50px" name="failure"/>
        <p class="text">该资源不存在或已被删除</p>
      </div>

      <!--其它错误：网络/服务端异常-->
      <div class="error-wrap" v-else>
        <van-icon size="50px" name="failure"/>
        <p class="text">网络异常，请稍后重试</p>
        <van-button class="retry-btn" @click="loadArticle(props.articleId)">点击重试</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*页面整体样式*/
.main-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 95px;
  bottom: 40px;
  overflow-y: scroll;
  background-color: #fff;
}

/*正在加载样式*/
.loading-wrap {
  padding: 200px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

/*文章标题*/
.article-title {
  font-size: 30px;
  padding: 10px 10px;
  margin: 0;
  color: #4e5969;
}

/*用户信息整体样式*/
.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/*用户信息*/
.user-info-container {
  display: flex;
  align-items: center;
  width: 100%;
}

/*头像*/
.avatar {
  margin-right: 10px;
}

/*用户名、时间、按钮布局*/
.user-info-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: auto;
}

/*用户名称*/
.user-name {
  font-size: 26px;
  text-align: left;
  font-weight: bold;
}

/*发布时间*/
.publish-date {
  font-size: 26px;
  color: #888;
}

/*关注按钮*/
.follow-btn {
  padding: 18px;
  font-size: 18px;
}

/*关注按钮动态样式*/
.notice-swipe {
  height: 20px;
  line-height: 20px;
}

/*详情文本样式*/
.article-container {
  font-size: 16px;
}

/*详情图片样式*/
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .article-content :deep(img) {
    max-width: 100%;
    height: auto;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .article-content :deep(img) {
    max-width: 80%;
    height: auto;
  }
}

/*错误页面样式*/
.error-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  text-align: center;
  font-size: 30px;
  height: 100vh;
}

/*重试按钮样式*/
.retry-btn {
  margin-top: 16px;
  border: none;
}
</style>