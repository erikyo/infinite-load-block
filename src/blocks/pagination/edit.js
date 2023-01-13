import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ColorPalette,
	Panel,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { Loader } from '../../components/Loader';

const edit = ( { attributes, setAttributes } ) => {
	const { primaryColor, secondaryColor, loaderSpeed, loaderSize } =
		attributes;

	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<Panel header={ 'infinite-load-Pagination' }>
					<PanelBody key={ 'default' }>
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
			<div className={ 'infinite-loader-pagination ' }>
				<Loader
					isLoading={ true }
					animationSpeed={ loaderSpeed }
					colorPrimary={ primaryColor }
					colorSecondary={ secondaryColor }
					size={ loaderSize }
				/>
				<input
					type={ 'button' }
					className={ 'button button-primary button-load-more hide' }
					value={ __( 'Load more' ) }
					style={ {
						backgroundColor: secondaryColor,
						color: primaryColor,
					} }
				/>
			</div>
		</div>
	);
};

export default edit;
