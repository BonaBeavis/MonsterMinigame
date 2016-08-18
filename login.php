<?php
session_start(); // Starting Session
$error=''; // Variable To Store Error Message
if (isset($_POST['submit'])) {
    if (empty($_POST['nickname'])) {
        $error = "Nickname missing";
    } else {
        $nickname = $_POST[ 'nickname' ];
        $_SESSION[ 'SteamID' ] = $nickname;
        $_SESSION[ 'Name' ] = $nickname;
        header( 'Location: /play/' );
    }
}
?>
