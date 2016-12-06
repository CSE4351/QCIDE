<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Queue {
    var $ci = null;
    var $notifications = array();
    var $functions = array();
    var $force_functions = array();
    var $index = array();
    var $unindex = array();

    var $queues = array('notifications','functions','index','unindex');
    function __construct(){
        $this->ci =& get_instance();
    }

    function notification($type,$params,$users,$subjects = array()){
        if(empty($this->notifications)) $this->notifications = array(
            '0' => array(),
            '1' => array(),
            '2' => array(),
            '3' => array(),
        );
        //Format types & private message templates
        if(!empty($params[0]) && is_array($params[0])){
            $notification_count = count($users);
            for($i = 0;$i < $notification_count;$i++){
                $this->notifications[0][] = $type;
                $this->notifications[1][] = $params[$i];
                $this->notifications[2][] = $users[$i];
                $this->notifications[3][] = !empty($subjects[$i]) ? $subjects[$i] : null;
            }
        }else{
            $this->notifications[0][] = $type;
            $this->notifications[1][] = $params;
            $this->notifications[2][] = $users;
            $this->notifications[3][] = $subjects;
        }

    }
    function index($items,$index = null){
        if($index == null) throw new Exception('A index type is required.');
        $this->index[] = array(
            'items' => $items,
            'index' => $index
        );
    }
    function unindex($items,$index = null){
        if($index == null) throw new Exception('A index type is required.');
        $this->unindex[] = array(
            'items' => $items,
            'index' => $index
        );
    }
    function fn($method,$params,$class = null){
        if(empty($this->functions)) $this->functions = array(
            'method' => array(),
            'params' => array(),
            'class' => array()
        );
        $this->functions['method'][] = $method;
        $this->functions['params'][] = $params;
        $this->functions['class'][] = $class;
    }
    function force_fn($method,$params,$class = null,$run_normally = false){
        if(empty($this->force_functions)) $this->force_functions = array(
            'method' => array(),
            'params' => array(),
            'class' => array()
        );
        $this->force_functions['method'][] = $method;
        $this->force_functions['params'][] = $params;
        $this->force_functions['class'][] = $class;

        if($run_normally){
            if(!empty($class)){
                call_user_func_array(array($class,$method), $params);
            }else{
                call_user_func_array($method, $params);
            }
        }
    }
    function flush(){
        //Email notifications
        if(!empty($this->notifications)){
            $this->ci->load->library('notifications');
            call_user_func_array(array($this->ci->notifications,'send'), $this->notifications);
            $this->notifications = array();
        }

        //Algolia indexing
        if(!empty($this->index) || !empty($this->unindex)){
            require_once __DIR__ . '/../resources/Algolia/algoliasearch.php';
            $client = new \AlgoliaSearch\Client(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
            $this->ci->load->library('algolia');

            //Index
            foreach($this->index as $hash){
                $index = $client->initIndex($hash['index'] . (ENVIRONMENT == 'development' ? '_test' : ''));
                $this->ci->algolia->partialUpdateObjects($index,$hash['items']);
            }

            //Unindex
            foreach($this->unindex as $hash){
                $index = $client->initIndex($hash['index'] . (ENVIRONMENT == 'development' ? '_test' : ''));
                $this->ci->algolia->deleteObjects($index,$hash['items']);
            }

            global $wait_flush;
            if($wait_flush === true && (!empty($this->index) || !empty($this->unindex))){
                $this->ci->algolia->wait();
            }
            $this->index = array();
            $this->unindex = array();
        }

        //Run certain methods
        if(!empty($this->functions)){
            for($i = 0,$count = count($this->functions['method']);$i < $count;$i++){
                if(!empty($this->functions['class'][$i])){
                    call_user_func_array(array($this->functions['class'][$i],$this->functions['method'][$i]), $this->functions['params'][$i]);
                }else{
                    call_user_func_array($this->functions['method'][$i], $this->functions['params'][$i]);
                }
            }
            $this->functions = array();
        }
    }
    function force_flush($message){
        //Clear all on success queues
        foreach($this->queues as $queue){
            $this->{$queue} = array();
        }

        //Run certain methods that need to be called no matter what
        if(!empty($this->force_functions)){
            for($i = 0,$count = count($this->force_functions['method']);$i < $count;$i++){
                if(!empty($this->force_functions['class'][$i])){
                    call_user_func_array(array($this->force_functions['class'][$i],$this->force_functions['method'][$i]), $this->force_functions['params'][$i]);
                }else{
                    call_user_func_array($this->force_functions['method'][$i], $this->force_functions['params'][$i]);
                }
            }
            $this->force_functions = array();
        }

        //Flush anything created from the forced functions
        $this->flush();
    }
}