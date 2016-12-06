<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Posts extends REST_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->model('posts_model');
    }
    public function index_put(){
        $posts = $this->put('posts');
        $uid = $this->uid();
        if(empty($posts)) throw new Exception('Posts parameter empty.');

        global $wait_flush;
        $wait_flush = true;

        q('BEGIN');
        $return_data = $this->posts_model->update($posts,$uid);

        q('COMMIT');
        $this->response($return_data,$return_data ? 200 : 204);
    }
    public function index_post(){
        $text = $this->post('text');
        $uid = $this->uid();

        global $wait_flush;
        $wait_flush = true;

        q('BEGIN');
        $return_data = $this->posts_model->create([
            'text' => $text,
            'filtered_text' => $text,
            'uid' => $uid
        ]);


        q('COMMIT');
        $this->response($return_data,200);
    }
    public function twitter_import_post(){
        $uid = $this->uid();
        if(empty($_FILES['files'])) throw new Exception('Files is empty');

        q('BEGIN');
        $return_data = $this->posts_model->twitter_import($uid);

        q('COMMIT');
        $this->response($return_data,$return_data ? 200 : 204);
    }
    public function images_import_post(){
        $uid = $this->uid();
        $texts = $this->post('texts') ? : '';
        if(empty($_FILES['files'])) throw new Exception('Files is empty');

        q('BEGIN');
        $return_data = $this->posts_model->images_import($uid,$texts);

        q('COMMIT');
        $this->response($return_data,$return_data ? 200 : 204);
    }
}

