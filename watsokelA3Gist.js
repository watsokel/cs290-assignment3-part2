(function() {
  var httpRequest;
  document.getElementById('ajaxButton').onclick = function() { 
    var numPages = document.getElementsByName('pages');
    var selectedPages;
    for(var k=0, len=numPages.length; k<len; k++){
      if(numPages[k].checked){ 
        selectedPages = numPages[k].value;
        break;
      }
    }
    var langs = document.getElementsByName('languages');
    var selectedLangs = [];
    for(var k=0, len=langs.length; k<len; k++){
      if(languages[k].checked) {
        selectedLangs.push(languages[k]);
      }
    }
    debugger;
    makeRequest('https://api.github.com/gists',selectedPages,selectedLanguages);
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
    httpRequest.open('GET', 'https://api.github.com/gists', true);
    httpRequest.send(null);
  }

  function processData(){
    try{
      if(httpRequest.readyState===4){
        if(httpRequest.status===200){
          var response = JSON.parse(httpRequest.responseText);
          console.log(response);
        }else alert('Problem with the request');
      }
    }
    catch(e){
      alert('Caught Exception: ' + e.description);
    }
  }
})();