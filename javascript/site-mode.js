// Function to set initial mode based on user preference
function setInitialMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.getElementById('stylesheet').href = 'css/light/main.css';
    document.getElementById('mode-toggle').src = 'icons/dark-mode.png';
    
    var page = document.getElementsByClassName('active')[0].innerHTML.toLowerCase();
    var bodyStylesheet = document.getElementById('body-stylesheet');
    console.log(page);
    if(bodyStylesheet != null){
      bodyStylesheet.href = 'css/light/'+page+'.css';
    }
  }
}

// Function to toggle mode when the button is clicked
function toggleMode() {
  var currentTheme = document.getElementById('stylesheet').href;
  var theme = 'dark';
  if(currentTheme.includes('css/dark/main.css')) {
    theme = 'light';
  } 
  document.getElementById('stylesheet').href = 'css/'+theme+'/main.css';
  document.getElementById('mode-toggle').src = 'icons/'+theme+'-mode.png';
  
  var page = document.getElementsByClassName('active')[0].innerHTML.toLowerCase();
  var bodyStylesheet = document.getElementById('body-stylesheet');
  console.log(page);
  if(bodyStylesheet != null){
    bodyStylesheet.href = 'css/'+theme+'/'+page+'.css';
  }
}

// Set initial mode
setInitialMode();
