import $ from "jquery";

var annotations = {};

class LabelService {
  static myInstance = null;
  static getInstance() {
    if (LabelService.myInstance == null) {
      LabelService.myInstance = new LabelService();
    }
    return this.myInstance;
  }

  addAnnotation = (insId, segId, pointIndex) => {
    if (typeof annotations[insId] === "undefined") {
      annotations[insId] = {};
    }
    annotations[insId][segId] = pointIndex;
    return annotations;
  };

  getAnnotation = () => {
    return annotations;
  };

  removeAnnotation = (insId, segId) => {
    if (typeof annotations[insId][segId] !== "undefined"){
      delete annotations[insId][segId];
    }
    if (JSON.stringify(annotations[insId]) === "{}"){
      delete annotations[insId];
    }
    return annotations;
  };

  clearAnnotation = () => {
    annotations = {};
  };

  loadAnnotationJson = (filename) => {
    var path = "./data/label/" + filename + ".json";
    $.ajaxSettings.async = false; //必须加的，若不加返回的是""
    $.getJSON (path, function (data)
      {
        annotations = data;
      });
    if (typeof annotations === "undefined"){
      annotations = {};
    }
    return annotations;
  };

}

export default LabelService;