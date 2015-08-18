<?php

header( 'Content-type: application/json' );

function Handle( $Method, $Data = [] )
{
	// Require all API calls to have proper gameid
	$GameID = (int)filter_input( $Method, 'gameid', FILTER_SANITIZE_NUMBER_INT );
	
	if( $GameID < 1 )
	{
		http_response_code( 400 );
		die;
	}
	
	if( $Method === INPUT_POST )
	{
		session_start();
		
		$Token = $_POST[ 'access_token' ];
		
		if( !isset( $_SESSION[ 'SteamID' ] ) || $_SESSION[ 'SteamID' ] !== $_POST[ 'access_token' ] )
		{
			http_response_code( 401 );
			die;
		}
	}
	
	$Data[ 'gameid' ] = $GameID;
	
	$Data = json_encode( $Data );
	
	$Socket = socket_create( AF_INET, SOCK_STREAM, SOL_TCP );
	
	socket_set_option( $Socket, SOL_SOCKET, SO_KEEPALIVE, 0 );
	socket_set_option( $Socket, SOL_SOCKET, SO_REUSEADDR, 1 );
	socket_set_option( $Socket, SOL_SOCKET, SO_RCVTIMEO, [ 'sec' => 3, 'usec' => 0 ] );
	socket_set_option( $Socket, SOL_SOCKET, SO_SNDTIMEO, [ 'sec' => 3, 'usec' => 0 ] );
	
	if( @socket_connect( $Socket, 'data', 5337 ) )
	{
		socket_write( $Socket, $Data, strlen( $Data ) );
		
		$Buffer = '';
		
		while( $Response = socket_read( $Socket, 10, 0 ) )
		{
			$Buffer .= $Response;
		}
		
		echo $Buffer;
		
		socket_shutdown( $Socket, 2 );
		socket_close( $Socket );
		
		return true;
	}
	
	http_response_code( 500 );
	
	socket_close( $Socket );
	
	return false;
}
