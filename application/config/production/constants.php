<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
|--------------------------------------------------------------------------
| Production Configuration Constants
|--------------------------------------------------------------------------
*/

//Database
define('MYSQL_HOST',    'mysql');
define('MYSQL_USERNAME','admin');
define('MYSQL_PASSWORD','349v664384308y34860m72v');
define('MYSQL_DATABASE','MainDatabase');
define('MYSQL_PORT',3306);
define('MYSQL_DRIVER','mysqli');
define('MYSQL_CHARSET','utf8mb4');

//Global
define('NOTIFICATIONS',true);
define('MB_RATIO',1048576);
define('FAILED_LOGIN_ATTEMPTS',5);
define('IP_HEADER','REMOTE_ADDR');
define('LOGIN_SESSION_DAYS',7);
define('MAX_ACTIVE_ROMS',9);
define('MAX_POSTER_ACCOUNTS',60);
define('MAX_TWEETS_IMPORT',7500);
define('FREE_USER_MAX_POSTS',10);
define('FREE_USER_MAX_ACCOUNTS',1);
define('MOCK_POST',false);


define('BASE_URL','http://qcide.com/');
define('API_URL','http://api.qcide.com/');
define('STATIC_URL','http://static.qcide.com/');
define('FILES_URL','http://files.qcide.com/');
define('BASE_URLS','qcide.com www.qcide.com');
define('HASH','#/');
define('BASE_NAME','QCIDE');
define('BASE_NAME_ABBR','QCIDE');

define('SENDGRID_API_KEY','change_this');
define('SENDGRID_EMAIL',"support@qcide.com");
define('SENDGRID_REPLY_EMAIL',"support@qcide.com");
define('SENDGRID_NAME','QCIDE');

define('ALGOLIA_APP_ID',"change_this");
define('ALGOLIA_API_KEY',"change_this");

define('ALGOLIA_POSTS_INDEX',"posts");

//AWS
define('AWS_S3_BASE_NAME','s3.amazonaws.com');
define('AWS_KEY','change_this');
define('AWS_SECRET','change_this');
define('AWS_S3_FILES_BUCKET_NAME','files.qcide.com');
define('AWS_S3_MAX_UPLOAD_SIZE', 10);//Size in MB
define('AWS_S3_POSTS_BASE','posts/');

//Stripe
define('STRIPE_PK','change_this');
define('STRIPE_SK','change_this');

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0777);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/

define('FOPEN_READ', 'rb');
define('FOPEN_READ_WRITE', 'r+b');
define('FOPEN_WRITE_CREATE_DESTRUCTIVE', 'wb'); // truncates existing file data, use with care
define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE', 'w+b'); // truncates existing file data, use with care
define('FOPEN_WRITE_CREATE', 'ab');
define('FOPEN_READ_WRITE_CREATE', 'a+b');
define('FOPEN_WRITE_CREATE_STRICT', 'xb');
define('FOPEN_READ_WRITE_CREATE_STRICT', 'x+b');

/*
|--------------------------------------------------------------------------
| Display Debug backtrace
|--------------------------------------------------------------------------
|
| If set to TRUE, a backtrace will be displayed along with php errors. If
| error_reporting is disabled, the backtrace will not display, regardless
| of this setting
|
*/
define('SHOW_DEBUG_BACKTRACE', TRUE);

/*
|--------------------------------------------------------------------------
| Exit Status Codes
|--------------------------------------------------------------------------
|
| Used to indicate the conditions under which the script is exit()ing.
| While there is no universal standard for error codes, there are some
| broad conventions.  Three such conventions are mentioned below, for
| those who wish to make use of them.  The CodeIgniter defaults were
| chosen for the least overlap with these conventions, while still
| leaving room for others to be defined in future versions and user
| applications.
|
| The three main conventions used for determining exit status codes
| are as follows:
|
|    Standard C/C++ Library (stdlibc):
|       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
|       (This link also contains other GNU-specific conventions)
|    BSD sysexits.h:
|       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
|    Bash scripting:
|       http://tldp.org/LDP/abs/html/exitcodes.html
|
*/
define('EXIT_SUCCESS', 0); // no errors
define('EXIT_ERROR', 1); // generic error
define('EXIT_CONFIG', 3); // configuration error
define('EXIT_UNKNOWN_FILE', 4); // file not found
define('EXIT_UNKNOWN_CLASS', 5); // unknown class
define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
define('EXIT_USER_INPUT', 7); // invalid user input
define('EXIT_DATABASE', 8); // database error
define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code

/* End of file constants.php */
/* Location: ./application/config/constants.php */