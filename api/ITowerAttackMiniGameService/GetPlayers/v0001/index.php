<?php
	require __DIR__ . '/../../Init.php';
	
	$Result = Handle( INPUT_GET, [
		'method' => 'GetPlayers'
	] );
