<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Convert extends REST_Controller  {

    public function index_post(){
        $image = null;
        $file_name = $this->post('file_name');
        if(empty($file_name)) throw new Exception('A filename is required.');

        $qasm = $this->post('qasm');
        if(empty($qasm)) throw new Exception('QASM is required.');

        $qasm = str_replace('include "qelib1.inc";','',$qasm);

        $qasm = 'include "qelib1.inc";' . $qasm;

        $qasm_folder = '/var/www/html/application/resources/Python/';
        chdir($qasm_folder);
        file_put_contents($file_name . '.qasm',$qasm);
        $command = 'python qasm_to_png.py';

        //Convert
        exec($command, $output, $return_var);
        $response = json_decode($output[0], true);

        if(!empty($response['error'])){
            throw new Exception($response['error']['message']);
        }else{
            //Return PNG
            $counter = 0;
            while($counter++ < 5){
                $image = file_get_contents($response['url']);
                if($image) break;
                sleep(3);
            }
            $this->response(array('converted' => 'data:image/png;base64,' . base64_encode(file_get_contents($response['url']))));
        }
    }
}



