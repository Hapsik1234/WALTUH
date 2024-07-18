<!DOCTYPE html>
<?php
	$const_ip = "localhost";	//Twoje ip instead-former.at.ply.gg
	$const_server_port = "3000";	//Port od websocketa (zobacz server.js) (4073)
	$key = "oJD8XtaeBQrsprQ0eVareQ";

	header('Access-Control-Allow-Origin: https://4fun-server.glitch.me');
	header('Access-Control-Allow-Private-Network: true');

	function authcheck($accesskey) {
		//echo("Auth checking");
		if(isset($_GET['auth'])) {
			$authkey = $_GET['auth'];
			if($authkey!==$accesskey) {
				header("Location: error.php");
				exit();
				//echo("Wrong, orginal: $accesskey, your: $authkey");
			}
		} else {
			header("Location: error.php");
			exit();
			//echo("No auth");
		}
	}



	// authcheck($key);	//Uncomment for service work
	
?>
<html>
<head>
    <link rel="icon" href="assets/icon.png">
    <link rel="stylesheet" href="src/style.css">
	<link rel="stylesheet" href="src/picker.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;600;800&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.2/howler.core.min.js"></script>
    <!--script defer type="module" src="http://localhost:8080/mcserver/client/node_modules/socket.io-client/build/esm/index.js"></script!-->
    <script type="text/javascript" src="src/snow.js"></script>
    <script type="text/javascript" src="src/popup.js"></script>

    <?php
        echo('<script defer src="http://'.$const_ip.':'.$const_server_port.'/socket.io/socket.io.js"></script>');
    ?>
	<script defer src="src/picker.js" type="module"></script>
    <meta charset="UTF-8" />
    <title>WALTUH server manager</title>
</head>
<body>
		<div id="tower-of-piza">
			<div id="popup-container">
			</div>
		</div>
	<div id="topbar">
	<span class="separator"></span>
	<div class="indicator_container">
			<div id="indicator_off" class="indicator"></div> 
			<!-- // class="indicator_off indicator enabled" -->
			<div id="indicator_connecting" class="indicator"></div> 
			<!-- // class="indicator_connecting indicator" -->
			<div id="indicator_on" class="indicator"></div> 
			<!-- // class="indicator_on indicator" -->
		</div>
	</div>
	
	<div id="server_list_container">
    	<!-- <div class="server_element">
			<div class="server_name">Server.name</div>
			<span class="server_status">server.status<br></span>
			<span class="server_version">server.version<br></span>
			<span class="server_engine">server.engine<br></span>
			<div class="server_status_indicator_starting"></div>
			server_status_indicator_starting, server_status_indicator_on, server_status_indicator_off
		</div> -->
	</div>
</body>
</html>