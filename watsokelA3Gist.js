var httpRequest;
var selectedPages;
var selectedLangs = [];

function submitForm(event) {
  var numPages = document.getElementsByName('pages');
  for(var k=0, len=numPages.length; k<len; k++){
    if(numPages[k].checked){ 
      selectedPages = numPages[k].value;
      break;
    }
  }

  var navSection = document.createElement('nav');
  var prevNavSection = document.getElementsByTagName('nav')[0];
  var pageNumberIndicator = document.createTextNode('Navigate to Page:');
  navSection.appendChild(pageNumberIndicator);
  for(var k=0; k < selectedPages; k++){
    var pageLink = document.createElement('a');
    pageLink.className = 'pageNavigator';
    pageLink.href = 'javascript:void(0)';
    pageLink.onclick = function(){
      makeRequest('https://api.github.com/gists',k+1,selectedLangs);
    }
    var pageNumber = document.createTextNode((k+1).toString());
    pageLink.appendChild(pageNumber);
    navSection.appendChild(pageLink)
  }
  if(prevNavSection) document.body.replaceChild(navSection,prevNavSection);
  else document.appendChild(navSection);

  while(selectedLangs.length){selectedLangs.pop();}
  var langs = document.getElementsByName('languages');
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
        if(selectedLangs.length != 0){
          response = filterByLang(response);
        }
        //var displayPages = Math.ceil(response.length/30);
        //if(displayPages>1){
        displayResults(response);
        var faveButtons = document.getElementsByTagName('button');
        for(var i=0; i<faveButtons.length; i++){
          faveButtons[i].onclick = function(e){  
            var tempGist = { Description: response[e.target.id].description, 
            Language: response[e.target.id].files[Object.keys(response[e.target.id].files)[0]].language}
            localStorage.setItem(response[e.target.id].url,JSON.stringify(tempGist));
            displayFavorites();
          };
          //faveButtons[i].addEventListener('click', function(e)(as above));
        }
        displayFavorites();

      }else console.log('Problem with the request');
    }
  }
  catch(e){
    console.log('Caught Exception: ' + e);
  }
}

function filterByLang(r){
  var temp = [];
  for(var i=0, lenR=r.length; i<lenR; i++){
    for(var j=0, lenL=selectedLangs.length; j<lenL; j++){
      if(r[i].files[Object.keys(r[i].files)[0]].language == selectedLangs[j]) temp.push(r[i]);
    }
  }
  r = temp;
  return r;
}

function displayResults(r){
  var resultsSection = document.getElementById('results');
  var table = document.createElement('table');
  table.id = 'resultsTable';
  var thead = document.createElement('thead');
  var tr = document.createElement('tr');
  for(var j=0; j<3; j++){
    var th = document.createElement('th');
    if(j==0){
      var thText = document.createTextNode('GIST PROPERTY');
    }
    else if(j==1){ 
      var thText = document.createTextNode('GIST VALUE')
    }
    else if(j==2){
      var thText = document.createTextNode("ADD TO FAVORITE")
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
      for(var k=0; k<3; k++){
        var td = document.createElement('td');
        if(j==0 && k==0) {
          var tdText = document.createTextNode('Description');
          td.appendChild(tdText);
        }
        if(j==0 && k==1) {
          var tdText = document.createTextNode(r[i].description);
          td.appendChild(tdText);
        }
        if(j==0 && k==2){
          var favorite = document.createElement('button');
          var t = document.createTextNode("Add to Favorites");
          favorite.id = i;
          favorite.appendChild(t);
          td.appendChild(favorite);
        }
        if(j==1 && k==0) {
          var tdText = document.createTextNode('URL');
          td.appendChild(tdText);
        }
        if(j==1 && k==1) {
          var gistURL = document.createElement('a');
          var gistURLText = document.createTextNode(r[i].url);
          //gistURL.href = gistURLText;
          gistURL.setAttribute('href',gistURLText.data);
          gistURL.appendChild(gistURLText);
          td.appendChild(gistURL);
        }
        if(j==2 && k==0) {
          var tdText = document.createTextNode('Language');
          td.appendChild(tdText);
        }
        if(j==2 && k==1) {
          var tdText = document.createTextNode(r[i].files[Object.keys(r[i].files)[0]].language);
          td.appendChild(tdText);
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  }
  table.setAttribute('border','1');
  var previousTable = document.getElementById('resultsTable');
  if(previousTable) resultsSection.replaceChild(table,previousTable);
  else resultsSection.appendChild(table);  
}

function displayFavorites(){
  var listOfFaves = document.getElementById('favoriteGists');
  var faveHeader = document.createElement('h3');
  faveHeader.id = 'menuHeader';
  faveHeader.innerHTML = 'Your Favorite Gists';
  listOfFaves.appendChild(faveHeader);
  var dList = document.createElement('dl');
  for(var k=0, len=localStorage.length; k<len; k++){
    var gistKey = localStorage.key(k);
    var gistString = localStorage.getItem(gistKey);
    var gistObject = JSON.parse(gistString);
    var dTerm = document.createElement('dt');
    var gistKey = document.createTextNode(gistObject.Description);
    dTerm.appendChild(gistKey);
    dList.appendChild(dTerm);
    var dDesc = document.createElement('dd');
    var gistValue = document.createTextNode(gistKey);
    dDesc.appendChild(gistValue);
    dList.appendChild(dDesc);
  }
  listOfFaves.appendChild(dList);
}