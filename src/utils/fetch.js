/* global infl */
import apiFetch from '@wordpress/api-fetch';

/**
 * It sends a POST request to the `/infinite-load/v1/query` endpoint with the `args` and `nonce` arguments
 *
 * @param {Object} args  - The arguments to pass to the query.
 * @param {string} nonce - A random string that is used to prevent CSRF attacks.
 *
 * @return {Promise} The response to the query
 */
export function queryPost( args, nonce ) {
	return apiFetch( {
		path: '/infinite-load/v1/query',
		method: 'POST',
		data: {
			args,
			nonce,
		},
	} );
}

/**
 * It sends a POST request to the `/plugin/v1/manager/data` endpoint with the `datatype` and `nonce` parameters
 *
 * @param {string} datatype - The type of data you want to retrieve.
 * @param {string} nonce    - A random string that is used to identify the request.
 *
 * @return {Promise} The data is being returned.
 */
export function queryData( datatype, nonce ) {
	return apiFetch( {
		path: '/infinite-load/v1/data',
		method: 'POST',
		data: {
			datatype,
			nonce,
		},
	} );
}

/**
 * It takes a customArgs object as an argument, sets the wait state to true, increments the page number, and then queries the server for the next page of products
 *
 * @param {Object} args - the query page
 *
 * @return {Promise} a promise.
 */
export const fetchPost = async ( args ) => {
	return queryPost( args, infl.nonce )
		.then( ( post ) => {
			if ( post.error ) {
				throw new Error( post.error );
			}
			return post;
		} )
		.catch( ( err ) => {
			throw new Error( err );
		} );
};
