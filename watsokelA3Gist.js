var httpRequest;
var selectedPages;

function submitForm(event) {
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
  return false;
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
    console.log(httpRequest.readyState);
    if(httpRequest.readyState===4){
      if(httpRequest.status===200){
        var response = JSON.parse(httpRequest.responseText);
        displayResults(response);
      }else console.log('Problem with the request');
    }
  }
  catch(e){
    console.log('Caught Exception: ' + e);
  }
}

function displayResults(r){
  var resultsSection = document.getElementById('results');
  var table = document.createElement('table');
  var thead = document.createElement('thead');

  var tr = document.createElement('tr');
  for(var j=0; j<2; j++){
    var th = document.createElement('th');
    if(j==0){
      var thText = document.createTextNode('GIST PROPERTY');
    }
    else if(j==1){ 
      var thText = document.createTextNode('GIST VALUE')
    }
    th.appendChild(thText);
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);

  for(var i=0, len=r.length; i<len; i++){
    var tbody = document.createElement('tbody');
    for(var j=0; j<3; j++){
      var tr = document.createElement('tr');
      for(var k=0; k<2; k++){
        var td = document.createElement('td');
        if(j==0 && k==0) {
          var tdText = document.createTextNode('Description:');
          td.appendChild(tdText);
        }
        if(j==0 && k==1) {
          var tdText = document.createTextNode(r[i].description);
          td.appendChild(tdText);
        }
        if(j==1 && k==0) {
          var tdText = document.createTextNode('URL');
          td.appendChild(tdText);
        }
        if(j==1 && k==1) {
          var gistURL = document.createElement('a');
          var gistURLText = document.createTextNode(r[i].url);
          gistURL.href = gistURLText;
          gistURL.appendChild(gistURLText);
          td.appendChild(gistURL);
        }
        if(j==2 && k==0) {
          var tdText = document.createTextNode('Language');
          td.appendChild(tdText);
        }
        if(j==2 && k==1) {
          debugger;
          var tdText = document.createTextNode(r[i].files[Object.keys(r[i].files)[0]].language);
          td.appendChild(tdText);
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  }
  resultsSection.appendChild(table);  
  table.setAttribute('border','1');
}