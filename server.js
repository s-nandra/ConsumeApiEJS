var express = require('express');
var request = require('superagent');
var username = "96eae456-b42d-4b5c-a4e5-d3bbc6ec28e0",
    password = "tcAOWExUV0Y2B3KExDSK";

// express app
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

 
function getAccessToken(req, res, next){
  request
    .post('https://api.vantage.online/application/loginsingle')
    .auth(username, password)
    .end(function(err, res) {
      
        // if response ok then
        req.access_token = res.body.Token
        
        next();
        // else
      
    })
}

app.get('/', function(req, res){
  res.render('index');
})

app.get('/customers', getAccessToken, function(req, res){
  request
    .get('https://api.vantage.online/customer')
    .set('Authorization', 'Bearer ' + req.access_token )
    .end(function(err, data) {
      // console.log('HERE',data);  
       if(data.status == 403){
          res.send(403, '403 Forbidden');
       }  else {
        var customers = data.body.value;
           console.log('customers', customers);
          res.render('customers', { customers: customers} );
       }
    })
})

app.listen(3030);