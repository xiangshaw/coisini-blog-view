<script setup>
import {ref, computed, onMounted} from 'vue';
import {categoryRecommendService, getCategoryRecommendService} from "@/api/category.js";
import {useTokenStore} from "@/stores/token.js";

// 接收 categorys 作为属性
const props = defineProps({
  categorys: {
    type: Array,
    required: true
  },
  active: {
    type: Number,
    required: true
  },
});

// 初始化分类列表为数组
const categoryRecommend = ref([]);

// 获取所有的分类列表
const fetchCategoryRecommend = async () => {
  const result = await getCategoryRecommendService();
  categoryRecommend.value = result.data.data;
}

onMounted(async () => {
  await fetchCategoryRecommend();
  // 从categorys获取category.status状态为'0'的分类ID存入fixCategory
  fixCategory.value = props.categorys
      .filter(category => category.status === 0)
      .map(category => category.id);
})

// 计算推荐分类列表
const recommendCategory = computed(() => {
  // 存储推荐分类数据
  const recommendCategorys = [];
  categoryRecommend.value.forEach((category) => {
    const result = props.categorys.find((propCategory) => {
      return category.id === propCategory.id;
    });
    if (!result) {
      recommendCategorys.push(category);
    }
  });
  return recommendCategorys;
});
import {useMyCategoryStore} from '@/stores/category.js'
// 添加分类
const onAddCategory = async (category) => {
  props.categorys.push(category);
  // 如果没有登录，将分类数据存储到本地
  console.log(!useTokenStore().token.length)
  if (!useTokenStore().token.length){
    useMyCategoryStore().setMyCategory(props.categorys)
  }
  // 添加或取消推荐分类
  RecommendData.value.id = category.id;
  if (category.recommend === '1') {
    RecommendData.value.recommend = '0';
  } else if (category.recommend === '0') {
    RecommendData.value.recommend = '1';
  } else {
    RecommendData.value.recommend = '0';
  }
  await categoryRecommendService(RecommendData.value)
};
// 初始化添加或取消的推荐数据
const RecommendData = ref({
  id: '',
  recommend: ''
})
// 展示编辑状态
const EditCategory = ref(false);
// 推荐 该分类不允许移除
let fixCategory = ref([])

const emit = defineEmits(['update-active']);
// 点击我的分类跳转
const onMyCategoryClick = async (category, index) => {
  // 检查状态fixCategory内的分类不可移除
  if (fixCategory.value.map(String).includes(String(category.id))) {
    return;
  }
  // 如果值为true，处于编辑状态
  if (EditCategory.value) {
    // 激活分类减1
    if (index <= props.active) {
      emit("update-active", props.active - 1, true);
    }
    // 移除我的分类
    props.categorys.splice(index, 1);
    // 判断是否登录
    if (!useTokenStore().token.length) {
      useMyCategoryStore().setMyCategory(props.categorys)
    }
    // 调用方法移除分类
    RecommendData.value.id = category.id;
    if (category.recommend === '0') {
      RecommendData.value.recommend = '1';
    } else if (category.recommend === '1') {
      RecommendData.value.recommend = '0';
    } else {
      RecommendData.value.recommend = '1';
    }
    await categoryRecommendService(RecommendData.value)

  } else {
    // 非编辑状态跳转分类
    emit("update-active", index, false)
  }
}
</script>

<template>
  <div class="category-edit">
    <van-cell>
      <template #title>
        <span class="title-text">我的分类</span>
      </template>
      <template #value>
        <van-button
            type="danger"
            round
            size="mini"
            plain
            class="edit-btn"
            @click="EditCategory = !EditCategory">
          {{ EditCategory ? "完成" : "编辑" }}
        </van-button>
      </template>
    </van-cell>
    <van-grid :column-num="3" class="my-grid">
      <van-grid-item v-for="(category, index) in categorys"
                     :key="category.id"
                     icon="clear"
                     class="grid-item"
                     @click="onMyCategoryClick(category,index)"
      >
        <template #default>
          <van-icon
              name="clear"
              v-show="EditCategory && !fixCategory.map(String).includes(String(category.id))"></van-icon>
          <span class="text" :class="{ active: index === active }">{{ category.category_name }}</span>
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell>
      <template #title>
        <span class="title-text">分类推荐</span>
      </template>
    </van-cell>
    <van-grid :column-num="3" direction="horizontal" icon-size="20">
      <van-grid-item v-for="category in recommendCategory"
                     :key="category.id"
                     icon="plus"
                     :text="category.category_name"
                     class="grid-item"
                     @click="onAddCategory(category)"
      />
    </van-grid>
  </div>
</template>

<style scoped>
.category-edit {
  padding: 85px 0;
}

.category-edit .title-text {
  font-size: 30px;
  color: #333;
}

.category-edit .edit-btn {
  width: 90px;
  height: 40px;
  font-size: 20px;
}

.category-edit .grid-item {
  width: 100px;
  height: 100px;
  background-color: #F5E8FF;
}

.category-edit :deep(.van-grid-item__text) {
  font-size: 26px;
  color: #2e2e30;
  margin-top: 0;
}

.category-edit .my-grid :deep(.van-icon-clear) {
  /*绝对定位*/
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 30px;
  color: #cacaca;
  z-index: 2;
}

.category-edit .text {
  font-size: 26px;
  color: #2e2e30;
  margin-top: 0;
}

.category-edit .grid-item :deep(.active) {
  color: #CB2B88;
}
</style>