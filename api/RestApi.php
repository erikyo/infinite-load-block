<?php
/**
 * plugin
 *
 * @package   plugin
 * @author    Erik Golinelli <erik@codekraft.it>
 * @copyright 2022 Codekraft
 * @license   GPL 2.0+
 * @link      https://codekraft.it
 */

namespace InfiniteLoad\RestApi;

use WP_Query;

/**
 * REST
 * this class handles all REST API requests, query the database then return the results
 */
class RestApi
{

    /**
     * Initialize the class.
     */
    public function __construct()
    {
        \add_action('rest_api_init', function () {
            $this->add_manager_route();
        });
    }
    public function add_manager_route()
    {
        \register_rest_route('infinite-load/v1', '/status/', array(
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => function () {
                echo 'api ok!';
            }
        ));
        \register_rest_route('infinite-load/v1', '/query/', array(
            'methods'             => 'POST',
            'permission_callback' => '__return_true',
            'callback'            => array( $this, 'infl_query' ),
            'args'                => array(
                'nonce' => array(
                    'required' => true,
                ),
            ),
        ));
        \register_rest_route('infinite-load/v1', '/data/', array(
            'methods'             => 'POST',
            'permission_callback' => '__return_true',
            'callback'            => array( $this, 'infl_get_data' ),
            'args'                => array(
                'nonce' => array(
                    'required' => true,
                ),
            ),
        ));
    }

    /**
     * This function will clean the query arguments passed to the wp_query function
     *
     * @param array $raw_query the raw query string that was requested by the user with the fetch api
     *
     * @return array the parsed query arguments ready for WP_Query
     */
    private function infl_prepare_query($raw_query)
    {
        $taxQuery = ($raw_query['postType'] === 'product') ? array(
            'post_type' => 'product',
            'tax_query' => array(
                'taxonomy' => 'product_cat',
            ),
        ) : array(
            'post_type' => esc_html($raw_query['postType']),
        );

        return array_merge($taxQuery, array(
            // 'offset'         => ! empty( $raw_query['offset'] ) ? intval( $raw_query['offset'] ) : 0,
            'order'          => ! empty($raw_query['order']) && esc_html($raw_query['order']) === 'asc' ? 'ASC' : 'DESC',
            'orderby'        => ! empty($raw_query['orderBy']) ? esc_html($raw_query['orderBy']) : 'post-date',
            'paged'          => ! empty($raw_query['page']) ? intval($raw_query['page']) : 0,
            'posts_per_page' => ! empty($raw_query['perPage']) ? intval($raw_query['perPage']) : 10,
            'post_status'    => 'publish',
        ));
    }

    public function infl_get_data(\WP_REST_Request $request)
    {
        // $request is an array with various parameters
        if (! \wp_verify_nonce(\strval($request['nonce']), INFL_TEXTDOMAIN)) {
            $response = \rest_ensure_response('Wrong nonce');

            if (\is_wp_error($response)) {
                return $request;
            }

            $response->set_status(500);

            return $response;
        }

        $datatype = $request->get_json_params()['datatype'];

        if ($datatype === 'categories') {
            $categories = get_terms(array( 'taxonomy' => 'product_cat' ));
            if (! empty($categories)) {
                $response = \rest_ensure_response($categories);
                $response->set_status(200);
            }
        } elseif ($datatype === 'authors') {
            $authors = get_users(array( 'fields' => array( 'ID', 'display_name' ) ));
            if (! empty($authors)) {
                $response = \rest_ensure_response($authors);
                $response->set_status(200);
            }
        } else {
            $response = \rest_ensure_response(array( "error" => 'no data for requested datatype' ));
            $response->set_status(500);
        }

        return $response;
    }

    public function infl_query(\WP_REST_Request $request)
    {

        // $request is an array with various parameters
        if (! \wp_verify_nonce(\strval($request['nonce']), INFL_TEXTDOMAIN)) {
            $response = \rest_ensure_response('Wrong nonce');

            if (\is_wp_error($response)) {
                return $request;
            }

            $response->set_status(500);

            return $response;
        }

        $query_params = $request->get_json_params()['args'];

        if (! empty($query_params)) {
            /* parse the raw arguments before use with wp_query */
            $args = self::infl_prepare_query($query_params);

            /* perform the query with the give arguments */
            $query = new WP_Query($args);

            if ($query->have_posts()) {
                $posts = $query->posts;

                foreach ($posts as $post) {
                    $post->post_image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'large');
                    $post->post_cat   = get_the_terms($post->ID, $post->post_type === 'post' ? 'category' : $post->post_type . "_cat");
                    $post->post_tags  = get_the_terms($post->ID, 'post_tag');
                }

                $response = \rest_ensure_response(array( 'message' => 'ok', 'results' => $posts, 'args' => $args ));
                $response->set_status(200);
            } else {
                if (is_wp_error($query)) {
                    $response = \rest_ensure_response(array( 'message' => "error", "error" => 'query_error', "queryArgs" => $args ));
                    $response->set_status(500);
                } else {
                    $response = \rest_ensure_response(array( 'message' => "the query returned no results" ));
                    $response->set_status(200);
                }
            }
        } else {
            $response = \rest_ensure_response(array( "message" => 'error', 'error' => 'query_params is empty' ));
            $response->set_status(500);
        }

        return $response;
    }
}
