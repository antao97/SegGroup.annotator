import $ from "jquery";
import configs from "../configs.json";

// import * as fs from "browserify-fs";
// // var fs = require("fs");
// console.log(fs);

var state;

// var fs = require("fs-js");

class StateService {
  static myInstance = null;
  static getInstance() {
    if (StateService.myInstance == null) {
      StateService.myInstance = new StateService();
    }
    return this.myInstance;
  }

  loadState = path => {
    $.ajaxSettings.async = false; //必须加的，若不加返回的是""
    $.getJSON (path, function (data)
      {
        state = data;
      });
    return state;
  };

  updateState = (data) => {
    var nbuf = "0" + data;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + configs["host"] + ":" + configs["inter_port"].toString());
    xhr.send(nbuf);
  };

  saveAnnotation = (filename, data) => {
    var nbuf = "1" + filename + data;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + configs["host"] + ":" + configs["inter_port"].toString());
    xhr.send(nbuf);
  };

  deleteAnnotation = (filename) => {
    var nbuf = "2" + filename;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + configs["host"] + ":" + configs["inter_port"].toString());
    xhr.send(nbuf);
  };

}

export default StateService;