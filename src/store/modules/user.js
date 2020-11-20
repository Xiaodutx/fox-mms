import {login,getUserInfo,logOut} from '@/api/login';
import {getToken,setToken,getUser,setUser,removeToken} from '@/utils/auth';

const user = {
    state:{
        token: getToken(),
        user: getUser()
    },

    mutations: {
        SET_TOKEN(state,token){
            state.token = token;
            setToken(token)
        },
        SET_USER(state,user){
            state.user = user;
            setUser(user)
        }
    },
    actions: {
        Login({commit},form){
            return new Promise((resolve,reject)=>{
                login(form.username.trim(),form.password).then(response=>{
                    const resp = response.data;                  
                    commit('SET_TOKEN',resp.data.token);
                    resolve(resp);
                }).catch(error=>{
                    reject(error)
                })
            })
        },
        getUserInfo({commit,state}){
            // actions里面的函数接收一个与store实例具有相同属性和方法的context,用es6使用里面的局部属性,可以用{}包起来,所以此处state也需写在里面
            return　new Promise((resolve,reject)=>{
                getUserInfo(state.token).then(response=>{
                    const resp = response.data;
                    commit('SET_USER',resp.data);
                    resolve(resp);
                }).catch(error=>{
                    reject(error);
                })
            })
        },
        LogOut({commit,state}){
            return new Promise((resolve,reject)=>{
                logOut(state.token).then(response=>{
                    const resp = response.data;
                    commit('SET_TOKEN','');
                    commit('SET_USER',null);
                    removeToken();
                    resolve(resp);
                }).catch(error=>{
                    reject(error)
                })
            })
        }
    },
}

export default user;