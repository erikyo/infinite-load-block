import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const save = ( { attributes } ) => {
	const { searchEnabled, sortByEnabled, activeFilters } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div
			{ ...blockProps }
			className={ blockProps.className + ' infinite-load-filters' }
		>
			<InnerBlocks.Content />
			{ searchEnabled && (
				<input
					type={ 'search' }
					label="Search"
					placeholder={ __( 'Search' ) }
				/>
			) }
			{ sortByEnabled && (
				<>
					<label htmlFor="select-orderby">orderby</label>
					<select id="select-sortby">
						{ /* @todo: add a user control to choose filters  */ }
						<option value="ID-desc">default</option>
						<option value="title-desc">title a-z</option>
						<option value="title-asc">title z-a</option>
						<option value="date-desc">date asc</option>
						<option value="date-asc">date desc</option>
					</select>
				</>
			) }
			{ activeFilters.length &&
				activeFilters.map( ( filter ) => (
					<>
						<label htmlFor={ 'select-' + filter }>
							Filter by { filter }
						</label>
						<select id={ 'select-' + filter }>
							<option value={ '' }>{ filter }</option>
						</select>
					</>
				) ) }
		</div>
	);
};

export default save;
