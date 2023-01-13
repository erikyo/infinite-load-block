import { iconFilters as icon } from '../assets/icons';

import Edit from './filters/edit';
import save from './filters/save';

export const InfiniteLoadFilters = {
	apiVersion: 2,
	title: 'InfiniteLoad Filters',
	category: 'theme',
	ancestors: [ 'codekraft/infinite-load' ],
	supports: {
		align: true,
		className: true,
		spacing: true,
	},
	attributes: {
		searchEnabled: {
			type: 'boolean',
			default: true,
		},
		sortByEnabled: {
			type: 'boolean',
			default: true,
		},
		activeFilters: {
			type: 'array',
			default: [],
		},
	},
	icon,
	edit: Edit,
	save,
};
