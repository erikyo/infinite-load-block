import { __ } from '@wordpress/i18n';
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
import { select } from '@wordpress/data';
import { store } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';

const selectDefaultValue = {
	value: '',
	label: 'Select a Filter type',
	disabled: true,
};

const Edit = ( { attributes, setAttributes } ) => {
	const { searchEnabled, sortByEnabled, activeFilters } = attributes;
	// const data = { types: [ selectDefaultValue ] };
	const [ postData, setPortData ] = useState( {
		types: [ selectDefaultValue ],
	} );

	const newTypes = select( store ).getPostType();

	useEffect( () => {
		if ( newTypes ) {
			setPortData( {
				types: [
					selectDefaultValue,
					...Object.values( newTypes ).map( ( value, index ) => {
						return {
							key: index,
							value: value.slug,
							label: value.name,
						};
					} ),
				],
			} );
		}
	}, [ newTypes ] );

	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
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
						<CheckboxControl
							label="Display sort by select input"
							checked={ sortByEnabled }
							onChange={ ( v ) =>
								setAttributes( { sortByEnabled: v } )
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
							options={ postData.types }
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>
			<div>
				{ searchEnabled && (
					<input
						type={ 'search' }
						value={ 'fake' }
						readOnly={ true }
					/>
				) }
				{ sortByEnabled && (
					<select readOnly={ true }>
						<option value="fake">Sort By</option>
					</select>
				) }
				{ activeFilters &&
					activeFilters.map( ( filter ) => (
						<select
							id={ 'select-' + filter }
							key={ filter }
							readOnly={ true }
						>
							<option value={ 'fake' }>{ filter }</option>
						</select>
					) ) }
				<InnerBlocks template={ [] } />
			</div>
		</div>
	);
};

export default Edit;
