<?php
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use PhpAmqpLib\Wire\AMQPTable;

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Cron extends REST_Controller  {

    public function test_get(){
        echo 'test cron';
    }
    public function update_queue_get(){
        $this->ironmq->update_queue();
    }
}



