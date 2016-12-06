<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends REST_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->model('admin_model', '', TRUE);
        $this->_check_is_admin();
    }
    private function _check_is_admin(){
        $user = lookup_user($this->uid());
        if($user['type'] != '1'){
            throw new Exception('You are not an admin user.');
        }
    }
}

