<?php
//require_once __DIR__ . '/../vendor/autoload.php';
require_once '/composer/vendor/autoload.php';

class MY_Router extends CI_Router {
    function _set_routing(){
        //Accept options requests
        if(!empty($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
            header('HTTP/1.1: ' . 204);
            header('Status: ' . 204);
            exit;
        }

        //Proxy to Ember frontend - TODO
        if(ENVIRONMENT == 'production' && strpos(BASE_URLS,$_SERVER['HTTP_HOST']) !== false){
            $index_page = file_get_contents(STATIC_URL . 'index.html');
            echo $index_page;
            exit;
        }

        parent::_set_routing();

    }
}