<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Queues extends REST_Controller {

    public function __construct(){
        parent::__construct();
        $this->load->model('queues_model');
    }
}

