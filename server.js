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
    .post('https://api.vantage.online/application/loginsingle').auth(username, password).end(function(err, res) {
      if (res.body.Token) {  req.access_token = res.body.Token  
        next(); } else { res.send(401, 'Unauthorized'); } 
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
 
       if(data.status == 403){
          res.send(403, '403 Forbidden');
       }  else {
         var customers = data.body.value;
           //console.log('customers', customers);
          res.render('customers', { customers: customers} );
       }
    })
})

app.get('/customerDetail/:id', getAccessToken, function(req, res){
  request
    .get('https://api.vantage.online/customer').set('Authorization', 'Bearer ' + req.access_token )
    .end(function(err, data)
      {
 
       if(data.status == 403){ res.send(403, '403 Forbidden'); }  
       else { 
         var customers = data.body.value;   
         var customer = customers.filter((customer) => { return customer.Id == req.params.id })[0]
           res.render('customerDetail', {  
              cusId: customer.Id,
              cusName: customer.Name,
              cusAddress1: customer.Address1,
              cusAddress2: customer.Address2,
              cusAddress3: customer.Address3,
              cusTown: customer.Town,
              cusCounty: customer.County,
              cusPostCode: customer.PostCode,
              cusCountryCode: customer.CountryCode,
              cusCreatedDate: customer.CreatedDate,
              cusCreatedBy: customer.CreatedBy 
          });
        }
      })
 
})


/*
app.get('/customerDetail/:id', getAccessToken, function(req, res){
   request
    .get('https://api.vantage.online/customerperson').set('Authorization', 'Bearer ' + req.access_token )
    .end(function(err, data) 
    {
 
       if(data.status == 403){ res.send(403, '403 Forbidden'); }  
       else { 
         var customerpersons = data.body.value;
         var customerperson = customerpersons.filter((customerperson) => { return customerperson.CustomerId == req.params.id })[0]
         console.log('has this customerperson: ', customerperson);
          res.render('customerDetail', { cpTitle: customerperson.Title});
       }
    })
   
})

*/
 

app.listen(3030);