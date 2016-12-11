<?php /* Smarty version Smarty-3.1.13, created on 2016-12-09 16:43:26
         compiled from "/var/www/html/application/resources/EmailTemplates/password_reset.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1403834380584b338e0c4351-51470335%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '84f5ed87bd834b2201d63aa9f42badb886a96fc4' => 
    array (
      0 => '/var/www/html/application/resources/EmailTemplates/password_reset.tpl',
      1 => 1475894310,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1403834380584b338e0c4351-51470335',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'url' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_584b338e0cc987_66997499',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_584b338e0cc987_66997499')) {function content_584b338e0cc987_66997499($_smarty_tpl) {?>To reset your password click the URL below.
<br>
<br>
<a href="<?php echo $_smarty_tpl->tpl_vars['url']->value;?>
">Reset my password</a><?php }} ?>