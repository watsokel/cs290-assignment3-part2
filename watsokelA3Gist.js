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
    httpRequest.open('GET','https://api.github.com/gists?page='+sPages+'&per_page='+30,true);
    httpRequest.send(null);
  }

  function processData(){
    try{
      if(httpRequest.readyState===4){
        if(httpRequest.status===200){
          var response = JSON.parse(httpRequest.responseText);
          debugger;
          displayResults(response);
          
        }else console.log('Problem with the request');
      }
    }
    catch(e){
      console.log('Caught Exception: ' + e.description);
    }
  }

  function displayResults(r){
    var resultsSection = document.getElementById('results');
    var table = document.createElement('table');

    var thead = document.createElement('thead');
    for(var i=0; k<2; k++){
      var tr = document.createElement('tr');
      for(var j=0; j<2; j++){
        var th = document.createElement('th');
        if(j==0){
          var thText = document.createTextNode('Gist Property');
        }
        else if(j==1){ 
          var thText = document.createTextNode('Gist Value')
        }
        th.appendChild(thText);
        tr.appendChild(th);
      }
      thead.appendChild(tr);
    }

    var tbody = document.createElement('tbody');
    for(var i=0; k<3; k++){
      var row = document.createElement('tr');
      for(var j=0; j<2; j++){
        var td = document.createElement('td');
        if(i==0 && j==0) var tdText = document.createTextNode('Description:');
        if(i==0 && j==1) var tdText = document.createTextNode(r.description);
        if(i==1 && j==0) var tdText = document.createTextNode('URL')
        if(i==1 && j==1) var tdText = document.createTextNode(r.url)
        if(i==2 && j==0) var tdText = document.createTextNode('Language')
        if(i==2 && j==1) var tdText = document.createTextNode(r.files.language)
        td.appendChild(tdText);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    //var tfoot = document.createElement('tfoot');
  }

})();

