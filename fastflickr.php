<?php 
/*
Plugin Name: Fast Flickr
Version: 1.0
Plugin URI: http://www.leonardofaria.net/2006/06/24/fast-flickr/
Description: Plugin that shows Flickr sets in a lightbox window Usage: [fastflickr set=SET NUMBER]
Author: Leonardo Faria
Author URI: http://www.leonardofaria.net
*/

function enqueue_fastflickr_scripts() {
	$path = trailingslashit(get_bloginfo('wpurl') ) . PLUGINDIR . '/' . dirname(plugin_basename(__FILE__));

	wp_enqueue_script('jquery');
	wp_enqueue_script('fastflickr.js', $path . '/fastflickr.js');
}

function enqueue_fastflickr_style(){
	$path = trailingslashit(get_bloginfo('wpurl') ) . PLUGINDIR . '/' . dirname(plugin_basename(__FILE__));
	
	wp_enqueue_style('fastflickr.css', $path . '/fastflickr.css');
}

function fastflickr_func($atts) { 
	extract(shortcode_atts(array('set' => ''), $atts));
	
	$output = '';
	$api_key = "9733c18f778cd8f26c05487b64db2568";
	$url = "http://api.flickr.com/services/rest/?api_key={$api_key}&photoset_id={$set}&method=flickr.photosets.getPhotos";
	$xml = simplexml_load_file($url);

	$owner = $xml->photoset['owner'];

	foreach ($xml->photoset->photo as $photo) {
		$title = $photo['title'];
		$farmid = $photo['farm'];
		$serverid = $photo['server'];
		$title = $photo['title'];
		$id = $photo['id'];
		$secret = $photo['secret'];
		// url referency: http://www.flickr.com/services/api/misc.urls.html
		$thumb_url = "http://farm{$farmid}.staticflickr.com/{$serverid}/{$id}_{$secret}_s.jpg";
		$full_url =  "http://farm{$farmid}.staticflickr.com/{$serverid}/{$id}_{$secret}_z.jpg";
		$page_url = "http://www.flickr.com/photos/{$owner}/{$id}";
		$output .= "<a href='{$full_url}' rel='gallery' title='{$title}' class='lightbox'><img alt='{$title}' src='{$thumb_url}'/></a> ";
	}

	echo $output;
}

add_action('wp_print_scripts', 'enqueue_fastflickr_scripts');
add_action('wp_print_styles', 'enqueue_fastflickr_style');
add_shortcode('fastflickr', 'fastflickr_func');
?>