<?php

class Status_model extends CI_Model {
    var $limits  = array();
    var $messages = array(
        BASE_NAME => [
            'register' => BASE_NAME . ' registration is closed while we are testing.'
        ]
    );
    private function _parse_hash($hash){
        //object
        //action
        //uid
        $hash = default_array($hash, array(
            array(
                'keys' => array('uid','action','throw_exception','object'),
                'value' => null
            ),
            array(
                'keys' => array('throw_exception'),
                'value' => true
            )
        ));
        return $hash;
    }
    function check($hash){
        $hash = $this->_parse_hash($hash);

        //Checks online status then limits
        return $this->_online_check($hash);
    }
    private function _online_check($hash){
        $sql = $this->db->from('globals')->get_compiled_select();
        $rows = q($sql);
        if(!$rows) throw new Exception('Error looking up online status.');

        foreach($rows as $row){
            //Matches main category or specific sub category
            if(($row['object'] == $hash['object'] && $row['action'] == null) || ($row['object'] == $hash['object'] && $row['action'] == $hash['action'])){
                if(!$row['active']){
                    if($row['message'] != null){
                        $custom_message = ' ' . $row['message'];
                    }else{
                        $custom_message = '';
                    }
                    if(!empty($this->messages[$row['object']]) && gettype($this->messages[$row['object']]) == 'string'){
                        $message = $this->messages[$row['object']];
                    }else if(!empty($this->messages[$row['object']][$row['action']])){
                        $message = $this->messages[$row['object']][$row['action']];
                    }else{
                        if($row['action'] == null){
                            $message = $row['object'] . ' is disabled at the moment.';
                        }else{
                            $message = $row['object'] . ' ' . $row['action'] . '\'s are disabled at the moment.';
                        }
                    }
                    $message .= $custom_message;

                    throw new Exception($message);

                }
            }
        }
        return true;

    }
}
