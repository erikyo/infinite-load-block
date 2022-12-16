import { fetchPost } from './utils/fetch';
import apiFetch from '@wordpress/api-fetch';
import { NAMESPACE } from './blocks/infinite-load-config';
import { wrapGrid } from 'animate-css-grid';
import { updateUrl } from './utils/helpers';

apiFetch.use( apiFetch.createNonceMiddleware( NAMESPACE ) );

/**
 * @type {Object} query
 *
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

			let searchTimeout = null;

			const filterArea = loopNode.parentNode.querySelector(
				'.infinite-load-filters'
			);
			const postCounter = document.createElement( 'p' );
			postCounter.textContent = '0 / 0';
			postCounter.classList.add( 'infinite-load-counter' );
			filterArea.prepend( postCounter );

			const searchInput = filterArea.querySelector(
				'input[type="search"]'
			);
			searchInput.addEventListener( 'keyup', ( ev ) => {
				if ( ev.key === 'Enter' ) {
					ev.preventDefault();
				} else if ( ev.key === 'Escape' ) {
					searchInput.value = '';
					searchInput.blur();
				} else if ( ! ev.target.value ) {
					posts.shown = posts.list;
					posts.hidden = [];
					return posts.updateFilters( posts.shown, posts.hidden );
				}
				return posts.search( ev.target.value );
			} );

			const pagination = loopNode.parentNode.querySelector(
				'.infinite-load-pagination'
			);
			pagination.button = pagination.querySelector(
				'input[type="button"]'
			);
			pagination.button.onclick = () => stopLoading( false );
			pagination.loader = pagination.querySelector( 'svg' );

			/* create the needed elements */
			const wrapper = document.createElement( 'div' );
			wrapper.classList.add( 'infinite-load-wrapper' );
			wrapper.style.display = 'grid';
			wrapper.style.gridTemplateColumns = `repeat(${ data.layout.columns }, 1fr)`;

			/* add the wrapper after infinite-load-data */
			loopNode.parentNode.insertBefore( wrapper, loopNode.nextSibling );

			wrapGrid( wrapper, {
				duration: 500,
				stagger: 50,
			} );

			const createPost = ( postData ) => {
				/* for each post create the post item */
				const newItem = document.createElement( 'div' );
				newItem.id = 'post-' + postData.ID;
				newItem.classList.add( 'post-item' );

				postData.post_image = postData.post_image || '';
				postData.post_category = postData.post_category
					? postData.post_category[ 0 ].name
					: 'no category';
				const postImage = `<figure class="post_img"><img src="${ postData.post_image[ 0 ] }"/></figure>`;

				newItem.innerHTML = `<div class="inner">
					${ postImage }
					<a href="${ postData.guid }"><h4>${ postData.post_title }</h4></a>
					<p class="post-date has-text-align-right">${ postData.post_date }</p>
					<p>${ postData.post_category }</p>
					<p>${ postData.post_excerpt }</p>
				</div>`;

				return newItem;
			};

			console.log(
				'displayProxies %s, startWith %s, stopAfter %s',
				displayProxies,
				startWith,
				stopAfter
			);

			function setWait( waitValue ) {
				if ( waitValue ) {
					intersectionObserver.unobserve( pagination );
				} else {
					intersectionObserver.observe( pagination );
				}
			}

			function stopLoading( isStopped ) {
				if ( isStopped ) {
					pagination.button.classList.remove( 'hide' );
					pagination.loader.classList.add( 'hide' );
				} else {
					pagination.button.classList.add( 'hide' );
					pagination.loader.classList.remove( 'hide' );
					setWait( false );
					posts.loadItems();
				}
			}

			/* will store the retrieved post */
			const posts = {
				hidden: [],
				shown: [],
				list: [],
				updateCount: () => {
					return posts.shown.length + ' / ' + posts.list.length;
				},
				updateFilters: () => {
					posts.hidden.forEach( ( el ) => {
						const item = wrapper.querySelector( '#post-' + el.ID );
						if ( item ) item.remove();
					} );
					posts.shown.forEach( ( el ) => {
						const item = wrapper.querySelector( '#post-' + el.ID );
						if ( ! item ) wrapper.appendChild( createPost( el ) );
					} );
					postCounter.textContent = posts.updateCount();
				},
				search: ( term ) => {
					updateUrl( 'search', term );

					if ( searchTimeout ) {
						clearTimeout( searchTimeout );
					}

					const regex = new RegExp(
						'.*(' + term.split( ' ' ) + ').*',
						'i'
					);

					searchTimeout = setTimeout( () => {
						/* filter item to be shown */
						posts.shown = term
							? posts.list.filter( ( post ) =>
									regex.test( post.post_title )
							  )
							: posts.list;
						/* filter item to be hidden */
						posts.hidden = term
							? posts.list.filter(
									( post ) => ! regex.test( post.post_title )
							  )
							: [];

						posts.updateFilters( posts.shown, posts.hidden );
					}, 300 );
				},
				sortby: ( sorting ) => {
					return sorting;
				},
				loadItems: () => {
					/* set wait state */
					setWait( true );

					/* fetch rest api and get more post */
					fetchPost( data.query )
						.then( ( newPosts ) => {
							/* store the page Url / history */
							updateUrl( 'page', data.query.page++ );

							if ( data.query.page % stopAfter === 0 ) {
								stopLoading( true );
							} else {
								/* Remove wait state (will enable the fetch again) */
								setWait( false );
							}

							/* Handle error */
							if ( newPosts.message === 'error' ) {
								console.warn( newPosts );
								throw new Error( newPosts.error );
							}

							/* update the displayed post collection */
							/* log data todo remove */
							console.log( newPosts.results );

							/* push the results into the wrapper container */
							newPosts.results.forEach( ( post ) => {
								/* then append at the end of the wrapper */
								posts.list.push( post );
								posts.shown.push( post );
								wrapper.appendChild( createPost( post ) );
							} );

							/* move pagination after the wrapper */
							wrapper.after( pagination );

							postCounter.textContent = posts.updateCount();

							return posts;
						} )
						.catch( ( err ) => {
							throw new Error( err );
						} );
				},
			};

			/* the intersection observer will watch if the sentinel is in the screen then will load more  */
			const intersectionObserver = new window.IntersectionObserver(
				( entries ) => {
					if (
						entries.some( ( entry ) => entry.intersectionRatio > 0 )
					)
						posts.loadItems();
				}
			);
			intersectionObserver.observe( pagination );
		} );
}

window.onload = infiniteLoad;
