const fs = require('fs');
const Webpack = require('webpack');
const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

require('dotenv').config({
	path: Path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

// Set the directory path for pages
const pagesDirectory = Path.join(__dirname, 'src/pages/');

// Helper function to generate entries
function generateEntries(directory) {
	const files = fs.readdirSync(directory);
	const entries = {};

	files.forEach((file) => {
		console.log(file);

		const name = Path.parse(file).name;
		if (Path.extname(file) == '.hbs') {
			entries[name] = Path.join(directory, file);
		}
	});

	return entries;
}

module.exports = {
	target: 'web',
	mode: isDev ? 'development' : 'production',
	devtool: 'source-map',
	output: {
		path: Path.resolve(__dirname, 'build/'),
	},
	resolve: {
		alias: {
			'@fonts': Path.join(__dirname, 'src/fonts'),
			'@images': Path.join(__dirname, 'src/images'),
			'@scripts': Path.join(__dirname, 'src/scripts'),
			'@styles': Path.join(__dirname, 'src/styles'),
		},
		modules: [Path.resolve(__dirname, 'node_modules'), 'node_modules'],
	},
	plugins: [
		new Webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'process.env.BASE_URL_PATH': JSON.stringify(process.env.BASE_URL_PATH),
			'process.env.API_URL': JSON.stringify(process.env.API_URL),
			'process.env.FORM_URL': JSON.stringify(process.env.FORM_URL),
		}),
		new CleanWebpackPlugin(),
		new HtmlBundlerPlugin({
			entry: generateEntries(pagesDirectory),
			data: 'src/data/global.js',
			preprocessor: 'handlebars',
			preprocessorOptions: {
				helpers: [Path.join(__dirname, 'src/helpers')],
				partials: ['src/partials/', 'src/pages/'],
			},
			js: {
				filename: 'js/[name].js',
			},
			css: {
				filename: 'css/[name].css',
			},
			verbose: true,
		}),
		function () {
			console.log('NODE_ENV: ', process.env.NODE_ENV);
			console.log('isDev: ', isDev);
			console.log(
				'Resolved .env path: ',
				Path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
			);
			console.log('BASE_URL_PATH: ', process.env.BASE_URL_PATH);
		},
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				include: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.s?css/i,
				use: [
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				type: 'asset/resource',
			},
			{
				test: /\.svg$/,
				type: 'asset',
				loader: 'svgo-loader',
				options: {
					configFile: Path.resolve(__dirname, './svgo.config.js'),
				},
			},
		],
	},
	devServer: {
		port: 8000,
		liveReload: true,
		open: true,
		static: Path.resolve(__dirname, 'build'),
		watchFiles: {
			paths: ['src/**/*.*'],
			options: {
				usePolling: true,
			},
		},
		client: {
			logging: 'error',
		},
	},
};
