'use strict';

var http = require('http');
var fs = require("fs");
var cp = require('child_process');

var configs = require("./src/configs.json");

const PORT = configs["inter_port"];
const ALLOW_ANY_ORIGIN = 1;

var nop = () => {};
var server = http.createServer(onReq).listen(PORT);
console.log(server);

function onReq(req, res){
  if(ALLOW_ANY_ORIGIN)
    res.setHeader('Access-Control-Allow-Origin', '*');

  var data = Buffer.alloc(0);

  req.on('data', d => {
    data = Buffer.concat([data, d]);
  });
  // console.log(data);

  req.on('end', () => {
    processData(data)
      .then(status => {
        res.end(JSON.stringify({status}));
      }).catch(error => {
        error = error.toString();
        res.end(JSON.stringify({error}));
      });
  });
}

async function processData(data){
  var address, content;
  var type = data.slice(0, 1);
  if (type.toString() === "0") {
    address = "./public/data/info.json";
    content = data.slice(1);
  }
  if (type.toString() === "1") {
    var sceneNameBuff = data.slice(1, 13);
    address = "./public/data/label/" + sceneNameBuff + ".json";
    content = data.slice(13);
  }
  if ((type.toString() === "0") || (type.toString() === "1")) {
    fs.writeFile(address, content, function(err){
      if (err) {
        console.log(err);
      }
      else {
        console.log("Save in " + address + "!");
      }
    })
  }

  if (type.toString() === "2") {
    var sceneNameBuff = data.slice(1, 13);
    address = "./public/data/label/" + sceneNameBuff + ".json";
    fs.unlink(address, function(err){
      if(err){
        console.log(err);
      }
      else {
        console.log("Delete " + address + "!");
      }
    })
  }

}
