import { iconPagination as icon, pluginPrimaryColor } from '../assets/icons';
import edit from './pagination/edit';
import save from './pagination/save';

/**
 * @type {Object} block
 */
export const InfiniteLoadPagination = {
	apiVersion: 2,
	title: 'InfiniteLoad Pagination',
	category: 'theme',
	ancestors: [ 'codekraft/infinite-load' ],
	className: [ 'infinite-load-pagination' ],
	supports: {
		align: true,
		className: true,
		spacing: true,
	},
	attributes: {
		primaryColor: {
			type: 'string',
			default: pluginPrimaryColor,
		},
		secondaryColor: {
			type: 'string',
			default: '#555',
		},
		loaderSize: {
			type: 'number',
			default: 50,
		},
		loaderSpeed: {
			type: 'number',
			default: 500,
		},
	},
	icon,
	edit,
	save,
};
