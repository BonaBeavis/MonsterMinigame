<?php
session_start();
include('login.php'); // Includes Login Script
$Config = json_decode( file_get_contents( __DIR__ . '/php/files/config.json' ) );
$CDN = $Config->Assets->Host;
$VERILINKS_SERVER = $Config->Assets->VeriLinksServer;
header( 'Content-Security-Policy: script-src \'none\';'.
'script-src \'self\' \'unsafe-eval\' ' . $CDN . $VERILINKS_SERVER  . '; ' );
?><!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Tower Attack</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link href="<?php echo $CDN; ?>/assets/css/towerattack.css?v=<?php echo hash_file( 'crc32', __DIR__ . '/assets/css/towerattack.css' ); ?>" rel="stylesheet" type="text/css">
    <link href="<?php echo $CDN; ?>/assets/css/towerattack_listgames.css?v=<?php echo hash_file( 'crc32', __DIR__ . '/assets/css/towerattack_listgames.css' ); ?>" rel="stylesheet" type="text/css">
  </head>
  <body class="flat_page">
    <div class="page_background" style="background-image: url('/assets/promo_bg/08_volcano_page_background.jpg');">
      <div class="section_overview">

        <div class="section_monster">
          <div class="monster_ctn">
            <img class="promo_creep" src="/assets/promo_bg/08_volcano_creep.gif">
            <img class="promo_creep_shadow" src="/assets/promo_bg/shadow_small.png">
            <div class="boss_ctn">
              <img class="promo_boss" src="/assets/promo_bg/08_volcano_boss.gif">
            </div>
            <img class="promo_boss_shadow" src="/assets/promo_bg/shadow_large.png">
          </div>
        </div>

        <div class="section_play">
          <div class="logo">
            <img src="/assets/images/logo_main_english.png">
          </div>
          <!-- Login -->
          <div id="login" class="current_game">
            <form action="" method="post">
              <span><?php echo $error; ?></span><br><br>
              <input id="name" name="nickname" placeholder="Nickname" value = "<?php echo (isset( $_SESSION[ 'SteamID' ] ))?$_SESSION[ 'SteamID' ]:'';?>" type="text"><br><br>
              <input class="main_btn" name="submit" type="submit" value=" Play ">
            </form>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>

