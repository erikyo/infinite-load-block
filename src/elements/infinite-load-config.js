import { icon, pluginPrimaryColor } from '../assets/icons';

/** The plugin namespace */
export const NAMESPACE = 'codekraft/infinite-load';

/**
 * Defines the block type.
 *
 * @type {WPBlockVariation} block variation definition
 */
export const infiniteLoadConfig = {
	name: NAMESPACE,
	description: 'infinite loop query',
	title: 'InfiniteLoad Loop',
	icon,
	attributes: {
		namespace: NAMESPACE,
		className: NAMESPACE,
		infiniteLoadFilters: {
			searchEnabled: true,
			activeFilter: [ 'categories', 'tags' ],
		},
		displayLayout: {
			type: 'flex',
			columns: 3,
		},
		query: {
			perPage: 6,
			startWith: 0,
			stopAfter: 3,
			displayProxies: true,
			pages: 0,
			offset: 0,
			postType: 'post',
			order: 'desc',
			orderBy: 'date',
		},
		infinitePagination: {
			primaryColor: pluginPrimaryColor,
			secondaryColor: '#555',
			loaderSize: 50,
			loaderSpeed: 500,
			paginationAlignment: 'has-text-align-center',
		},
	},
	example: {
		perPage: 3,
	},
	//https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/extending-the-query-loop-block/#disabling-irrelevant-or-unsupported-query-controls
	allowedControls: [ 'inherit', 'postType', 'order', 'taxQuery', 'search' ],
	scope: [ 'inserter' ],
	isActive: [ 'namespace' ],
	innerBlocks: [
		[ 'codekraft/infinite-load-filters' ],
		[ 'core/post-template', {} ],
		[ 'codekraft/infinite-load-pagination' ],
		[ 'core/query-no-results' ],
	],
};
