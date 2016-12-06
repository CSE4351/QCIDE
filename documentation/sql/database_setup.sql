#Author: Preston Tighe

DROP DATABASE IF EXISTS MainDatabase;
CREATE DATABASE IF NOT EXISTS MainDatabase;
USE MainDatabase;

# ALTER SCHEMA MainDatabase DEFAULT CHARACTER SET utf8mb4;
# GRANT ALL ON MainDatabase.* TO `admin`@localhost IDENTIFIED BY '349v664384308y34860m72v';

CREATE TABLE accounts
(
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	uid INT(11),
	name TEXT,
	token TEXT,
	token_secret TEXT,
	provider TEXT,
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	ip VARCHAR(40),
	active TINYINT(1) DEFAULT '1'
);
CREATE TABLE api_keys
(
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	uid INT(11),
	username VARCHAR(40),
	api_key VARCHAR(60) NOT NULL,
	level INT(2) NOT NULL,
	ignore_limits TINYINT(1) DEFAULT '0' NOT NULL,
	is_private_key TINYINT(1) DEFAULT '0' NOT NULL,
	ip_addresses TEXT,
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	active TINYINT(1) DEFAULT '1' NOT NULL
);
CREATE TABLE globals
(
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	object VARCHAR(40),
	action VARCHAR(40),
	active INT(11) DEFAULT '1' NOT NULL,
	message TEXT
);
CREATE TABLE password_resets
(
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	token VARCHAR(40),
	uid INT(11),
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX uid ON password_resets (uid);
CREATE TABLE posts
(
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	uid INT(11),
	text TEXT,
	filtered_text TEXT,
	file_url TEXT,
	file_s3_name TEXT,
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	ip VARCHAR(40),
	posted_accounts TEXT,
	posted TINYINT(1) DEFAULT '0',
	use_own_images TINYINT(1) DEFAULT '1',
	active TINYINT(1) DEFAULT '1',
	file_url_small TEXT,
	file_s3_name_small TEXT
);
CREATE TABLE queue_messages
(
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	message MEDIUMTEXT,
	status VARCHAR(40),
	date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	retries INT(11),
	message_id VARCHAR(100),
	queue LONGTEXT,
	version INT(11) DEFAULT '0',
	errors TEXT
);
CREATE TABLE user_failed_login_history
(
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	attempts INT(11),
	ip VARCHAR(40),
	uid INT(11),
	last_attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE user_login_history
(
	login_history_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	ip VARCHAR(40),
	uid INT(11),
	date_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE users
(
	uid INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(40),
	last_name VARCHAR(40),
	username VARCHAR(100),
	password VARCHAR(255),
	poster TEXT,
	type INT(11),
	date_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	date_banned_till TIMESTAMP DEFAULT '0000-00-00 00:00:00' NOT NULL,
	profile_picture_url VARCHAR(400),
	ip VARCHAR(40),
	active TINYINT(1) DEFAULT '1',
	poster_queue_id INT(11),
	subscription_type VARCHAR(255),
	stripe_customer_id VARCHAR(255)
);

INSERT into globals(object,action,active) values ('Ironmq',1,1);
INSERT into globals(object,action,active) values ('QCIDE',null,1);
INSERT into globals(object,action,active) values ('QCIDE','login',1);
INSERT into globals(object,action,active) values ('QCIDE','register',1);
INSERT into globals(object,action,active) values ('Instagram',null,1);
INSERT into globals(object,action,active) values ('Twitter',null,1);
INSERT into globals(object,action,active) values ('Facebook',null,1);

