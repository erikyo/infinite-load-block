/**
 * WordPress dependencies
 */
import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

/** The block style */
import './assets/style.scss';

/** The block edit function */
import { infiniteLoadConfig, NAMESPACE } from './blocks/infinite-load-config';
import { InfiniteLoadPagination } from './blocks/infinite-load-pagination';
import { InfiniteLoadFilters } from './blocks/infinite-load-filters';
import infiniteLoadEdit from './blocks/infinite-load-edit';

/**
 * Register infiniteLoop helpers blocks
 */
registerBlockType(
	'codekraft/infinite-load-pagination',
	InfiniteLoadPagination
);
registerBlockType( 'codekraft/infinite-load-filters', InfiniteLoadFilters );

/**
 * Register infiniteLoop block
 */
registerBlockVariation( 'core/query', infiniteLoadConfig );

/**
 * infiniteLoop block Editor scripts
 */
addFilter( 'editor.BlockEdit', NAMESPACE, infiniteLoadEdit );
