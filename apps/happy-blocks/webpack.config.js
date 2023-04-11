/**
 * WARNING: No ES6 modules here. Not transpiled!
 */
// eslint-disable-next-line import/no-nodejs-modules
const { existsSync } = require( 'fs' );
const path = require( 'path' );
const BuildMetaPlugin = require( '@automattic/calypso-apps-builder/build-meta-webpack-plugin.cjs' );
const getBaseWebpackConfig = require( '@automattic/calypso-build/webpack.config.js' );
const ReadableJsAssetsWebpackPlugin = require( '@wordpress/readable-js-assets-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const webpack = require( 'webpack' );
const GenerateChunksMapPlugin = require( '../../build-tools/webpack/generate-chunks-map-plugin' );
const outputPath = path.join( __dirname, 'dist' );

function ifExists( rule ) {
	return existsSync( rule.from ) ? rule : undefined;
}

function getWebpackConfig( env = { block: '' }, argv ) {
	const webpackConfig = getBaseWebpackConfig( { ...env, WP: true }, argv );
	const isProduction = process.env.NODE_ENV === 'production';

	const blockName = env.block.split( '/' ).pop();
	const blockPath = path.join( __dirname, 'block-library/', blockName );

	if ( ! blockName ) {
		throw new Error( 'No block specified.' );
	}

	const entry = () => {
		return {
			index: path.join( blockPath, 'index' ),
			view: path.join( blockPath, 'view' ),
		};
	};

	return {
		...webpackConfig,
		entry,
		output: {
			...webpackConfig.output,
			path: path.join( blockPath, '/build/' ),
			filename: '[name].js',
		},
		plugins: [
			...webpackConfig.plugins,
			BuildMetaPlugin( { outputPath } ),
			new ReadableJsAssetsWebpackPlugin(),
			new CopyPlugin( {
				patterns: [
					ifExists( {
						from: path.resolve( blockPath, 'index.php' ),
						to: path.resolve( blockPath, 'build', '[name][ext]' ),
						transform( content ) {
							return content.toString().replace( '/build/rtl', '/rtl' ).replace( '/build', '/' );
						},
					} ),
					ifExists( {
						from: path.resolve( blockPath, 'includes.php' ),
						to: path.resolve( blockPath, 'build', '[name][ext]' ),
						transform( content ) {
							return content.toString().replace( '/build/rtl', '/rtl' ).replace( '/build', '/' );
						},
					} ),
					ifExists( {
						from: path.resolve( blockPath, 'block.json' ),
						to: path.resolve( blockPath, 'build', '[name][ext]' ),
					} ),
					ifExists( {
						from: path.resolve( blockPath, 'rtl/block.json' ),
						to: path.resolve( blockPath, 'build/rtl', '[name][ext]' ),
					} ),
				].filter( Boolean ),
			} ),
			new webpack.DefinePlugin( {
				__i18n_text_domain__: JSON.stringify( 'happy-blocks' ),
			} ),
			...( isProduction
				? [
						new GenerateChunksMapPlugin( {
							output: path.join( blockPath, 'build/chunks-map.json' ),
						} ),
				  ]
				: [] ),
		],
	};
}

module.exports = getWebpackConfig;
