<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Algolia extends Library{
    var $client;
    var $posts = null;
    var $tasks = array();
    function __construct(){
        parent::__construct();
        require_once __DIR__ . '/../resources/Algolia/algoliasearch.php';
        $this->client = new \AlgoliaSearch\Client(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    }
    var $index_map = array(
    );
    function index($index){
        return !empty($this->index_map[$index]) ? $this->index_map[$index] : $index;
    }
    function reverse_index($index){
        foreach($this->index_map as $key => $value){
            if($index == $value) return $key;
        }
        return $index;
    }
    function partialUpdateObjects($index, $objects){
        $response = $index->partialUpdateObjects($objects);
        if(!empty($response['taskID'])){
            $this->tasks[] = array(
                'id' => $response['taskID'],
                'index' => $index
            );
        }
    }
    function deleteObjects($index, $objects){
        $response = $index->deleteObjects($objects);
        if(!empty($response['taskID'])){
            $this->tasks[] = array(
                'id' => $response['taskID'],
                'index' => $index
            );
        }
    }
    function wait(){
        foreach($this->tasks as $task){
            $task['index']->waitTask($task['id']);
        }
    }
    function search($uid,$args){
        $requests = array();
        $user = lookup_user($uid);

        if(empty($args[0])){
            throw new Exception('Invalid args format.');
        }
        foreach($args as $arg){
            $params = http_build_query($this->_get_params($uid,$arg,$user));
            $requests[] = array(
                'indexName' => $arg['index'],
                'params' => $params
            );
        }
        $response = $this->client->searchMulti(array(
            'requests' => $requests
        ));
        $return_data = array();

        foreach($response['results'] as $result){
            if(empty($return_data[$result['index']])){
                $return_data[$result['index']] = array(
                    'data' => array(),
                    'meta' => array(
                        'total' => $result['nbHits'],
                        'count' => $result['hitsPerPage'],
                        'page' => $result['page']
                    )
                );

            }
            foreach($result['hits'] as $hit){
                $return_data[$result['index']]['data'][] = $hit;
            }
        }
        return $return_data;
    }
    private function _get_params($uid,$arg,$user){
        $optional_params = array('tagFilters','facetFilters','numericFilters','attributesToRetrieve');

        //Index key required
        if(!array_key_exists('index',$arg)) throw new Exception('Index key is required.');

        //Cap max hits
        if(!empty($arg['count']) && $arg['count'] > 100) $arg['count'] = 100;

        //Search settings
        $params = array(
            'query' => array(!empty($arg['q']) ? $arg['q'] : ''),
            'page' => (!empty($arg['page']) ? intval($arg['page']) : 0),
            'facetFilters' => array(),
            'facets' => array(),
            'numericFilters' => array(),
            'tagFilters' => array(),
            'hitsPerPage' => (!empty($arg['count']) ? intval($arg['count']) : 10),
            'attributesToHighlight' => ''
        );
        $ids = array();
        switch($arg['index']){
            //Keyword and category search done by Algolia
            case ALGOLIA_POSTS_INDEX:
                $ids[] = 'uid=' . $uid;
                break;
            default:
                throw new Exception('Invalid index ' . $arg['index'] . '.');
        }
        $params['numericFilters'][] = '(' . implode(',',$ids) . ')';
        foreach($optional_params as $param){
            if(!empty($params[$param])) $params[$param] = implode(',',$params[$param]);
            else unset($params[$param]);
        }
        $params['query'] = implode(' ',$params['query']);
        if(!empty($params['facets'])) $params['facets'] = implode(',',array_unique($params['facets']));
        return $params;
    }
}