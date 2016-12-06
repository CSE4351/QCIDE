<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Search extends REST_Controller {
    public function index_get(){
        $uid = $this->uid();
        $this->load->library('algolia');
        $return_data = $this->algolia->search($uid, $this->get('args'));
        $this->response($return_data,200);
    }
}

