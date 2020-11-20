import router from '@/router/index';
import store from '@/store'

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('fox-token');
    if(!token){
        localStorage.removeItem('fox-user')
        if(to.path!=='/login'){
            next('/login')
        }else{
            next()
        }
    }else{
        if(to.path === '/login') {
            next()
        }else {          
            const userInfo = localStorage.getItem('fox-user') 
            if(userInfo) {
                next()
            }else {
                store.dispatch('getUserInfo').then(response => {
                    if(response.flag) {
                        next()
                    }else {
                        next({path: '/login'})
                    }
                }).catch(error => {

                })
            }
            
        }
    }
})



