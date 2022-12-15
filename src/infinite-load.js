/**
 * WordPress dependencies
 */
import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

/** The block style */
import './assets/style.scss';

/** The block edit function */
import { infiniteLoadConfig, NAMESPACE } from './elements/infinite-load-config';
import { InfiniteLoadPagination } from './elements/infinite-load-pagination';
import { InfiniteLoadFilters } from './elements/infinite-load-filters';
import infiniteLoadEdit from './elements/infinite-load-edit';

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
