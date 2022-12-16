export function updateUrl( queryParamKey, queryParamValue ) {
	const url = new URLSearchParams( window.location.search );

	// set the query string
	url.set( queryParamKey, queryParamValue );
	const nextPath = window.location.pathname + '?' + url.toString();

	// add the current query string to history
	window.history.pushState( null, '', nextPath );
}
