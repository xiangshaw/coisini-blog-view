<script setup>
import {ref, onMounted} from 'vue';
import {showLoadingToast, showToast} from 'vant';
import {getCodeService, userLoginService} from "@/api/user.js";
import {useTokenStore} from "@/stores/token";
import {useUserInfoStore} from "@/stores/userInfo";
import {useMyCategoryStore} from '@/stores/category.js'
import router from "@/router/index.js";

const registerData = ref({
  username: '',
  password: '',
  rePassword: '',
  captcha: '',
  uuid: ''
});
const captchaSrc = ref('');

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const myCategoryStore = useMyCategoryStore();

onMounted(() => {
  tokenStore.removeToken();
  userInfoStore.removeInfo();
  userInfoStore.removeUserButton();
  userInfoStore.removeUserMenu();
  myCategoryStore.removeMyCategory();
  getCode();
});

const getCode = async () => {
  try {
    const result = await getCodeService();
    if (result.data.code === 200) {
      console.log("请求" + result.captcha)
      captchaSrc.value = `data:image/png;base64,${result.data.data.captcha}`;
      registerData.value.uuid = result.data.data.uuid;
    } else {
      showToast({type: 'fail', message: result.data.message});
    }
  } catch (error) {
    showToast({type: 'fail', message: '获取验证码失败'});
  }
};

const login = async () => {
  try {
    showLoadingToast({
      message: '登录中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    const result = await userLoginService(registerData.value);
    if (result.data.code === 200) {
      showToast({type: 'success', message: '登录成功'});
      tokenStore.setToken(result.data.data.token);
      userInfoStore.setInfo(result.data.data.user);
      await router.push('/my');
    } else {
      showToast({type: 'fail', message: result.data.message});
    }
  } catch (error) {
    showToast({type: 'fail', message: '登录失败'});
  }
};

const onClickLeft = () => {
  router.back();
};

const rules = {
  username: [
    {required: true, message: '请填写用户名'},
    {min: 3, message: '用户名长度不能小于3'},
    {max: 20, message: '用户名长度不能大于20'},
  ],
  password: [
    {required: true, message: '请填写密码'},
    {min: 6, message: '密码长度不能小于6'},
    {max: 20, message: '密码长度不能大于20'},
  ],
  captcha: [
    {required: true, message: '请填写验证码'},
    {min: 4, message: '验证码长度不能小于4'},
    {max: 4, message: '验证码长度不能大于4'},
  ],
};
</script>

<template>
  <van-nav-bar
      title="登录"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      class="page-nav-bar"
  />
  <van-form @submit="login">
    <van-cell-group inset>
      <van-field
          v-model="registerData.username"
          name="用户名"
          label="用户名"
          placeholder="请填写用户名"
          left-icon="manager"
          :rules="rules.username"
      />
      <van-field
          v-model="registerData.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="请填写密码"
          left-icon="lock"
          :rules="rules.password"
      />
      <van-row>
        <van-col span="16">
          <van-field
              v-model="registerData.captcha"
              name="验证码"
              label="验证码"
              placeholder="请填写验证码"
              left-icon="comment"
              :rules="rules.captcha"
          />
        </van-col>
        <van-col span="8">
          <img :src="captchaSrc" alt="captcha" @click="getCode" class="captcha-img"/>
        </van-col>
      </van-row>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<style scoped>
.captcha-img {
  width: 100%;
  height: auto;
  cursor: pointer;
}
</style>
