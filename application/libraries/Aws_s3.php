<?php
use \Eventviva\ImageResize;

class Aws_s3{
    private $client;
    public function __construct(){
        require_once __DIR__ . '/../resources/AWS/aws-autoloader.php';
        $this->client = Aws\S3\S3Client::factory(array(
            'key'    => AWS_KEY,
            'secret' => AWS_SECRET
        ));
    }
    function upload_files($hash) {
        $hash = default_array($hash, array(
            array(
                'keys' => array('urls', 'files', 'formats'),
                'value' => array()
            ),
            array(
                'keys' => array('bucket'),
                'required' => true
            ),
            array(
                'keys' => array('prefix'),
                'value' => ''
            ),
            array(
                'keys' => array('public'),
                'value' => true
            )
        ));

        $files = $this->_parse_files($hash);
        $info = array();
        foreach($files as $index => $file) {
            $tmp_name = $file['tmp_name'];
            $fileName = strtolower($file['name']);
            if($file['error']) throw new Exception('Error uploading file: ' . $fileName);
            $uniq_id = uniq_hash();
            $s3_name_big =  s3_name($hash['prefix'], $fileName, '',$uniq_id);
            $s3_name_small =  s3_name($hash['prefix'], $fileName, '_small',$uniq_id);

            //Big
            $url = $this->upload($hash['bucket'], $s3_name_big, $tmp_name, $hash['public']);

            //Small
            $image = new ImageResize($tmp_name);
            $image->resizeToHeight(100);
            $image->save($tmp_name . '_small');
            $url_small = $this->upload($hash['bucket'], $s3_name_small, $tmp_name . '_small', $hash['public']);

            $info[] = array(
                'url' => $url ,
                'url_small' => $url_small ,
                'name' => $fileName ,
                's3_name' => $s3_name_big ,
                's3_name_small' => $s3_name_small ,
                'size' => $file['size']
            );
        }

        return $info;
    }
    function delete_files($bucket,$fileNames) {
        $multi = null;
        try {
            if(is_array($fileNames)){
                $multi = true;
                $this->client->deleteObjects(array(
                    'Bucket'     => $bucket,
                    'Objects'    => $fileNames,
                ));
            }else{
                $multi = false;
                $this->client->deleteObject(array(
                    'Bucket'     => $bucket,
                    'Key'        => $fileNames,
                ));
            }
        }catch (Exception $e) {
            throw new Log_Error(array(
                'error' => 'Error deleting file' . ($multi ? 's' : '') . ': ' . ($multi ? implode(', ', $fileNames) : $fileNames),
                'log_error' => $e->getMessage()
            ));
        }
        return true;
    }
    function upload($bucket,$fileName,$tmp_name_real,$isPublic = true,$url_type = 'files'){
        try {
            $result = $this->client->putObject(array(
                'Bucket'     => $bucket,
                'Key'        => $fileName,
                'SourceFile' => $tmp_name_real,
                'ACL'        => $isPublic ? 'public-read' : 'private'
            ));
        }catch (Exception $e) {
            throw new Log_Error(array(
                'error' => 'Error uploading file: ' . $fileName,
                'log_error' => $e->getMessage()
            ));
        }

        if($url_type == 'files'){
            return files_url($bucket, $result['ObjectURL']);
        }else if($url_type == 'static'){
            return static_url($bucket, $result['ObjectURL']);
        }else{
            throw new Exception('Invalid upload url type.');
        }
    }
    function get_signed_url($s3_name,$time){
        $request = $this->client->get('https://' . AWS_S3_FILES_BUCKET_NAME . '.' . AWS_S3_BASE_NAME . "/{$s3_name}");
        return $this->client->createPresignedUrl($request, $time);
    }
    private function _parse_files($hash){
        $files = array();
        global $index;

        //Default blank array
        $hash = default_array($hash, array(
            array(
                'keys' => array('urls', 'files', 'formats'),
                'value' => array()
            )
        ));

        //Check if any files to check
        if(empty($hash['urls']) && empty($hash['files'])) throw new Exception('No files to upload.');

        //Files
        if(!empty($hash['files'])){
            if(!empty($hash['files']['tmp_name']) && is_array($hash['files']['tmp_name'])){
                $new_files_hash = array();
                foreach($hash['files']['tmp_name'] as $index => $value){
                    $new_files_hash[] = array(
                        'name' => $hash['files']['name'][$index],
                        'type' => $hash['files']['type'][$index],
                        'tmp_name' => $hash['files']['tmp_name'][$index],
                        'error' => $hash['files']['error'][$index],
                        'size' => $hash['files']['size'][$index],
                    );
                }
                $hash['files'] = $new_files_hash;
            }else if(!empty($hash['files']['tmp_name'])){
                $hash['files'] = array(
                    array(
                        'name' => $hash['files']['name'],
                        'type' => $hash['files']['type'],
                        'tmp_name' => $hash['files']['tmp_name'],
                        'error' => $hash['files']['error'],
                        'size' => $hash['files']['size']
                    )
                );
            }
            foreach($hash['files'] as $index => $value) {
                $file = array();
                //Check
                $tmp_name = $hash['files'][$index]['tmp_name'];
                $file_name =  $hash['files'][$index]['name'];
                $error = $hash['files'][$index]['error'];

                $file_name = check_ext($file_name,$file_name,$tmp_name);

                //Parse
                $file  = $file + array(
                        'tmp_name' => $tmp_name,
                        'name' => $file_name,
                        'error' => $error,
                        'external' => 0,
                        'size' => filesize($tmp_name)
                    );

                $file = $this->_check_file($file, $hash);

                $files[] = $file;
            }
        }

        //URLs
        if(!empty($hash['urls'])){
            foreach($hash['urls'] as $value) {
                $file = array();
                //Parse
                $tmp_name = '/tmp/' . uniq_hash();

                //Array of URLs
                if(gettype($value) == 'string'){
                    $value = ['url' => $value];
                }

                $file_name =  file_name(!empty($value['file_name']) ? $value['file_name'] : $value['url']);
                $error = 0;

                file_put_contents($tmp_name, curl($value['url']));

                //Add image ext if none
                $file_name = check_ext($value['url'],$file_name,$tmp_name);

                $file  = $file + array(
                        'tmp_name' => $tmp_name,
                        'name' => $file_name,
                        'error' => $error,
                        'external' => 1,
                        'size' => filesize($tmp_name)
                    );

                $file = $this->_check_file($file, $hash);

                $files[] = $file;
            }
        }
        $index = null;
        return $files;
    }
    private function _check_file($file, $hash){
        $ext = ext($file['name']);
        $max_size = !empty($hash['max_size']) ? $hash['max_size'] : AWS_S3_MAX_UPLOAD_SIZE;
        if($file['error']){
            throw new Exception('Error with file: ' . $file['name']);
        }
        if(!($file['size'] < (MB_RATIO * $max_size))){
            throw new Exception('File size max is ' . $max_size . ' MB.');
        }
        if(!empty($hash['formats']) && !in_array($ext, $hash['formats'])){
            throw new Exception('Invalid file format. Valid formats are ' . implode(', ', $hash['formats']) . '.');
        }
        return $file;
    }
}
