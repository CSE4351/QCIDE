<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Events extends REST_Controller {
    public function stripe_post(){
        if(isset($GLOBALS['HTTP_RAW_POST_DATA'])){
            $data = json_decode($GLOBALS['HTTP_RAW_POST_DATA']);
            $type = $data->type;
        }else if(isset($_POST['value'])){
            $data = json_decode($_POST['value']);
            $type = $data->type;
        }else{
            throw new Exception('Invalid request.');
        }
        $valid_events = array('invoice.payment_failed');
        if(in_array($type,$valid_events)){
            q('BEGIN');
            if($type == 'invoice.payment_failed'){
                $this->load->model('events_model');
                $this->events_model->stripe_failed_invoice($data);
            }
            q('COMMIT');
        }
        $this->response(null,204);
    }
}

