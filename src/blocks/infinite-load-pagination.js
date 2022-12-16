import { Loader } from '../components/Loader';
import { iconPagination as icon, pluginPrimaryColor } from '../assets/icons';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	__experimentalNumberControl as NumberControl, Button,
	ColorPalette,
	Panel,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * @type {Object} block
 */
export const InfiniteLoadPagination = {
	title: 'InfiniteLoad Pagination',
	category: 'Layout',
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
		paginationAlignment: {
			type: 'string',
			default: 'has-text-align-center',
		},
	},
	icon,
	edit: ( { attributes, setAttributes } ) => {
		const {
			primaryColor,
			secondaryColor,
			loaderSpeed,
			loaderSize,
			paginationAlignment,
		} = attributes;

		return (
			<div>
				<InspectorControls>
					<Panel header={ 'infinite-load-Pagination' }>
						<PanelBody key={ 'default' }>
							<SelectControl
								label="Size"
								value={ paginationAlignment }
								options={ [
									{
										label: 'Align left',
										value: 'has-text-align-left',
									},
									{
										label: 'Align center',
										value: 'has-text-align-center',
									},
									{
										label: 'Align right',
										value: 'has-text-align-right',
									},
								] }
								onChange={ ( newAlignment ) =>
									setAttributes( {
										paginationAlignment: newAlignment,
									} )
								}
							/>
							<RangeControl
								label="Count before display the load more button"
								value={ loaderSize }
								onChange={ ( v ) =>
									setAttributes( { loaderSize: v } )
								}
								min={ 20 }
								max={ 200 }
								step={ 10 }
							/>
							<RangeControl
								label={ __( 'Animation Speed' ) }
								value={ loaderSpeed }
								onChange={ ( value ) =>
									setAttributes( { loaderSpeed: value } )
								}
								min={ 100 }
								max={ 2000 }
								step={ 100 }
							/>
							<fieldset>
								<legend className="blocks-base-control__label">
									{ __( 'Primary color' ) }
								</legend>
								<ColorPalette
									value={ primaryColor }
									onChange={ ( hexColor ) => {
										setAttributes( {
											primaryColor: hexColor,
										} );
									} }
								/>
							</fieldset>
							<fieldset>
								<legend className="blocks-base-control__label">
									{ __( 'Secondary color' ) }
								</legend>
								<ColorPalette
									value={ secondaryColor }
									onChange={ ( hexColor ) => {
										setAttributes( {
											secondaryColor: hexColor,
										} );
									} }
								/>
							</fieldset>
						</PanelBody>
					</Panel>
				</InspectorControls>
				<div
					className={
						'infinite-loader-pagination ' + paginationAlignment
					}
				>
					<Loader
						isLoading={ true }
						animationSpeed={ loaderSpeed }
						colorPrimary={ primaryColor }
						colorSecondary={ secondaryColor }
						size={ loaderSize }
					/>
				</div>
			</div>
		);
	},
	save( { attributes } ) {
		const {
			primaryColor,
			secondaryColor,
			loaderSpeed,
			loaderSize,
			paginationAlignment,
		} = attributes;

		const blockProps = useBlockProps.save();
		blockProps.className =
			'infinite-load-pagination ' + paginationAlignment;

		return (
			<div { ...blockProps }>
				<Loader
					className={ 'infinite-loader' }
					isLoading={ true }
					animationSpeed={ loaderSpeed }
					colorPrimary={ primaryColor }
					colorSecondary={ secondaryColor }
					size={ loaderSize }
				/>
				<input type={ 'button' } className={ 'button button-primary hide' } value={ __( 'load more' ) } />
			</div>
		);
	},
};
