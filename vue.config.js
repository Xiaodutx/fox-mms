module.exports = {
    devServer: {
        port: 8888,
        host: 'localhost',
        https: false,
        open: true,
        proxy: {
            [process.env.VUE_APP_BASE_API]:{
                target: process.env.VUE_APP_SERVICE_URL,
                changeOrigin: true,
                pathRewrite: {
                    ['^'+process.env.VUE_APP_BASE_API]: '',  //规定就是加上'^'
                }
            }
        }
    },
    lintOnSave: false,
    productionSourceMap: false
}