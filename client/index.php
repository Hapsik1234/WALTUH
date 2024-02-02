<?php
	$const_ip = "method-tries.gl.at.ply.gg";	//Twoje ip instead-former.at.ply.gg
	$const_server_port = "19311";	//Port od gniazda sieciowego (zobacz server.js)
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

	authcheck($key);	//Uncomment for service work
?>

<html> 
	<head>
		<link rel="icon" href="assets/icon.png">
		<link rel="stylesheet" href="src/style.css">
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;600;800&display=swap" rel="stylesheet">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.2/howler.core.min.js"></script>
		<?php
			
			echo('<script defer src="http://'.$const_ip.':'.$const_server_port.'/socket.io/socket.io.js"></script>');
		?>
		<!--script defer type="module" src="http://localhost:8080/mcserver/client/node_modules/socket.io-client/build/esm/index.js"></script!-->
		<script type="text/javascript" src="src/script.js"></script>
		<script defer src="src/client.js"></script>
		<title>4Fun Server</title>
	</head>
	<body>
		<div id="christmas"></div>
		<div id="tower-of-piza">
			<div id="popup-container">
			</div>
		</div>
		<div id="topbar"> 
			<span class="separator"></span> 
			<a href="#" id="gohome">Home</a> 
			<span class="separator"></span> 
			<a href="#" id="goconsole">Konsola</a> 
			<span class="separator"></span> 
			<a href="#" id="goplayers">Gracze</a>
			<span class="separator"></span> 
			<a href="#" id="goperformance">Wydajność</a>
			<span class="separator"></span> 
		</div>
			<div id="content">

			<div id="svstate">
				Stan serwera: Nie można nawiązać połączenia z serwerem.
			</div>

			<button class="button power" value="Start" type="button" name="" id="serverpowerst">
				Błąd
			</button>
			</div>
	</body>
</html>

<!--

For good luck

..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
.............................................:------------:...............................
.........................................:=-:.            .-=:............................
........................................=:                   :=...........................
.......................................=.                     .+..........................
.....:---------------------:..........--                       :-.........................
....=+::::::::::::::::::-  +..........*                         +.........................
....=                  =+. +:.........#::--=  ==:::::-=         +.........................
....-=::::::::::::::::+. = .=.........+-:.+    +:    :=        --.........................
.....+                =  =  +.........:+..      :::-:         -=..........................
.....--   ...         :- .- --.........-: =+==++-            --...........................
......+  .=...:::::++  +  + .+..........=#  :--  --        :=:............................
......-: -.        ++  -: -. =:.........=-=-      .=.   :-*=..............................
.......+ *        .-=.  +  + :=.........*...---:::--*++=:..*..............................
.......=:+        -.+   -: =. +.........*...........:*=....++.............................
........*:        +.=    =  = --........+.........:=:.=:..--:+............................
........+         *-.    -. = --........*.......:=:....+..+:.=............................
........+        .-+======*++=:.........+:....-=:......=-:+..--...........................
.......:=        -=*+++++=-:::::-+---:..--.:=-.........:++...:=...........................
::::::=+..........=       =-:..::+--==:::-:-:::::::::::-=-::---=++*+++:...................
      -:::::::::::::....:..                        ..:::--:::::.     -:...................
!-->
