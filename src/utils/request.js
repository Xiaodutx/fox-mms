import axios from 'axios';
import { Loading, Message } from 'element-ui';

// 拦截器就是对每次请求进行一定的处理,比如对request请求带token验证,response响应之前加上loading遮罩,分别可以用请求拦截器和响应拦截器
const loading = {
	loadingInstance: null,
	open: function(){
		// 判断下是不是已经存在了一个在加载的loading,如果存在就不创建,不存在则创建,如果不这么做,那么你切换的时候之前的没结束就会一直loading
		if(this.loadingInstance===null){
			this.loadingInstance = Loading.service({
				target: '.main',
				background: 'rgba(0,0,0,0.7)',
				text: '加载中...',
				spinner: 'el-icon-loading',
			})
		}	
	},
	close: function(){
		// 首先这个东西要存在,然后才关闭
		if(this.loadingInstance!==null){
			this.loadingInstance.close();
		}
		// 结束之后应该将其值为空,等下一次将重新创建.
		this.loadingInstance = null;
	}
}

const request = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 5000
})
// 请求拦截器
request.interceptors.request.use(
	config => {
		loading.open();
		return config;
	},
	error => {
		loading.close();
		return Promise.reject(error);
	}
)
// 响应拦截器
request.interceptors.response.use(
	response => {
		loading.close();
		const　res = response.data;
		if(res.code!==2000){
			Message({
				message: res.message || '系统异常',
				type: 'warning',
				duration: 5 * 1000
			})
		}
		return response;
	},
	error => {
		loading.close();
		Message({
			message: error.message,
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error);
	}
)

export default request