import { fetchPost } from './utils/fetch';
import apiFetch from '@wordpress/api-fetch';
import { NAMESPACE } from './elements/infinite-load-config';

apiFetch.use( apiFetch.createNonceMiddleware( NAMESPACE ) );

/**
 * @type {Object} query
 * @property {string} query.displayProxies - if we want to show the post proxy before load (similar to LinkedIn).
 * @property {number} query.startWith      - how many posts to load on the first request.
 * @property {number} query.stopAfter      - show the load more button after this many requests.
 */

function infiniteLoad() {
	document
		.querySelectorAll( '.infinite-load-data' )
		.forEach( ( loopNode ) => {
			const dataNode = loopNode.querySelector( 'script' );
			/* parse query data, since the json array */
			const data = JSON.parse( dataNode.innerHTML.split( '=' )[ 1 ] );
			const { displayProxies, startWith, stopAfter } = data.query;
			/* set the current page */
			data.query.page = 0;
			/* remove unneeded plugin data from query */
			delete data.query.displayProxies;
			delete data.query.startWith;
			delete data.query.stopAfter;

			let counter = 0;
			let wait = false;
			let searchTimeout = null;

			/* will store the retrieved post */
			let filteredPosts = [];
			let posts = [];

			const filterArea = loopNode.parentNode.querySelector(
				'.infinite-load-filters'
			);
			const searchInput = filterArea.querySelector(
				'input[type="search"]'
			);

			/* create the needed elements */
			const wrapper = document.createElement( 'div' );
			wrapper.classList.add( 'infinite-load-wrapper' );
			wrapper.style.display = 'grid';
			wrapper.style.gridTemplateColumns = `repeat(${ data.layout.columns }, 1fr)`;

			const sentinel = document.createElement( 'div' );
			sentinel.classList.add( 'infinite-load-sentinel' );
			sentinel.style.width = '100%';
			// add the sentinel to the newly created div
			wrapper.appendChild( sentinel );

			/* add the wrapper after infinite-load-data */
			loopNode.parentNode.insertBefore( wrapper, loopNode.nextSibling );

			console.log(
				'displayProxies %s, startWith %s, stopAfter %s',
				displayProxies,
				startWith,
				stopAfter
			);

			function setWait( waitValue ) {
				wait = waitValue;
			}

			function updateFilters( excluded ) {
				excluded.forEach( ( el ) => {
					wrapper.querySelector( '#post-' + el.ID ).style.display =
						'none';
				} );
			}

			function search( term ) {
				if ( searchTimeout ) {
					clearTimeout( searchTimeout );
				}
				searchTimeout = setTimeout( () => {
					filteredPosts = term
						? posts.filter(
								( post ) => ! post.post_title.includes( term )
						  )
						: posts;
					updateFilters( filteredPosts );
				}, 100 );
			}

			searchInput.addEventListener( 'keyup', ( ev ) => {
				if ( ev.key === 'Enter' ) {
					ev.preventDefault();
				} else if ( ev.key === 'Escape' ) {
					searchInput.value = '';
					searchInput.blur();
				} else {
					search( ev.target.value );
				}
			} );

			function updatePostList( postList ) {
				/* push the results into the wrapper container */
				postList.forEach( ( post ) => {
					/* log data todo remove */
					console.log( post );

					/* for each post create the post item */
					const newItem = document.createElement( 'div' );
					newItem.id = 'post-' + post.ID;
					newItem.classList.add( 'post-item' );
					newItem.textContent = post.post_title + ' ' + counter++;

					/* then append at the end of the wrapper */
					wrapper.appendChild( newItem );
				} );
			}

			const loadItems = () => {
				/* log data todo remove */
				console.log( data.query );

				/* set wait state */
				setWait( true );

				/* fetch rest api and get more post */
				fetchPost( data.query )
					.then( ( newPosts ) => {
						/* Remove wait state */
						setWait( false );
						data.query.page++;

						/* Handle error */
						if ( newPosts.message === 'error' ) {
							console.warn( newPosts );
							throw new Error( newPosts.error );
						}

						/* update the displayed post collection */
						updatePostList( newPosts.results );

						/* update the post collection */
						posts = [ ...posts, ...newPosts.results ];

						/* move the sentinel at the end of the wrapper */
						wrapper.appendChild( sentinel );

						return posts;
					} )
					.catch( ( err ) => {
						throw new Error( err );
					} );
			};

			/* the intersection observer will watch if the sentinel is in the screen then will load more  */
			const intersectionObserver = new window.IntersectionObserver(
				( entries ) => {
					if (
						entries.some( ( entry ) => entry.intersectionRatio > 0 )
					)
						loadItems();
				}
			);
			intersectionObserver.observe( sentinel );
		} );
}

window.onload = infiniteLoad;
