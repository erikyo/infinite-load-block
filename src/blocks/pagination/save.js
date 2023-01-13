import { useBlockProps } from '@wordpress/block-editor';
import { Loader } from '../../components/Loader';
import { __ } from '@wordpress/i18n';

const save = ( { attributes } ) => {
	const { primaryColor, secondaryColor, loaderSpeed, loaderSize } =
		attributes;

	const blockProps = useBlockProps.save();

	return (
		<div
			{ ...blockProps }
			className={ blockProps.className + ' infinite-load-pagination' }
		>
			<Loader
				className={ 'infinite-loader' }
				isLoading={ true }
				animationSpeed={ loaderSpeed }
				colorPrimary={ primaryColor }
				colorSecondary={ secondaryColor }
				size={ loaderSize }
			/>
			<input
				type={ 'button' }
				className={ 'button button-primary hide' }
				value={ __( 'Load more' ) }
			/>
		</div>
	);
};

export default save;
