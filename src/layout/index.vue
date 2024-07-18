<script setup>
/* 切换选中的标签 */
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useTokenStore } from "@/stores/token.js";

const route = useRoute();
const router = useRouter();
const active = ref(0);

/* 自定义标签颜色 */
/* 切换标签时调用的函数 */
const onChange = (index) => {
  active.value = index;  // 更新当前选中的标签索引
  // showToast(`标签 ${index}`);  // 显示提示信息
  // 根据标签索引跳转
  switch (index) {
    case 0:
      router.push('/');
      break;
    case 1:
      router.push('/my');
      break;
  }
};

// 判断token是否存在
const tokenStore = useTokenStore();
const userState = tokenStore.token;

// 根据当前路径设置 active 值
const setActiveTab = () => {
  switch (route.path) {
    case '/':
      active.value = 0;
      break;
    case '/my':
      active.value = 1;
      break;
    default:
      active.value = 0;
  }
};

// 在组件加载时设置 active 值
onMounted(() => {
  setActiveTab();
});

// 监听路由变化
watch(route, () => {
  setActiveTab();
});
</script>

<template>
  <div>
    <!--子路由出口-->
    <router-view></router-view>
    <!--构建标签导航栏-->
    <van-tabbar v-model="active" @change="onChange" active-color="#C396ED">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="contact-o" to="/my">{{ userState ? '我的' : '未登录' }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
