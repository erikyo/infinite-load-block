export function updateUrl( queryParamKey, queryParamValue ) {
	const url = new URLSearchParams( window.location.search );

	// set the query string
	url.set( queryParamKey, queryParamValue );
	const nextPath = window.location.pathname + '?' + url.toString();

	// add the current query string to history
	window.history.pushState( null, '', nextPath );
}

/**
 * It takes a query string and a parameter name, and returns the value of the parameter if it exists, or false if it doesn't
 *
 * @param {string} queryString - The query string to parse.
 * @param {string} parameter   - The parameter you want to get from the query string.
 * @return {string} The value of the parameter in the query string.
 */
export function getFromQueryString( queryString, parameter ) {
	const params = new Proxy( new URLSearchParams( queryString ), {
		get: ( searchParams, prop ) => searchParams.get( prop ),
	} );

	return params[ parameter ] || false;
}
