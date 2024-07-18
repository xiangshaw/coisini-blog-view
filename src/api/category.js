// 导入请求工具类
import request from '@/utils/request.js'

// 获取推荐分类
export const getCategoryRecommendService = () => {
    return request({
        url: '/api/v1/view/article/rcategory',
        method: 'get',
    })
}

// 添加或取消推荐分类
export const categoryRecommendService = (RecommendData) => {
    return request({
        url: '/api/v1/view/article/recommend',
        method: 'put',
        data: RecommendData
    })
}