<?php

class Events_model extends CI_Model {
    function stripe_failed_invoice($data){
        $customer_id = $data->data->object->customer;

        $sql = $this->db->from('users')->where(array('stripe_customer_id' => $customer_id))->get_compiled_select();
        $user = q([
            'sql' => $sql,
            'flat' => true
        ]);
        if(empty($user)) return;

        \Stripe\Stripe::setApiKey(STRIPE_SK);
        $customer = \Stripe\Customer::retrieve($user['stripe_customer_id']);
        $subscription = $customer->subscriptions->retrieve($customer->subscriptions->data[0]->id);
        $subscription->plan = 'free';
        $subscription->save();
        update_user(array(
            'subscription_type' => 'free'
        ),$user['uid']);
    }

}
