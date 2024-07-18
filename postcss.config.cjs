// Rem 布局适配
module.exports = {
    plugins: {
        // postcss-pxtorem 插件的版本需要 >= 5.0.0
        'postcss-pxtorem': {
            // 配置不同文件转换不同根字体值
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75;
            },
            // 需转换的css属性 *所有
            propList: ['*'],
        },
    },
};
