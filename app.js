var http = require('http'),
    express = require('express'),
    xml2js = require('xml2js'),
    bodyParser = require('body-parser'),
    rp = require('request-promise'),
    app = express(),
    request = require("request"),
    port = '3000';
http.post = require('http-post');
var username = 'LEON';
var password = 'Prd123456';
var sapgw = {
  host: '10.166.2.105',
  port:'18000',

  // set up Basic authentication
  headers:  {
    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
    'X-CSRF-Token': 'fetch',

  }
}




var postoptions = {
  host: '10.166.2.105',
  port: '18000',
  method: 'POST',
  path:'',
  headers: {
    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
    'Content-Type': 'application/json',
  }
};
var optionsleave = { method: 'POST',
  url: 'http://10.166.2.105:18000/sap/opu/odata/SAP/ZLEAVE_POST_DATE_SRV/ImportSet',
  headers:
  {
    'cache-control': 'no-cache',
    'x-csrf-token': '',
    Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
    'content-type': 'application/json' },
  json: true };


function getlist(user_request, user_response) {
  sapgw.path = user_request.url;
  console.log(sapgw.path);
  http.request(sapgw, function (sapgw_response) {

    // Include a content type in the response header
    user_response.header('Content-Type','application/atom+xml;type=feed');

    // In Node, http responses are streams. You can just
    // pipe the response data from the Gateway to the user.
    sapgw_response.pipe(user_response);
  });
}


function postleave(user_request, user_response) {
  var token = {}
  var tokenxx
  sapgw.uri = 'http://127.0.0.1:18000' + user_request.url;
  console.log(sapgw.uri)
  sapgw.path = user_request.url;
  sapgw.resolveWithFullResponse = true;
  rp(sapgw).then(function (repos) {
    console.log('THISSSSIS R  ' + JSON.stringify(repos))
    token = repos.headers
    console.log('tokenx:ok  ' + token["x-csrf-token"])

  }).catch(function(err){
   console.log(err)
    console.log("errorrrrr")
    token = err.response.headers
    console.log('tokenx:  ' + token["x-csrf-token"])
    tokenxx = token["x-csrf-token"]


  })

//  sapgw.path = user_request.url;
//  console.log(sapgw)
//  var req = http.request(sapgw, (res) => {
//        console.log(`STATUS: ${res.statusCode}`);
//  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//  res.setEncoding('utf8');
//  res.on('data', (chunk) => {
//    console.log(`BODY: ${chunk}`);
//});
//  res.on('end', () => {
//    console.log('No more data in response.');
//});
//});
//
//  req.on('error', (e) => {
//    console.log(`problem with request: ${e.message}`);
//});
//  req.end();



/*  setTimeout(function() {
    console.log("postleavecall caled")
    console.log(JSON.stringify(user_request.body))
    postoptions.path = user_request.url;
    console.log(postoptions.path);
    postoptions.headers["X-CSRF-Token"] = JSON.stringify(token["x-csrf-token"])
    //console.log("postoption:  " + JSON.stringify(postoptions))
    var req = http.request(postoptions, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });
// write data to request body
    req.write(JSON.stringify(user_request.body));
    req.end();


  }, 500);*/


  setTimeout(function() {
    console.log("postleavecall caled")
    console.log(JSON.stringify(user_request.body))
    optionsleave.headers["x-csrf-token"] = JSON.stringify(tokenxx)
    optionsleave.body = JSON.stringify(user_request.body)
    console.log("postoption:  " + JSON.stringify(optionsleave))
    request(optionsleave, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });

  }, 3500);





/*  var resp = http.request(sapgw, function(res) {
  //  console.log(`STATUS: ${res.statusCode}`);
  //  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    token = JSON.stringify(res.headers)
    console.log(JSON.stringify(res.headers))
    res.setEncoding('utf8');
//    res.on('data', (chunk) => {
 //     console.log(`BODY: ${chunk}`);
 // });
    res.on('end', () => {
      console.log('No more data in response.');
  });
  })
  resp.end();*/






}

function test(user_request, user_response) {
  console.log('test called');
  console.log(user_request);
 user_response.sendfile('text.html');
}
function approvelist(req, res) {
  console.log('approvelist called')
  res.redirect('approvelist.html')
}
function requestdate(req, res) {
  console.log('requestdate called')
  res.redirect('index.html')
}
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.get('/sap/opu/odata/SAP/ZWC_TOKEN_SRV2/*', getlist);
app.post('/sap/opu/odata/SAP/ZLEAVE_POST_DATE_SRV/*', postleave);
app.get('/sap/opu/odata/SAP/Z_LEAVE_SRV/*', getlist);

app.get('/approvelist', approvelist );
app.get('/request', requestdate);
app.listen(port);
console.log('Server started on port ' + port);