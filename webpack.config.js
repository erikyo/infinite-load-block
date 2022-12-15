const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

const entry = {};
[ 'infinite-load', 'infinite-load-frontend' ].forEach(
	( script ) =>
		( entry[ script ] = path.resolve(
			process.cwd(),
			`src/${ script }.js`
		) )
);

module.exports = {
	...defaultConfig,
	entry,
};
