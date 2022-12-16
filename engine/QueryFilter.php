<?php
/**
 * plugin QueryFilter
 *
 * @package   plugin
 * @author    Erik Golinelli <erik@codekraft.it>
 * @copyright 2022 Codekraft
 * @license   GPL 2.0+
 * @link      https://codekraft.it
 */

namespace InfiniteLoad\Engine;

use WP_Block;

/**
 * QueryFilter
 */
class QueryFilter
{

    /**
     * add the filter to the query
     *
     * @return void|boolean
     */
    public function __construct()
    {
        add_filter('render_block_data', array($this, 'infl_filter_block'), 10, 3);
    }

    /**
     * Filter the block query if the namespace is set to codekraft/infinite-load
     *
     * @param array         $parsed_block The block being rendered.
     * @param array         $source_block An un-modified copy of $parsed_block, as it appeared in the source content.
     * @param WP_Block|null $parent_block If this is a nested block, a reference to the parent block.    *
     *
     * @return array The pre-rendered content.
     */
    public function infl_filter_block($parsed_block, $source_block, $parent_block)
    {
        if (isset($parsed_block[ 'attrs' ][ 'namespace' ]) && 'codekraft/infinite-load' === $parsed_block[ 'attrs' ][ 'namespace' ]) {

            // the current loop query
            $queryID = $parsed_block[ 'attrs' ][ 'queryId' ];
            $query = $parsed_block[ 'attrs' ][ 'query' ];

            foreach ($parsed_block[ 'innerBlocks' ] as $key => $inner_block) {
                if (isset($inner_block['blockName']) && $inner_block['blockName'] === 'core/post-template') {
                    /* @TODO: store the inner block template and layout settings for further use */
                    $template = $inner_block['innerBlocks'];
                    $layout = $parsed_block[ 'attrs' ]['displayLayout'];

                    /* Build the html that replaces the loop with the data json encoded inside */
                    $json_data = sprintf(
                        '<div class="wp-block-codekraft-infinite-load-data infinite-load-data hide"><script>let queryData%s =%s</script></div>',
                        $queryID,
                        wp_json_encode(array( 'query' => $query, 'template' => $template, 'layout' => $layout ), true)
                    );

                    /* @TODO: replace with proxies and move this at the end */
                    /* Replaces the query item with the html created before */
                    $parsed_block['innerBlocks'][$key]['blockName'] = 'codekraft/infinite-load-data';
                    $parsed_block['innerBlocks'][$key]['attrs'] = array( 'className' => 'infinite-load-data' );
                    $parsed_block['innerBlocks'][$key]['innerBlocks'] = array();
                    $parsed_block['innerBlocks'][$key]['innerHtml'] = $json_data;
                    $parsed_block['innerBlocks'][$key]['innerContent'] = array($json_data);
                }
            }
        }
        return $parsed_block;
    }
}
