<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Convert extends REST_Controller  {

    public function index_post(){
        $valid_convert = false;
        $image = null;
        $file_name = $this->post('file_name');
        if(empty($file_name)) throw new Exception('A filename is required.');

        $qasm = $this->post('qasm');
        if(empty($qasm)) throw new Exception('QASM is required.');

        $qasm_folder = '/var/www/html/application/resources/QASMConversion/';
        chdir($qasm_folder);
        file_put_contents($file_name . '.qasm',$qasm);
        $command = 'csh qasm2png ' . $file_name . '.qasm';

        //Convert
        exec($command, $output, $return_var);
        if(file_exists($file_name . '.dvi')){
            $valid_convert = true;
            $image = file_get_contents($file_name . '.png');
        }

        //Remove created files
        $extensions = array('aux','dvi','eps','idx','log','tex','png','qasm');
        foreach($extensions as $extension){
            if(file_exists($file_name . '.' . $extension)){
                unlink($file_name . '.' . $extension);
            }
        }

        //Return PNG
        if($valid_convert){
            $this->response(array('converted' => 'data:image/png;base64,' . base64_encode($image)));
        }else{
            throw new Exception('Invalid QASM syntax.');
        }
    }
}



