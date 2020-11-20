import request from '@/utils/request'

export default {
    getSupplierList() {
        return request({
            url: '/supplier/list',
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addSupplier(data) {
        return request({
            url: '/supplier',
            method: 'post',
            data
        })
    },
    getSupplierById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'get',
        })
    },
    updateSupplier(data) {
        return request({
            url: `/supplier/${data.id}`,
            method: 'post',
            data
        })
    },
    deleteSupplier(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete',
        })
    }
}