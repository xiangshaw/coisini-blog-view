<template>
  <div class="my-container">
    <!-- 未登录布局 -->
    <div v-if="!userState" class="header not-login">
      <div class="login-btn" @click="navigateToLogin">
        <van-image
            class="login-img"
            round
            fit="cover"
            src="https://img.ixintu.com/download/jpg/20200831/7708e1ce826fe9588fc8e5676d593cbf_512_512.jpg!con"
            alt=""
        >
          <template v-slot:loading>
            <van-loading type="spinner" size="20"/>
          </template>
        </van-image>
        <span class="login-text">注册 / 登录</span>
      </div>
    </div>

    <!-- 已登录布局 -->
    <div v-else class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
              class="user-avatar"
              round
              fit="cover"
              :src="userInfo?.avatar || 'https://img.ixintu.com/download/jpg/20200831/7708e1ce826fe9588fc8e5676d593cbf_512_512.jpg!con'"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20"/>
            </template>
          </van-image>
          <span class="user-name">{{ userInfo?.username }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="user-info-items">
        <div class="user-info-item">
          <span class="user-info-item-name">文章</span>
          <span class="user-info-item-value">{{ userInfo?.articleCount || 0 }}</span>
        </div>
        <div class="user-info-item">
          <span class="user-info-item-name">关注</span>
          <span class="user-info-item-value">{{ userInfo?.followCount || 0 }}</span>
        </div>
        <div class="user-info-item">
          <span class="user-info-item-name">粉丝</span>
          <span class="user-info-item-value">{{ userInfo?.fansCount || 0 }}</span>
        </div>
        <div class="user-info-item">
          <span class="user-info-item-name">获赞</span>
          <span class="user-info-item-value">{{ userInfo?.likeCount || 0 }}</span>
        </div>
      </div>
    </div>

    <!--导航 2列 平分一行-->
    <van-grid :column-num="2" clickable>
      <van-grid-item icon="star-o" text="收藏"/>
      <van-grid-item icon="clock-o" text="历史"/>
    </van-grid>

    <!--消息通知与退出登录布局-->
    <van-cell-group>
      <van-cell title="消息" is-link/>
      <van-cell title="小湘同学" is-link/>
      <van-cell title="退出登录" class="logout-cell" v-if="userState" @click="onLogout"/>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTokenStore } from "@/stores/token.js";
import { showConfirmDialog } from "vant";
import { useUserInfoStore } from "@/stores/userInfo.js";
import {userLogoutService} from "@/api/user.js";

const router = useRouter();

const navigateToLogin = () => {
  router.push('/login');
};

// 判断token是否存在
const tokenStore = useTokenStore();
const userState = tokenStore.token;

// 退出登录
const onLogout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
  })
      .then(async () => {
        tokenStore.removeToken();
        userInfoStore.removeInfo();
        userInfoStore.removeUserButton();
        userInfoStore.removeUserMenu();
        await userLogoutService()
        await router.push('/');
      })
      .catch(() => {
      });
};

// 获取用户信息
const userInfoStore = useUserInfoStore();
const userInfo = computed(() => userInfoStore.info);

onMounted(() => {
  //console.log("获取地址：", import.meta.env.VITE_APP_URL);
});
</script>



<style scoped>
.my-container .header {
  height: 261px;
  background: url("@/assets/so-white.png");
  background-size: cover;
}

.my-container .not-login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-container .not-login .login-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-img {
  width: 132px;
  height: 132px;
  margin-bottom: 15px;
}

.login-text {
  font-size: 30px;
  color: #4e5969;
}

.user-info .base-info {
  height: 131px;
  padding: 70px 32px 23px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info .left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info .left .user-avatar {
  width: 132px;
  height: 132px;
  margin-right: 13px;
  border: 1px solid #fff;
}

.user-info .left .user-name {
  font-size: 26px;
  color: #4e5969;
}

.user-info .user-info-items {
  display: flex;
}

.user-info .user-info-items .user-info-item {
  height: 130px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #4e5969;
}

.user-info .user-info-items .user-info-item-name {
  font-size: 26px;
}

.user-info .user-info-items .user-info-item-value {
  font-size: 26px;
}

.van-grid-item__icon {
  color: #DDBEF6;
}

.logout-cell {
  text-align: center;
  color: #F76560;
  height: 120px;
  margin-top: 9px;
}


</style>
