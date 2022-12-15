export const SinglePost = ( props ) => {
	return (
		<div>
			<figure>
				<img src={ props.img.src } alt={ props.img.alt } />
			</figure>
			<h2>{ props.postTile }</h2>
			<p>{ props.excerpt }</p>
		</div>
	);
};

/**
 * It takes in a list of rows and a filter list, and returns a list of rows that match the filter list
 *
 * @param {Object} props         - the posts list with atttibutes
 * @param {Object} props.posts   - the post list
 * @param {Object} props.filters - the enabled filters
 *
 * @return {JSX} The Rows component is being returned.
 */
export const PostList = ( { posts, filters } ) => {
	const filteredPosts = filters.search
		? posts.filter( ( listRow ) =>
				listRow.category.includes( filters.search )
		  )
		: posts;

	return filteredPosts.map( ( post, index ) => (
		<SinglePost key={ index } { ...post } />
	) );
};
