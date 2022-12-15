<?php
/**
 * Plugin Name: infinite Load
 * Plugin URI: https://github.com/erikyo/ssc
 * Description:
 * Version: 0.0.1
 * Author: codekraft
 * License:         GPL 2.0+
 * License URI:     http://www.gnu.org/licenses/gpl-3.0.txt
 * Domain Path:     /languages
 * Requires PHP:    7.1
 * WordPress-Plugin-Boilerplate-Powered: v3.3.0
 *
 * @package   InfiniteLoad
 * @author    Erik Golinelli <erik@codekraft.it>
 * @copyright 2022 Erik
 * @license   GPL 2.0+
 * @link      https://modul-r.codekraft.it/
 */

namespace InfiniteLoad;

define( 'INFLPATH', plugin_dir_path( __FILE__ ) );
define( 'INFLURL', plugin_dir_Url( __FILE__ ) );
define( 'INFL_TEXTDOMAIN', 'infinite-load' );

require_once INFLPATH . 'vendor/autoload.php';

function load() {
    add_action(
        'plugins_loaded',
        static function () {
            new \InfiniteLoad\RestApi\RestApi;
            new \InfiniteLoad\Engine\Enqueue;
            new \InfiniteLoad\Engine\QueryFilter;
        }
    );
}

load();