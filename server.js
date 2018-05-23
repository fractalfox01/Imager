const express = require('express');
const app = express();
const mongo = require('mongodb');
const ejs = require('ejs');
const http = require('http');
const https = require('https');

app.use('/styles', express.static(__dirname + '/public'));
app.set('view engine','ejs');
const port = 3000;
const url = process.env.URL;

function addQuery(qwry){
  console.log(qwry);
  mongo.connect(url)
    .then(function(db){
      let dbo = db.db('imager');
      dbo.collection('img-info').insertOne({'Query':qwry})
        .then(function(){
          console.log('Inserted new: ' + qwry);
        })
        .catch(function(err){
          console.log(err.stack);
        })
    })
    .catch(function(err){
      console.lgo(err.stack);
    })
}
function lookup(req, res){
  mongo.connect(url)
    .then(function(db){
      let dbo = db.db('imager');
      dbo.collection('img-info').find({}).toArray()
        .then(function(resp){
          res.status(200).set({'content-type':'application/json'});
          let myObj = {}
          for(var i = 0; i < resp.length; i++){
            myObj[i] = resp[i].Query;
          }
          res.json(myObj);
          res.end();
        })
        .catch(function(err){
          console.log(err.stack);
        })
    })
    .catch(function(err){
      console.lgo(err.stack);
    })
}

function tFetch(req, res, myurl){
  res.status(200).set({'content-type': 'application/json'});
  console.log("Incoming...");
  if(myurl.includes('https')){
    https.get(myurl, (resp) => {
      let rawd = '';
      resp.on('data', (chunk) => {
        //console.log(chunk.toString());
        rawd += chunk;
      });
      resp.on('end', () => {
        let tp1 = JSON.parse(rawd);
        let myObj = {};
          
        if(tp1.items){
          // myObj.items
          myObj.testing = tp1.items;
          console.log(myObj);
          res.json(myObj);
        }else{
          res.json({"Emtpy": "Image"});
        }
        res.end();
        console.log("Done");
      });
    });
  }else{
    http.get(myurl, (resp) => {
      let raw = '';
      resp.on('data', (chunk) => {
        console.log(chunk);
        raw += chunk;
      });
      resp.on('end', () => {
        let tp2 = JSON.parse(raw);
        let myObj = {};
        if(tp2.items){
          myObj.item_1 = tp2.items['0']['pagemap']['cse_image']['0']['src'];
          myObj.item_2 = tp2.items['1']['pagemap']['cse_image']['0']['src'];
          myObj.item_3 = tp2.items['2']['pagemap']['cse_image']['0']['src'];
        }
        res.json(myObj);
        res.end();
        console.log("Done2");
      });
    });
  }
}

function pFetch(req, res, myurl){
  res.status(200).set({'content-type': 'application/json'});
  console.log("Incoming...");
  if(myurl.includes('https')){
    https.get(myurl, (resp) => {
      let rawd = '';
      resp.on('data', (chunk) => {
        //console.log(chunk.toString());
        rawd += chunk;
      });
      resp.on('end', () => {
        let tp1 = JSON.parse(rawd);
        
        if(tp1.items){
          let myObj = {};
          for(var i = 0; i < 10; i++){
            try{
              myObj[i] = {
                'Url':tp1.items[i]['pagemap']['cse_image']['0']['src'],
                'Snippet':tp1.items[i]['snippet'],
                'Link':tp1.items[i]['link'],
                'Thumbnail':tp1.items[i]['pagemap']['cse_thumbnail']['0']['src']
              };
            }catch(err){
              myObj[i] = {
                'No Image Found For':i,
                'Snippet':tp1.items[i]['snippet'],
                'Link':tp1.items[i]['link']
              };
            }
          }
          res.json(myObj);
        }else{
          res.json({"Emtpy": "Image"});
        }
        res.end();
        console.log("Done");
      });
    });
  }
}

function reqtest(req, res){
  addQuery(req.query.q);
  if(req.query.offset){
    console.log("Offest: " + req.query.offset);
    let addr = "https://www.googleapis.com/customsearch/v1?key=" + process.env.KEY + "&cx=" + process.env.SEID + "&q=" + req.query.q + "&searchtype=image&start="+ req.query.offset +"&num=1&safe=high";
    //let addr = "https://www.google.com";
    tFetch(req, res, addr);
  }else{
    console.log("No offset: Default 1");
    let addr = "https://www.googleapis.com/customsearch/v1?key=" + process.env.KEY + "&cx=" + process.env.SEID + "&q=" + req.query.q + "&searchtype=image&start="+ 1 +"&num=1&safe=high";
    //let addr = "https://www.google.com";
    tFetch(req, res, addr);
  }
}

function fetch(req, res){
  addQuery(req.query.q);
  if(req.query.offset){
    console.log("Offest: " + req.query.offset);
    let addr = "https://www.googleapis.com/customsearch/v1?key=" + process.env.KEY + "&cx=" + process.env.SEID + "&q=" + req.query.q + "&searchtype=image&start="+ (req.query.offset * 10) +"&num=10&safe=high";
    pFetch(req, res, addr);
  }else{
    console.log("No offset: Default 1");
    let addr = "https://www.googleapis.com/customsearch/v1?key=" + process.env.KEY + "&cx=" + process.env.SEID + "&q=" + req.query.q + "&searchtype=image&num=10&safe=high";
    pFetch(req, res, addr);
  }
}
app.get('/view', function(req, res){
  lookup(req, res);
});

app.get('/test', function(req, res){
  // returns a single request
  reqtest(req, res);
});

app.get('/', function(req, res){
  if(req.query.q != undefined){
    fetch(req, res);
  }else{
    console.log(req.query.q != undefined);
    res.status(200).set({'content-type':'text/html'});
    res.render('index');
    res.end();
  }
  //verifyDB(req,res);
});

app.listen(port, function(){
  console.log("Server started on port ", port);
});