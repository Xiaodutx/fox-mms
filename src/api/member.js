import request from '@/utils/request'

export default {
    getMemberList() {
        return request({
            url: '/member/list',
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    addMember(data) {
        return request({
            url: '/member',
            method: 'post',
            data
        })
    },
    getMemberById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get',
        })
    },
    updateMember(data) {
        return request({
            url: `/member/${data.id}`,
            method: 'put',
            data
        })
    },
    deleteMember(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete',
        })
    }
}