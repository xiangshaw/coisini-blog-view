// 导入请求工具类
import request from '@/utils/request.js'

// 获取搜索联想词
export const getSearchSuggestionService = (keyword) => {
    return request({
        url: '/api/v1/view/search/associate/load',
        method: 'get',
        params: {
            keyword
        }
    })
}

// 获取搜索的历史记录
export const getSearchHistoryService = (historyData) => {
    return request({
        url: '/api/v1/view/search/history/load',
        method: 'get',
        params: {
            historyData
        }
    })
}

// 添加搜索历史记录
export const addSearchHistoryService = (historyData) => {
    return request({
        url: '/api/v1/view/search/history/add',
        method: 'post',
        data: historyData
    })
}

// 删除搜索历史记录
export const deleteSearchHistoryService = (historyData) => {
    return request({
        url: '/api/v1/view/search/history/delete',
        method: 'delete',
        data: historyData
    })
}

// 删除全部搜索历史记录
export const deleteAllSearchHistoryService = () => {
    return request({
        url: '/api/v1/view/search/history/batchRemove',
        method: 'delete'
    })
}

// 搜索结果展示
export const getSearchResultService = (searchResultData) => {
    return request({
        url: '/api/v1/view/search/result/load',
        method: 'post',
        data: searchResultData
    })
}