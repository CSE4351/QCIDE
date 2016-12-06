<?php

require_once __DIR__ . '/../resources/twitteroauth/autoload.php';
use \Abraham\TwitterOAuth\TwitterOAuth;
use \InstagramAPI\Instagram;

class Ironmq{
    var $client;
    private $_queue_version = null;
    var $ci = null;
    public function __construct(){
        $this->client = new \IronMQ\IronMQ(array(
            "token" => IRONMQ_TOKEN,
            "project_id" => IRONMQ_PROJECT_ID,
            'protocol'    => 'https',
            'host'        => IRONMQ_HOST,
            'port'        => '443',
            'api_version' => '3'
        ));
        $this->ci =& get_instance();
    }
    public function update_queue(){
        $new_queue_version = $this->_get_queue_version() + 1;
        $queues = json_decode(constant('IRONMQ_QUEUES'));
        foreach($queues as $queue_name){
            $old_queue_name = $this->_get_full_queue_name($queue_name);
            try{
                $this->client->getQueue($old_queue_name);
                $this->client->deleteQueue($old_queue_name);
            }catch(Exception $e){
                $test = 2;
            }
            try{
                $new_queue_name = $queue_name . $new_queue_version;
                $params = array(
                    'type' => 'unicast',
                    'message_timeout' => IRONMQ_QUEUE_TIMEOUT,
                    'message_expiration' => IRONMQ_QUEUE_MESSAGE_EXPIRATION,
                    'push' => array(
                        'retries' => IRONMQ_QUEUE_RETRIES,
                        'retries_delay' => ENVIRONMENT == 'production' ? IRONMQ_QUEUE_RETRIES_DELAY : IRONMQ_QUEUE_RETRIES_DELAY,
                        'subscribers' => array(
                            array(
                                'url' => IRONMQ_CALLBACK_URL . 'queues/' . $queue_name . '?s=' . IRONMQ_QUEUE_SECRET,
                                'name' => "Website Queue Endpoint - " . $new_queue_name,
                                'headers' => array(
                                    'Content-Type' => 'application/json'
                                )
                            ),
                        ),
                    )
                );
                $res = $this->client->createQueue($new_queue_name,$params);
            }catch(Exception $e){
                $test = 2;
            }
        }
        $this->ci->db->update('globals',array('action' => $new_queue_version),array('object' => 'Ironmq'));
        $this->ci->response(['message' => 'Queue\'s updated.'],200);
    }
    public function lookup_queue_message(){

        $queue_message_id =  $this->ci->post('id');
        $queue_version =  floatval($this->ci->post('version'));

        $queue_message = $this->lookup_queue_message_db($queue_message_id,false);

        //Security
        $secret = $this->ci->get('s');
        if($secret != IRONMQ_QUEUE_SECRET) throw new Exception('Invalid queue request.');

        //Queue message has already processed or is an old queue message version
        if($queue_message['status'] != 'Pending' || floatval($queue_message['version']) > $queue_version){
            $this->ci->response(null,200);
        }

        if(empty($queue_message['message_id'])) throw new Exception('Message ID is empty in the queue message.');

        return $queue_message;
    }
    function lookup_queue_message_db($queue_message_id,$throw_error = true){
        $sql = $this->ci->db->from('queue_messages')->where(array('id' => $queue_message_id))->get_compiled_select();
        $queue_message = q(array(
            'sql' => $sql,
            'flat' => true
        ));
        if(!$queue_message){
            throw new Exception('Could not find queue message ID.');
        }

        if($throw_error && $queue_message['status'] != 'Pending') throw new Exception('Queue message has already been processed.');

        $queue_message['message'] = json_decode($queue_message['message'],true);
        $queue_message['errors'] = json_decode($queue_message['errors'],true);
        return $queue_message;
    }
    function completed_queue_message($queue_name, $queue_id, $status = null){
        $queue_item = $this->lookup_queue_message_db($queue_id, false);

        if($queue_item['status'] == 'Pending'){
            try{
                $response = $this->client->deletePushMessage($this->_get_full_queue_name($queue_name), $queue_item['message_id'], $this->ci->head('iron-reservation-id'), $this->ci->head('iron-subscriber-name'));
            }catch(Exception $e){
                $error = true;
            }
        }else{
            return;
        }

        //Make sure this runs even in the case of an exception
        $this->ci->queue->force_fn(
            'update',
            array(
                'queue_messages',
                array('status' => $status ?: 'Completed'),
                array('id' => $queue_item['id'])
            ),
            $this->ci->db,
            true
        );
    }
    public function handle_retries($queue_item, $errors){
        $set_data = array('retries' => $queue_item['retries'] - 1);
        $has_retries = true;

        //No more retries left
        if($set_data['retries'] == 0){
            $has_retries = false;
        }

        $set_data['errors'] = json_encode($errors);

        $this->ci->queue->force_fn(
            'update',
            array(
                'queue_messages',
                $set_data,
                array('id' => $queue_item['id'])

            ),
            $this->ci->db
        );

        return $has_retries;
    }
    function queue_message($queue,$message,$options = array(),$new_version_id = null){

        if(!empty($new_version_id)){
            $queue_message = $this->lookup_queue_message_db($new_version_id, false);
            $version = $queue_message['version'] + 1;
            $this->ci->db->update('queue_messages', array('version' => $version, 'retries' => IRONMQ_QUEUE_RETRIES, 'status' => 'Pending'),array('id' => $queue_message['id']));
            $id = $new_version_id;
            $data = $this->lookup_queue_message_db($id);
        }else{
            $version = 0;
            $data = array(
                'queue' => $queue,
                'message' => json_encode($message),
                'status' => 'Pending',
                'errors' => json_encode([]),
                'retries' => IRONMQ_QUEUE_RETRIES,
                'version' => $version,
                'date_created' => date('Y-m-d H:i:s')
            );
            if(!$this->ci->db->insert('queue_messages',$data)) throw new Exception('Could not add import queue message.');
            $data['id'] = $this->ci->db->insert_id();
            $data['message'] = json_decode($data['message'],true);
        }


        $this->ci->queue->fn(
            'post_queue_message',
            array(
                $queue,
                $data['id'],
                $version,
                $options
            ),
            $this
        );


        return $data;
    }
    function post_queue_message($queue,$id,$version,$options = array()){
        $response = $this->client->postMessage(
            $this->_get_full_queue_name($queue),
            json_encode(
                array(
                    'id' => $id,
                    'version' => $version
                )
            ),
            array_merge(
                array(
                    'timeout' => ENVIRONMENT == 'production' ? IRONMQ_QUEUE_TIMEOUT : IRONMQ_QUEUE_TIMEOUT
                ),
                $options
            )
        );
        $this->ci->db->update('queue_messages',array('message_id' => $response->id),array('id' => $id));

        return $id;
    }
    private function _get_full_queue_name($queue){
        return $queue . $this->_get_queue_version();
    }
    private function _get_queue_version(){
        if(empty($this->_queue_version)){
            $sql = $this->ci->db->from('globals')->where('object','Ironmq')->get_compiled_select();
            $row = q(array(
                'sql' => $sql,
                'flat' => true
            ));
            $this->_queue_version = floatval($row['action']);
        }
        return $this->_queue_version;
    }
    public function get_recent_post($user, $throw_error = true){
        $sql = $this->ci->db->from('posts')->where(['uid' => $user['uid'], 'active' => 1,'posted' => 0])->limit(1)->order_by('date_created','desc')->get_compiled_select();

        $post = q(array(
            'sql' => $sql,
            'flat' => true
        ));

        if($throw_error && empty($post)){
            throw new Exception('You have to have at least 1 non-posted post before you can start the poster.');
        }

        if(!empty($post)){
            $post['posted_accounts'] = json_decode($post['posted_accounts'],true);
        }

        return $post;
    }
    public function has_account($provider, $uid){
        $this->ci->load->model('accounts_model');

        $accounts = $this->ci->accounts_model->load($uid,false);

        if(empty($accounts)) return false;

        foreach($accounts as $account){
            if(strtolower($account['provider']) == strtolower($provider)){
                return $account;
            }
        }
        return false;
    }
    public function do_post($uid){
        //Lookup user
        $user = lookup_user($uid);

        //Lookup accounts
        $sql = $this->ci->db->from('accounts')->where_in('id',$user['poster']['accounts'])->get_compiled_select();

        $accounts = q(array(
            'sql' => $sql
        ));
        if(empty($accounts)) throw new Exception('No accounts to use for posting.');

        //Lookup most recent post
        $post = $this->get_recent_post($user);

        //Post to social medias
        $instagram = null;
        $instagram_account_counter = 0;
        $success_account_ids = parse_ids($post['posted_accounts']);
        $posted_accounts = $post['posted_accounts'];
        $errors = [];
        foreach($accounts as $account){
            try{
                $post_posted = false;
                //Check if this account has already been posted
                if (in_array($account['id'], $success_account_ids)){
                    continue;
                }
                switch($account['provider']){
                    case 'Instagram':
                        //Only post posts that have an images
                        if(!MOCK_POST){
                            if(!empty($post['file_url'])){
                                if($instagram_account_counter == 0){
                                    $instagram = new Instagram($account['token'], $account['token_secret']);
                                    $instagram->login();
                                }else{
                                    $instagram->setUser($account['token'], $account['token_secret']);
                                }
                                $instagram->uploadPhoto($post['file_url'], $post['filtered_text']);

                            }
                        }
                        $instagram_account_counter++;
                        $post_posted = true;
                        break;
                    case 'Twitter':
                        if(!MOCK_POST){
                            $connection = new TwitterOAuth(TWITTER_CONSUMER_KEY, TWITTER_SECRET_KEY, $account['token'], $account['token_secret']);
                            $parameters = [
                                'status' => $post['text'],
                            ];
                            if(!empty($post['file_url']) && $post['use_own_images']){
                                $media = $connection->upload('media/upload', ['media' => $post['file_url']]);
                                if($connection->getLastHttpCode() != 200) {
                                    throw new Exception('There was a problem uploading the media.');
                                }
                                $parameters['media_ids'] = implode(',', [$media->media_id_string]);
                            }
                            $result = $connection->post('statuses/update', $parameters);
                            if($connection->getLastHttpCode() != 200) {
                                $body = $connection->getLastBody();
                                if(!empty($body->errors[0]->message)){
                                    throw new Exception($body->errors[0]->message);
                                }else{
                                    throw new Exception('There was a problem Tweeting.');
                                }
                            }
                        }
                        $post_posted = true;
                        break;
                }
                if($post_posted){
                    $posted_accounts[] = [
                        'id' => $account['id'],
                        'name' => $account['name'],
                        'provider' => $account['provider'],
                    ];
                }
                $success_account_ids[] = $account['id'];
            }catch(Exception $e){
                $errors[] = $account['provider'] . ' account `' . $account['name'] . '` error: ' . $e->getMessage();
            }
        }

        //Check if posted to all accounts
        $posted_to_all_accounts = intval(count($accounts) == count($success_account_ids));

        //Update post forcefully
        $this->ci->load->model('posts_model');
        $this->ci->queue->force_fn(
            'update',
            array(
                ['id' => $post['id'],'posted' => $posted_to_all_accounts, 'posted_accounts' => $posted_accounts],
                $user['id']
            ),
            $this->ci->posts_model,
            true
        );

        //Next post or finished
        if($posted_to_all_accounts){
            //All accounts posted successfully

            //Queue message complete
            $this->completed_queue_message(IRONMQ_POSTER_QUEUE,$user['poster_queue_id'], 'Completed');

            //Update poster if no posts left
            $next_post = $this->get_recent_post($user, false);
            if(empty($next_post)){
                $this->ci->load->model('users_model');
                $user['poster']['running'] = false;
                $this->ci->users_model->update(['poster' => $user['poster']],$user['id']);
            }else{
                //Queue next post
                $this->update_poster($user['poster'],$user['poster'],$user);
            }
        }else{
            //Not all accounts posted successfully

            throw new Data_error($errors);
        }

    }
    public function update_poster($current_poster, $new_poster, $current_user){
        if($new_poster['running']){
            //Start running poster

            //Create queue item
            $delay = $this->_find_poster_delay($new_poster, $current_poster);
//            $date = date('M d Y, h:i:s A',time() + $delay);
//            $date2 = date('M d Y, h:i:s A');
            $queue_item = $this->queue_message(
                IRONMQ_POSTER_QUEUE,
                array(
                    'uid' => $current_user['id'],
                    'delay' => $delay
                ),
                array(
                    'delay' => ENVIRONMENT == 'development' ? $delay : $delay
                )
            );

            //Cancel current queue message if pending
            if(!empty($current_user['poster_queue_id'])){
                $this->completed_queue_message(IRONMQ_POSTER_QUEUE,$current_user['poster_queue_id'], 'Cancelled');
            }

            //Update user poster id
            update_user(['poster_queue_id' => $queue_item['id']],$current_user['id']);
        }else if($current_poster['running'] && !$new_poster['running']){
            //Stop running poster

            $queue_message = $this->lookup_queue_message_db($current_user['poster_queue_id'], false);

            //Cancel or fail queue message
            $this->completed_queue_message(IRONMQ_POSTER_QUEUE,$current_user['poster_queue_id'], $queue_message['retries'] == 0 ? 'Failed' : 'Cancelled');
        }
    }
    private function _find_poster_delay($poster, $old_poster){
        $posts_per_hour = $hour_count = null;
        $current_day = intval(date('w'));
        $current_hour = intval(date('G'));
        $lookup_day = $lookup_hour = $found_lookup_day = $found_lookup_hour = $found_schedule = $found_next_schedule = null;
        $hour_counts = [
            0 => 0,
            1 => 0,
            2 => 0,
            3 => 0,
            4 => 0,
            5 => 0,
            6 => 0,
        ];
        $day_map = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        function get_closest_second($seconds_from_hour, $arr) {
            $closest = null;
            $return = null;
            foreach ($arr as $index => $item) {
                if($seconds_from_hour < $item){
                    $return = $item;
                    break;
                }
            }
            if($return == null) return null;
            return floatval($return);
        }
        function delay_by_hour($per_hour) {
            $current_minute = date('i');
            $current_seconds = date('s');
            $seconds_from_hour = $current_minute * 60 + $current_seconds;

            $per_second = 3600 / $per_hour;
            $second_counter = 0;
            $second_times = [];
            while($second_counter < 3600){
                $second_times[] = $second_counter;
                $second_counter += $per_second;
            }
            $next_seconds = get_closest_second($seconds_from_hour, $second_times);

            if($next_seconds == null) return null;


            $delay_time = $next_seconds - $current_minute * 60 - $current_seconds;

            return $delay_time;
        }

        //Add UNIX times to all schedule times
        foreach($poster['schedule'] as $index => $schedule_item){
            $poster['schedule'][$index]['unix'] =
                strtotime(
                    ($current_day == $schedule_item['day'] && $schedule_item['hour'] > $current_hour ? '' : 'next ') .
                    date(
                        'D',
                        strtotime(
                            ($schedule_item['day'] - date('w')).' day'
                        )
                    )
                )
                + ($schedule_item['hour'] * 60 * 60);
            $hour_counts[$schedule_item['day']] += 1;
        }

        //Sort schedule
        $days = $hours = [];
        foreach ($poster['schedule'] as $key => $row) {
            $days[$key]  = $row['day'];
            $hours[$key] = $row['hour'];
        }
        array_multisort($days, SORT_ASC, $hours, SORT_ASC, $poster['schedule']);

        //Find next schedule time
        $found_hour = false;
        $can_start_searching = false;
        $lookup_day = $lookup_hour = 0;
        while(!$found_hour){
            if(!$can_start_searching && $current_day == $lookup_day && $current_hour == $lookup_hour){
                $can_start_searching = true;
            }
            if($can_start_searching){
                //Look if schedule has lookup day/hour
                foreach($poster['schedule'] as $index => $schedule_item){
                    if($schedule_item['day'] == $lookup_day && $schedule_item['hour'] == $lookup_hour){
                        $found_hour = true;
                        $found_schedule = $schedule_item;
                        $count = count($poster['schedule']);
                        $found_next_schedule = $poster['schedule'][($index + 1) % $count];
                        break;
                    }
                }
            }
            if($lookup_day == 6 && $lookup_hour == 23){//Loop Sat -> Sun
                $lookup_day = 0;
                $lookup_hour = 0;
            }else if($lookup_hour == 23){//Loop days
                $lookup_day += 1;
                $lookup_hour = 0;
            }else{//Loop hours
                $lookup_hour += 1;
            }
        }

        //Make sure hour count isn't bigger than the per day amount for every day
        if($poster['per']['type'] == 'day'){
            //Find how many hours scheduled in certain day
            $error_days = [];
            foreach($hour_counts as $index => $hour_count){
                if($poster['per']['value'] < $hour_count){
                    $error_days[] = $day_map[$index];
                }
            }
            if(!empty($error_days)){
                throw new Exception('The amount of hours scheduled in the day needs to be equal to or smaller than the posts per day. Either increase the posts per day to ' . max($hour_counts) . ' or decrease the amount of hours scheduled per day. Error days: ' . implode(', ',$error_days));
            }
        }

        //Find delay if it is the current hour or the start of a future hour
        if($found_schedule['day'] == $current_day && $found_schedule['hour'] == $current_hour){//Same hour
            //First post is ran immediately
            if(!$old_poster['running']){
                $delay_time = 0;
            }else{
                if($poster['per']['type'] == 'hour'){
                    $posts_per_hour = $poster['per']['value'];
                }else{
                    //Find posts per hour rounded
                    $posts_per_hour = round($poster['per']['value'] / $hour_counts[$current_day]);
                }
                //Find delay based on posts per hour - if no posts can be posted in the current hour chooses start of next schedule hour
                $delay_time = delay_by_hour($posts_per_hour);
                if($delay_time === null){
                    $delay_time = $found_next_schedule['unix'] - time();
                }
            }
        }else{//Time to start of next hour
            $delay_time = $found_schedule['unix'] - time();
        }

        return round($delay_time);
    }
}

