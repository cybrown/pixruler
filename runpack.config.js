module.exports.configureWebpack = (webpackConfiguration, webpack, mergeWebpackConfig) => {
    webpackConfiguration.module.rules = webpackConfiguration.module.rules.filter(r => r.test.source !== '\\.(jpe?g|png|gif)$');
    webpackConfiguration.module.rules.push({
        test: /\.png$/i,
        loader: 'url-loader?limit=100000&&mimetype=image/png'
    });
};
