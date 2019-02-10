const path = require('path');
const process = require('process');

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.glsl$/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                if(process.env.MODE_ENV === 'developemt') {
                                    return '[path][name].[ext]';
                                }
                                return '[hash].[ext]';
                            },
                        },
                    },
                ]
            }
        ]
    }
};