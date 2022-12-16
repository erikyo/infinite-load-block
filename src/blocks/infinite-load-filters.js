import { __ } from '@wordpress/i18n';
import { iconFilters as icon } from '../assets/icons';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	CheckboxControl,
	Panel,
	PanelBody,
	SelectControl,
} from '@wordpress/components';

export const InfiniteLoadFilters = {
	title: 'InfiniteLoad Filters',
	category: 'Layout',
	ancestors: [ 'codekraft/infinite-load' ],
	attributes: {
		searchEnabled: {
			type: 'boolean',
			default: true,
		},
		activeFilters: {
			type: 'array',
			default: [],
		},
	},
	icon,
	edit: ( { attributes, setAttributes } ) => {
		const { searchEnabled, activeFilters } = attributes;

		// @TODO: Implement search
		const FILTERSTEMPLATE = [
			[
				'core/paragraph',
				{
					placeholder: __( 'Filters' ),
				},
			],
		];

		return (
			<div>
				<InspectorControls>
					<Panel header={ 'infinite-load-filters' }>
						<PanelBody key={ 'default' }>
							<CheckboxControl
								label="Display the search input box"
								checked={ searchEnabled }
								onChange={ ( v ) =>
									setAttributes( { searchEnabled: v } )
								}
							/>
							<SelectControl
								multiple
								label={ __( 'Select filters type' ) }
								value={ activeFilters }
								onChange={ ( selectedFilters ) => {
									setAttributes( {
										activeFilters: selectedFilters,
									} );
								} }
								options={ [
									{
										value: '',
										label: 'Select a Filter type',
										disabled: true,
									},
									{
										label: __( 'Category' ),
										value: 'category',
									},
									{ label: __( 'Tag' ), value: 'tag' },
								] }
							/>
						</PanelBody>
					</Panel>
				</InspectorControls>
				{ searchEnabled && (
					<>
						<input
							type={ 'search' }
							value={ 'fake' }
							readOnly={ true }
						/>

						<select readOnly={ true }>
							<option value="fake" />
						</select>
					</>
				) }
				{ activeFilters.length &&
					activeFilters.map( ( filter ) => (
						<>
							<select id={ 'select-' + filter }>
								<option value={ 'fake' }>{ filter }</option>
							</select>
						</>
					) ) }
				<InnerBlocks template={ FILTERSTEMPLATE } />
			</div>
		);
	},
	save: ( { attributes } ) => {
		const { searchEnabled, activeFilters } = attributes;
		const blockProps = useBlockProps.save();

		blockProps.className = 'infinite-load-filters';

		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
				{ searchEnabled && (
					<input
						type={ 'search' }
						label="Search"
						placeholder={ __( 'Search' ) }
					/>
				) }
				{ searchEnabled && (
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
							<select id={ 'select-' + filter }>
								<option value={ '' }>{ filter }</option>
							</select>
						</>
					) ) }
			</div>
		);
	},
};
