<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Algolia_manage extends CI_Controller {
    var $client;
    var $all = false;
    public function __construct(){
        parent::__construct();
        require_once __DIR__ . '/../resources/Algolia/algoliasearch.php';
        $this->load->library('algolia');
        $this->client = $this->algolia->client;
    }
    public function refresh(){
        require_once __DIR__ . '/../resources/Algolia/algoliasearch.php';
        $client = null;
        $index_resources = array('posts');
        $table_names = array(
            'posts' => 'posts'
        );
        $model_names = array(
            'posts' => 'posts'
        );
        $settings = array(
            'posts' => array(
                'attributesToIndex' => array('text','file','uid','date_created'),
                'customRanking' => array('desc(date_created)')
            )
        );

        $this->load->library('algolia');
        $client = $this->algolia->client;
        foreach($index_resources as $index_resource){
            $index_name = $index_resource . (ENVIRONMENT == 'development' ? '_test' : '');
            $model_name = ($model_names[$index_resource] ?: $index_resource) . '_model';
            $table_name = $table_names[$index_resource] ?: $index_resource;
            $index = $client->initIndex($index_name);
            $index->setSettings($settings[$index_resource]);

            //Delete index
            $index->clearIndex();

            //Index
            $this->load->model($model_name);
            $limit = 1000;
            $total_count  = 0;
            $count = $this->db->query('select count(*) as count from ' . $table_name)->row_array();
            $count = ceil($count['count']/$limit);
            for($i = 0;$i < $count;$i++){
                $sql = $this->db->from($table_name)->limit($limit,$i*$limit)->get_compiled_select();
                $datas = q($sql);
                $total_count += count($datas);
                $this->{$model_name}->index($datas);
            }
            $this->queue->flush();
        }

        echo json_encode(array('message' => 'Refresh complete.'));
    }
}

