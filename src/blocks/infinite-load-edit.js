import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalNumberControl as NumberControl,
	CheckboxControl,
} from '@wordpress/components';
import { more } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * create infiniteLoad createHigherOrderComponent with edit and save function
 *
 * @param {mapComponent} mapComponent - the BlockEdit object
 */
const infiniteLoadEdit = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			attributes: { namespace, query },
			setAttributes,
			isSelected,
		} = props;

		if ( namespace !== 'codekraft/infinite-load' || ! isSelected ) {
			return <BlockEdit { ...props } />;
		}

		const { displayProxies, startWith, stopAfter } = query;

		// Render the block editor and display the query post loop.
		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						key={ namespace }
						title={ namespace }
						icon={ more }
						initialOpen={ true }
					>
						<NumberControl
							label={ __(
								'Pages loaded before display the load more button'
							) }
							value={ stopAfter }
							onChange={ ( value ) =>
								setAttributes( {
									stopAfter: value,
								} )
							}
						/>
						<NumberControl
							label={ __(
								'The number of post to display on load'
							) }
							value={ startWith }
							onChange={ ( value ) =>
								setAttributes( {
									startWith: value,
								} )
							}
						/>
						<CheckboxControl
							label={ __(
								'Display proxies during the post fetch'
							) }
							onChange={ ( value ) =>
								setAttributes( { displayProxies: value } )
							}
							checked={ displayProxies }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControl' );

export default infiniteLoadEdit;
