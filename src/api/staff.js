import request from '@/utils/request'

export default {
    getStaffList() {
        return request({
            url: '/staff/list',
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addStaff(data) {
        return request({
            url: '/staff',
            method: 'post',
            data
        })
    },
    getStaffById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'get',
        })
    },
    updateStaff(data) {
        return request({
            url: `/staff/${data.id}`,
            method: 'post',
            data
        })
    },
    deleteStaff(id) {
        return request({
            url: `/staff/${id}`,
            method: 'delete',
        })
    }
}