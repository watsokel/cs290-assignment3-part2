(function() {
  var httpRequest;
  var selectedPages;

  document.getElementById('ajaxButton').onclick = function() { 
    var numPages = document.getElementsByName('pages');
    for(var k=0, len=numPages.length; k<len; k++){
      if(numPages[k].checked){ 
        selectedPages = numPages[k].value;
        break;
      }
    }
    var langs = document.getElementsByName('languages');
    var selectedLangs = [];
    for(var k=0, len=langs.length; k<len; k++){
      if(langs[k].checked) {
        selectedLangs.push(langs[k].value);
      }
    }
    makeRequest('https://api.github.com/gists',1,selectedLangs);
  }

  function makeRequest(url, sPages, sLanguages){
    if(window.XMLHttpRequest) httpRequest = new XMLHttpRequest();
    else if(window.ActiveXObject){
      try { httpRequest = new ActiveXObject('Msxml2.XMLHTTP')}
      catch(e){
        try{  httpRequest = new ActiveXObject('Microsoft.XMLHTTP');}
        catch(e){}
      }
    }
    if (!httpRequest){
      alert('Unable to create XMLHTTP instance.');
      return false;
    }
    httpRequest.onreadystatechange = processData;
    httpRequest.open('GET', 'https://api.github.com/gists?page='+sPages+'&per_page='+30, true);
    httpRequest.send(null);
    }
  }

  function processData(){
    try{
      if(httpRequest.readyState===4){
        if(httpRequest.status===200){
          var response = JSON.parse(httpRequest.responseText);
          displayResults(response);
        }else console.log('Problem with the request');
      }
    }
    catch(e){
      console.log('Caught Exception: ' + e.description);
    }
  }

  function displayResults(r){


  }

})();

