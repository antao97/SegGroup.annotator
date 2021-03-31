import * as THREE from "three";
import $ from "jquery";
import configs from "../configs.json";

var filenames;
var segIndices;
var segDicts;
var insSegs;
var insDicts;
var insIndices;
var insSem;

class MeshService {
  static myInstance = null;
  static getInstance() {
    if (MeshService.myInstance == null) {
      MeshService.myInstance = new MeshService();
    }
    return this.myInstance;
  }

  loadFileNames = path => {
    filenames = [];
    $.ajaxSettings.async = false; //必须加的，若不加返回的是""
    $.get (path, function (data)
      {
        for (var i = 0; i < data.length/(configs["filename_length"]+1); i++){
          filenames.push(data.substr(i*(configs["filename_length"]+1), configs["filename_length"]));
        }
        filenames.sort();
      });
    return filenames;
  };

  loadSegIndices = path => {
    segIndices = [];
    segDicts = {};
    $.ajaxSettings.async = false; //必须加的，若不加返回的是""
    $.getJSON (path, function (data)
      {
        segIndices = data.segIndices;
      });
    this.updateSegDicts();
    return segIndices;
  };

  updateSegDicts = () =>{
    for (var i = 0; i < segIndices.length; i++){
      if (typeof segDicts[segIndices[i]] === "undefined"){
        segDicts[segIndices[i]] = [i];
      }
      else{
        segDicts[segIndices[i]].push(i);
      }
    }
  };

  loadInstanceDicts = path => {
    insDicts = [];
    insSegs = [];
    insIndices = [];
    insSem = {};
    for (var i = 0; i < segIndices.length; i++){
      insIndices.push(-1);
    }
    $.ajaxSettings.async = false; //必须加的，若不加返回的是""
    $.getJSON (path, function (data)
      {
        insSegs = data.segGroups;
        for (var i = 0; i < insSegs.length; i++){
          for (var j = 0; j < insSegs[i].segments.length; j++){
            if (j === 0){
              insDicts[i] = segDicts[insSegs[i].segments[j]];
            }
            else{
              insDicts[i] = insDicts[i].concat(segDicts[insSegs[i].segments[j]]);
            }
            // console.log(segDicts[insSegs[i].segments[j]])
          }
          for (var k = 0; k < insDicts[i].length; k++){
            insIndices[insDicts[i][k]] = i;
          }
          insSem[i] = insSegs[i].label;
        }
      });
    // console.log(insSem);
    // console.log(insDicts);
    // console.log(insIndices);
    return insDicts;
  };

  segId2Dict = segId => {
    return segDicts[segId];
  };

  index2segId = i => {
    return segIndices[i];
  };

  index2Dict = i => {
    return segDicts[segIndices[i]];
  };

  addSegmentColor = (segId, mesh_mouse, color) =>{
    var dict = this.segId2Dict(segId);
    if (typeof dict !== "undefined"){
      for (var i = 0; i < dict.length; i++){
        mesh_mouse.geometry.attributes.color.setXYZ(dict[i], color[0], color[1], color[2]);
      }
    }
    return mesh_mouse;
  };

  removeSegmentColor = (segId, mesh_mouse, mesh) =>{
    var dict = this.segId2Dict(segId);
    if (typeof dict !== "undefined"){
      for (var i = 0; i < dict.length; i++){
        mesh_mouse.geometry.attributes.color.setXYZ(
          dict[i], 
          mesh.geometry.attributes.color.getX(dict[i]),
          mesh.geometry.attributes.color.getY(dict[i]),
          mesh.geometry.attributes.color.getZ(dict[i])
        );
      }
    }
    return mesh_mouse;
  };

  getSegmentMesh = (mesh_seg) => {
    for (var i = 0; i < segIndices.length; i++){
      mesh_seg.geometry.attributes.color.setXYZ(i, 1, 1, 1);
    }
    var color;
    for (i = 0; i < insSegs.length; i++){
      for (var j = 0; j < insSegs[i].segments.length; j++){
        color = [Math.random(), Math.random(), Math.random()];
        var segId = insSegs[i].segments[j];
        // console.log(segId);
        for (var k = 0; k < segDicts[segId].length; k++){
          mesh_seg.geometry.attributes.color.setXYZ(segDicts[segId][k], color[0], color[1], color[2]);
        }
      }
    }
    return mesh_seg;
  };

  getInstanceMesh = (mesh_ins) => {
    for (var i = 0; i < segIndices.length; i++){
      mesh_ins.geometry.attributes.color.setXYZ(i, 1, 1, 1);
    }
    var ins_bais = Math.floor(Math.random()*configs["labels"].length);
    var r, g, b;
    for (i = 0; i < insDicts.length; i++){
      if (i < configs["labels"].length){
        [r, g, b] = configs["labels"][(i+ins_bais)%configs["labels"].length]["color"];
        r = r/255;
        g = g/255;
        b = b/255;
      }
      else
        [r, g, b] = [Math.random(), Math.random(), Math.random()];
      for (var j = 0; j < insDicts[i].length; j++){
        mesh_ins.geometry.attributes.color.setXYZ(insDicts[i][j], r, g, b);
      }
    }
    return mesh_ins;
  };

  removeInstanceColor = (insId, mesh_ins) =>{
    var dict = insDicts[insId];
    if (typeof dict !== "undefined"){
      for (var i = 0; i < dict.length; i++){
        mesh_ins.geometry.attributes.color.setXYZ(dict[i], 1, 1, 1);
      }
    }
    return mesh_ins;
  };

  getInstanceNum = () => {
    if (typeof insSegs.length !== "undefined")
      return insSegs.length;
    else
      return 0;
  };

  initLabeledClass = () => {
    var labeled_class = [];
    for (var i = 0; i < this.getInstanceNum(); i++)
      labeled_class.push(0);
    return labeled_class;
  };

  segId2insId = segId => {
    var dict = this.segId2Dict(segId);
    return insIndices[dict[0]];
  };

  insId2Sem = insId => {
    if (insId !== -1)
      return insSem[insId];
    else
      return "None";
  };

  initSegLabelMesh = (mesh_seg_label) => {
    for (var i = 0; i < segIndices.length; i++){
      mesh_seg_label.geometry.attributes.color.setXYZ(i, 1, 1, 1);
    }
    return mesh_seg_label;
  };

  getSegAnnoMesh = (mesh_seg_anno, mesh_ins_hid, annos) => {
    for (var i = 0; i < segIndices.length; i++){
      mesh_seg_anno.geometry.attributes.color.setXYZ(i, 1, 1, 1);
    }
    var color;
    for (var insId in annos) {
      for (var segId in annos[insId]){
        var dict = this.segId2Dict(segId);
        color = [mesh_ins_hid.geometry.attributes.color.getX(dict[0]), mesh_ins_hid.geometry.attributes.color.getY(dict[0]), mesh_ins_hid.geometry.attributes.color.getZ(dict[0])];
        mesh_seg_anno = this.addSegmentColor(segId, mesh_seg_anno, color);
      }
    }
    return mesh_seg_anno;
  };

  getPointAnno = (mesh, annos) => {
    var pointAnnoList = [];
    for (var insId in annos) {
      for (var segId in annos[insId]){
        var sphereGeometry = new THREE.SphereBufferGeometry(0.04, 32, 32);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: "#FF0000" });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = mesh.geometry.attributes.position.getX(annos[insId][segId]);
        sphere.position.y = mesh.geometry.attributes.position.getY(annos[insId][segId]);
        sphere.position.z = mesh.geometry.attributes.position.getZ(annos[insId][segId]);
        pointAnnoList.push(sphere);
      }
    }
    return pointAnnoList;
  };

}

export default MeshService;