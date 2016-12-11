<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Cron extends REST_Controller  {

    public function test_get(){
        $file_name = 'circ7';

        $qasm_folder = '/var/www/html/application/resources/QASMConversion/';
        chdir($qasm_folder);
        $command = 'csh qasm2png ' . $file_name . '.qasm';

        //Convert
        exec($command, $output);

        //Return PNG
        $fp = fopen($file_name . '.png', 'rb');

        header("Content-Type: image/png");
        header("Content-Length: " . filesize($file_name . '.png'));

        fpassthru($fp);

        //Remove created files
        $extensions = array('aux','dvi','eps','idx','log','tex','png');
        foreach($extensions as $extension){
            unlink($file_name . '.' . $extension);
        }
    }
    public function update_queue_get(){
        $this->ironmq->update_queue();
    }
}



