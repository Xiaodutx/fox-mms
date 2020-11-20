import request from '@/utils/request'

export default {
    getGoodsrList() {
        return request({
            url: '/goods/list',
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addGoods(data) {
        return request({
            url: '/goods',
            method: 'post',
            data
        })
    },
    getGoodsById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'get',
        })
    },
    updateGoods(data) {
        return request({
            url: `/goods/${data.id}`,
            method: 'post',
            data
        })
    },
    deleteGoods(id) {
        return request({
            url: `/goods/${id}`,
            method: 'delete',
        })
    }
}