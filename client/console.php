<?php
	$const_ip = "instead-former.at.ply.gg";	//Twoje ip
	$const_server_port = "4073";	//Port od gniazda sieciowego (zobacz server.js)
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

	function isServerStarted() {			
		$processName = 'test.exe';
		$command = "ps aux | grep -v grep | grep 'java'";
		$output = shell_exec($command);
		if (strpos($output, 'java') !== false) {
			return 1;
		} else {
			return 0;
		}
	}
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
		<script defer src="./src/client.js"></script>
		<title>4Fun Server</title>
		<style>
			#content {
				height: 80%;
			}
		</style>
	</head>
	<body>
	<div id="topbar"> 
		<span class="separator"></span> 
		<a href="#">Home</a> 
		<span class="separator"></span> 
		<a href="#">Konsola</a> 
		<span class="separator"></span> 
		<a href="#">Gracze</a>
		<span class="separator"></span> 
		<a href="#">Wydajność</a>
		<span class="separator"></span> 
  	</div>
		<div id="content">
			<div id="consolespace" class="incontent">
				<div class="output">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie at ex non semper. Morbi in massa ac odio faucibus facilisis. Ut non massa faucibus, ultricies ipsum ac, laoreet dolor.  </div>
				<div class="output">adipiscing elit. Donec id blandit arcu, eget blandit libero. Pell</div>
				<div class="output">entesque a mauris dictum, rhoncus odio at, sodales elit. Donec laoreet lacus ips</div>
			</div>
		</div>
	</body>
</html>