<?php
/**
 * plugin Enqueue
 *
 * @package   plugin
 * @author    Erik Golinelli <erik@codekraft.it>
 * @copyright 2022 Codekraft
 * @license   GPL 2.0+
 * @link      https://codekraft.it
 */

namespace InfiniteLoad\Engine;

/**
 * Enqueue
 */
class Enqueue {

    /**
     * the plugin initialisation
     *
     * @return void
     */
    public function __construct() {
        \add_action( 'init', function () {
            \register_block_type( INFLPATH . '/build' );
        } );

        \add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_scripts' ) );
        // \add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_style' ) );
    }


    /**
     * Load the frontend script
     *
     * @return void
     */
    public function enqueue_frontend_scripts() {
        $asset = include INFLPATH . '/build/infinite-load-frontend.asset.php';
        \wp_enqueue_script( 'infinite-load-frontend', INFLURL . 'build/infinite-load-frontend.js', $asset['dependencies'], false, true );
        \wp_localize_script(
            'infinite-load-frontend',
            'infl',
            array(
                'nonce' => wp_create_nonce( INFL_TEXTDOMAIN )
            )
        );
    }

    /**
     * Load the frontend style
     *
     * @return void
     */
    public function enqueue_style() {
        \wp_enqueue_style( 'infinite-load-style', INFLURL . 'build/style-infinite-load.css' );
    }

}