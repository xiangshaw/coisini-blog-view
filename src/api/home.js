// 导入请求工具类
import request from '@/utils/request.js'

// 获取所有分类
export const categoryViewListService = () => {
    return request({
        url: '/api/v1/view/article/category',
        method: 'get',
    })
}

// 文章列表查询
export const articleViewListService = (categoryKeyWord) => {
    return request({
        url: '/api/v1/view/article/list',
        method: 'post',
        data: categoryKeyWord
    })
}

// 文章详情查询
export const articleViewDetailService = (id) => {
    return request({
        url: '/api/v1/view/article/detail',
        method: 'get',
        params: {
            id
        }
    })
}
