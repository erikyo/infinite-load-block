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
								value={ activeFilters } // e.g: value = [ 'a', 'c' ]
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
					<input
						type={ 'search' }
						defaultValue={ 'this input is a fake' }
						readOnly={ true }
					/>
				) }
				{ activeFilters.length && activeFilters.join() }
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
				{ activeFilters.length && activeFilters.join() }
			</div>
		);
	},
};
