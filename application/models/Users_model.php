<?php

class Users_model extends CI_Model {

    function load($uid){
        $user = lookup_user($uid);
        if(!$user) throw new Exception('Error retrieving account info.');

        $return_data = array(
            'id' => $user['uid'],
            'type' => $user['type'],
            'username' => $user['username'],
            'date_start' => $user['date_start'],
            'profile_picture_url' => get_gravatar($user['username'],80,'identicon'),
            'subscription_type' => $user['subscription_type']
        );


        return array_merge(array(
            'users' => array($return_data),
        ));
    }

    function update($new_datas,$uid){
        $updated_datas = $index_datas = array();
        $user = null;

        //Multidimensional
        $new_datas = multi_array($new_datas);

        foreach($new_datas as $new_data){
            //Lookup updating user
            $current_data = lookup_user($uid);

            $keys = array_keys($new_data);
            $update_data = array();
            $check_keys = array('username','password','poster','subscription_type','subscription_source');
            $accept_empty_keys = array();
            if(!empty($keys)){
                foreach($keys as $key){
                    //Is update key
                    //Value has changed
                    //Value can be set to blank
                    if(!can_update($key,$current_data,$new_data,$check_keys,$accept_empty_keys)) continue;
                    switch($key){
                        case 'subscription_source':
                            \Stripe\Stripe::setApiKey(STRIPE_SK);
                            $customer = \Stripe\Customer::retrieve($current_data['stripe_customer_id']);
                            $customer->source = $new_data[$key]['id'];
                            $customer->save();
                            break;
                        case 'subscription_type':
                            \Stripe\Stripe::setApiKey(STRIPE_SK);
                            $customer = null;
                            if(empty($current_data['stripe_customer_id'])){
                                $customer = \Stripe\Customer::create(
                                    array(
                                        "source" => $new_data['subscription_token']['id'],
                                        "plan" => $new_data[$key],
                                        "email" => $user['username']
                                    )
                                );
                                $update_data['stripe_customer_id'] = $customer->id;
                            }else{
                                $customer = \Stripe\Customer::retrieve($current_data['stripe_customer_id']);
                                $subscription = \Stripe\Subscription::retrieve($customer->subscriptions->data[0]->id);
                                $subscription->plan = $new_data[$key];
                                $subscription->save();
                            }

                            $update_data['subscription_type'] = $new_data[$key];
                            break;
                        case 'username':
                            $response = $this->_check_username($new_data[$key]);
                            $update_data = array_merge($update_data,$response);
                            break;
                        case 'password':
                            $response = $this->_check_password($new_data[$key],$user);
                            $update_data = array_merge($update_data,$response);
                            break;
                    }
                }
            }else{
                throw new Exception('Nothing to update');
            }

            $updated_data = array_merge($current_data,$update_data);

            //Update
            if(!empty($update_data)){
                if(!$this->db->update('users', $update_data, array('uid' => $current_data['id']))) throw new Exception('Update user failed.');
            }

            $updated_datas[] = $updated_data;
        }

        //Format for response
        return $this->load($uid);
    }
    private function _check_password($password_hash,$user){
        require_once __DIR__ . '/../resources/password/password.php';

        if($user && password_verify($password_hash['old'], $user['password'])){
            return array('password' => password_hash($password_hash['new'], PASSWORD_DEFAULT));
        }else{
            throw new Exception('Old password invalid');
        }
    }
    private function _check_username($username){
        valid_username($username);
        return array(
            'username' => $username,
        );
    }
}
