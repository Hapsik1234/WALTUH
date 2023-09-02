<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> 
<meta name="viewport" content="width=device-width, 
initial-scale=1.0"> <title>Dark Topbar</title> <style>
  body { margin: 0; padding: 0; background-color: #1a1a1a; color: 
    #fff;
    font-family: Arial, sans-serif;
  }
  #topbar {
    background-color: #111; padding: 10px 0; text-align: center; 
    border-bottom: 2px solid #333; display: flex; justify-content: 
    center; align-items: center;
  }
  #topbar a {
    color: #fff; text-decoration: none; margin: 0 20px; position: 
    relative;
  }
  #topbar a:hover {
    color: #66ccff;
  }
  .separator { width: 1px; height: 20px; background-color: #333; 
    margin: 0 10px;
  }
  @media (max-width: 600px) {
    #topbar {
      flex-direction: column;
    }
    
    .separator { display: none;
    }
    #topbar a {
      margin: 10px;
    }
  }
</style> </head> <body> <div id="topbar"> <a href="#">Home</a> 
    <span class="separator"></span> <a href="#">Console</a> <span 
    class="separator"></span> <a href="#">Players</a> <span 
    class="separator"></span> <a href="#">Resources</a>
  </div> </body>
</html>
