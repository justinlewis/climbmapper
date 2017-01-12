import React from 'react';
var ReactDOM = require('react-dom');

import { Map,
  Marker,
  Popup,
  TileLayer,
  Circle,
  CircleMarker,
  LayersControl,
  FeatureGroup,
  GeoJSON,
  ZoomControl } from 'react-leaflet';
import GeoJsonUpdatable from "./GeoJsonUpdatable.jsx"
import { setFeatureInfo, hoverFeatureInfo } from './actions/MapActions.js';

import BarChart from './BarChart.jsx';
// import LineChart from './charts/LineChart.js';
// import PieChart from './charts/PieChart.js';
// import RouteHeightPieChart from './charts/RouteHeightPieChart.js';



const TODOFILL = "#0a4958";
const CRAGFILL = "orange";
const TICKFILL = "#505050";
const SIMPLEAREAFILL = "red";
const SIMPLECRAGFILL = "orange";
const TODOFILLHOVER = "#138DA9";
const CRAGFILLHOVER = "#878787";
const TICKFILLHOVER = "#878787";
const TICKROUTETYPE = "TICK";
const TODOROUTETYPE = "TODO";

const getLocationSizeBucket = function(rtCount) {
  if(rtCount < 1){
    return 0
  }
  else if(rtCount < 3){
    return 3
  }
  else if(rtCount >= 3 && rtCount < 5){
    return 4
  }
  else if(rtCount >= 5 && rtCount < 7){
    return 6
  }
  else if(rtCount >= 7 && rtCount < 10){
    return 9
  }
  else if(rtCount >= 10 && rtCount < 20){
    return 15
  }
  else if(rtCount >= 20 && rtCount < 30){
    return 20
  }
  else if(rtCount >= 30 && rtCount < 40){
    return 25
  }
  else if(rtCount >= 40 && rtCount < 50){
    return 30
  }
  else if(rtCount >= 50 && rtCount < 60){
    return 35
  }
  else if(rtCount >= 60 && rtCount < 70){
    return 40
  }
  else if(rtCount >= 70 && rtCount < 100){
    return 45
  }
  else if(rtCount >= 100 && rtCount < 150){
    return 60
  }
  else if(rtCount >= 150){
    return 80
  }
}

var routeTypeFilter = 'ALL'

var areaTodoPtsDefaultStyle = {
    radius: 0,
    fillColor: TODOFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

const areaTickPtsDefaultStyle = {
    radius: 0,
    fillColor: TICKFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
}

const allAreaPtsDefaultStyle = {
    radius: 4,
    fillColor: SIMPLEAREAFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

const allCragPtsDefaultStyle = {
    radius: 4,
    fillColor: SIMPLECRAGFILL,
    stroke: false,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

class MapComponent extends React.Component {
    constructor(props){
		    super(props);

        this.todoAreaPtsCache = null;
        this.todoCragPtsCache = null;
        this.tickAreaPtsCache = null;

        this.state = {
          lat : 39.73,
          lng : -105,
          zoom : 3,
          todoAreaPts : {"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"features":[{"type":"Feature","properties":{"id":43,"area":"Devil's Tower","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-104.721760961,44.5894021524]}},{"type":"Feature","properties":{"id":8,"area":"Sleeping Rock aka Sheep's Nose Bouldering","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.19392163,39.1410444144]}},{"type":"Feature","properties":{"id":11,"area":"Eldorado Canyon SP","count":"50","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.287120748,39.9333633897]}},{"type":"Feature","properties":{"id":166,"area":"Eldorado Mountain","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.287475585938,39.919084444406]}},{"type":"Feature","properties":{"id":80,"area":"The Needles","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.4862312,36.1112817364]}},{"type":"Feature","properties":{"id":135,"area":"Trout Creek","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.10710144043,44.8022098946824]}},{"type":"Feature","properties":{"id":16,"area":"Independence Pass","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-106.697929309,39.119964176]}},{"type":"Feature","properties":{"id":39,"area":"Yosemite National Park","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-119.569104266,37.8746151974]}},{"type":"Feature","properties":{"id":3,"area":"Flatirons","count":"10","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.29268064,39.987329121]}},{"type":"Feature","properties":{"id":47,"area":"The Bugaboos","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-116.802018296,50.7595666629]}},{"type":"Feature","properties":{"id":148,"area":"Looking Glass Rock","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-82.7919387817383,35.2999958797244]}},{"type":"Feature","properties":{"id":14,"area":"Morrison Boulders","count":"14","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.186045185194,39.6521257678843]}},{"type":"Feature","properties":{"id":46,"area":"Estes Park Valley","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.545340396,40.3841768345]}},{"type":"Feature","properties":{"id":48,"area":"Winslow Wall","count":"9","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.664224002,34.9422661668]}},{"type":"Feature","properties":{"id":28,"area":"St. Vrain Canyons","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.270860064,40.2230118361]}},{"type":"Feature","properties":{"id":17,"area":"Index","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.573932538,47.819264167]}},{"type":"Feature","properties":{"id":83,"area":"The Homestead","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.780970242,33.1744117301]}},{"type":"Feature","properties":{"id":36,"area":"Indian Peaks","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.648943816,40.1008355249]}},{"type":"Feature","properties":{"id":15,"area":"Wind River Range","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.217241456,42.7830912413]}},{"type":"Feature","properties":{"id":151,"area":"Cathedral Spires Area","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.254516601562,39.4226685619832]}},{"type":"Feature","properties":{"id":77,"area":"San Rafael Swell","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.709766073,38.8744500391]}},{"type":"Feature","properties":{"id":30,"area":"North Cascades","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.009620507,48.4977766251]}},{"type":"Feature","properties":{"id":160,"area":"Fisher Towers","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.301862716675,38.7198717089364]}},{"type":"Feature","properties":{"id":50,"area":"Shelf Road","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.225784978,38.6304716503]}},{"type":"Feature","properties":{"id":33,"area":"RMNP - Rock","count":"27","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.711100666,40.3219923082]}},{"type":"Feature","properties":{"id":40,"area":"Smith Rock","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.145945856,44.3639541029]}},{"type":"Feature","properties":{"id":161,"area":"Kananaskis","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.148391723633,51.0167785019197]}},{"type":"Feature","properties":{"id":19,"area":"Joe's Valley","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.175571787,39.2767922248]}},{"type":"Feature","properties":{"id":51,"area":"Golden","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.226830713,39.7596730983]}},{"type":"Feature","properties":{"id":23,"area":"City of Rocks","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-113.72620088,42.0593997128]}},{"type":"Feature","properties":{"id":31,"area":"Sheep's Nose","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.193536186,39.1410017591]}},{"type":"Feature","properties":{"id":35,"area":"The Grenadiers","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-107.623149486,37.6307206713]}},{"type":"Feature","properties":{"id":76,"area":"Suicide Rock","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-116.69543208,33.7705239133]}},{"type":"Feature","properties":{"id":20,"area":"The Castle","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.381823306,39.310710117]}},{"type":"Feature","properties":{"id":44,"area":"Sedona Area","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.765093494,34.8668981803]}},{"type":"Feature","properties":{"id":37,"area":"Big Thompson Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.350526545,40.4242143549]}},{"type":"Feature","properties":{"id":34,"area":"Clear Creek Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.275232359,39.7422743456]}},{"type":"Feature","properties":{"id":82,"area":"Spearfish Canyon","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-103.85946569,44.4577147056]}},{"type":"Feature","properties":{"id":81,"area":"Central Sierra","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-120.035539409,38.4616484301]}},{"type":"Feature","properties":{"id":32,"area":"The Crestones","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.585959771,37.9682099772]}},{"type":"Feature","properties":{"id":25,"area":"Moab Area","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.550293545,38.5691103612]}},{"type":"Feature","properties":{"id":12,"area":"Vedauwoo","count":"17","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.379440495,41.1712483426]}},{"type":"Feature","properties":{"id":1,"area":"Boulder Canyon","count":"48","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.392478109,40.002038878]}},{"type":"Feature","properties":{"id":10,"area":"Alderfer/Three Sisters Park","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.348180282,39.6254135908]}},{"type":"Feature","properties":{"id":79,"area":"The Wet Mountains","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.191770843,38.1674429947]}},{"type":"Feature","properties":{"id":26,"area":"High Sierra","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.54499984,37.157061514]}},{"type":"Feature","properties":{"id":42,"area":"Red Rock","count":"14","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.465571134,36.1365490303]}},{"type":"Feature","properties":{"id":164,"area":"Lover's Leap","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.21327495575,39.6159703577025]}},{"type":"Feature","properties":{"id":18,"area":"Triassic","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.742354034,39.3361432375]}},{"type":"Feature","properties":{"id":134,"area":"The Gunks","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-74.1896438598633,41.7418587781142]}},{"type":"Feature","properties":{"id":78,"area":"Zion National Park","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-113.085829741,37.1739747388]}},{"type":"Feature","properties":{"id":150,"area":"Colorado National Monument ","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.724479675293,39.1022242249515]}},{"type":"Feature","properties":{"id":100,"area":"Matthews-Winters Park","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.211343765259,39.6852608104674]}},{"type":"Feature","properties":{"id":168,"area":"Red River Gorge","count":"11","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-85.8251953125,37.3701571840575]}},{"type":"Feature","properties":{"id":167,"area":"Unaweep Canyon","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.608436584473,38.8155024136138]}},{"type":"Feature","properties":{"id":158,"area":"Buffalo Creek","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.276317596436,39.3713313851305]}},{"type":"Feature","properties":{"id":13,"area":"Indian Creek","count":"36","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.555714101,38.0677559485]}},{"type":"Feature","properties":{"id":49,"area":"Mount Sir Donald","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-117.430796199,51.2555943402]}},{"type":"Feature","properties":{"id":22,"area":"North Table Mountain/Golden Cliffs","count":"13","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.217952728271,39.7697558493979]}},{"type":"Feature","properties":{"id":9,"area":"Mt. Evans","count":"12","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.643592126,39.5905338457]}},{"type":"Feature","properties":{"id":45,"area":"Blanca Peak","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.486110283,37.5773543856]}},{"type":"Feature","properties":{"id":27,"area":"Black Canyon of the Gunnison","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-107.747076491,38.5780403446]}},{"type":"Feature","properties":{"id":38,"area":"Joshua Tree National Park","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.909254936,33.8836295249]}},{"type":"Feature","properties":{"id":74,"area":"Bishop Area","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.396158825,37.3699959129]}},{"type":"Feature","properties":{"id":6,"area":"Thunder Ridge","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.217976675,39.198861745]}},{"type":"Feature","properties":{"id":149,"area":"Escalante Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.329486846924,38.6695623524907]}},{"type":"Feature","properties":{"id":29,"area":"Upper Dream Canyon","count":"11","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.409211601,40.009905828]}},{"type":"Feature","properties":{"id":2,"area":"Lumpy Ridge","count":"47","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.53992566,40.4091402072]}},{"type":"Feature","properties":{"id":21,"area":"Devil's Head","count":"28","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.102240136,39.2598380997]}},{"type":"Feature","properties":{"id":41,"area":"Castlewood Canyon SP","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-104.756451476,39.3432826379]}},{"type":"Feature","properties":{"id":75,"area":"Wasatch Range","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.651238549,40.5820951456]}},{"type":"Feature","properties":{"id":5,"area":"South Platte","count":"26","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.330025531,39.3456645626]}},{"type":"Feature","properties":{"id":7,"area":"Turkey Rocks","count":"9","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.2376065,39.1143079656]}}]},
          todoCragPts : {"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"features":[{"type":"Feature","properties":{"id":43,"area":"Devil's Tower","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-104.721760961,44.5894021524]}},{"type":"Feature","properties":{"id":8,"area":"Sleeping Rock aka Sheep's Nose Bouldering","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.19392163,39.1410444144]}},{"type":"Feature","properties":{"id":11,"area":"Eldorado Canyon SP","count":"50","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.287120748,39.9333633897]}},{"type":"Feature","properties":{"id":166,"area":"Eldorado Mountain","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.287475585938,39.919084444406]}},{"type":"Feature","properties":{"id":80,"area":"The Needles","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.4862312,36.1112817364]}},{"type":"Feature","properties":{"id":135,"area":"Trout Creek","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.10710144043,44.8022098946824]}},{"type":"Feature","properties":{"id":16,"area":"Independence Pass","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-106.697929309,39.119964176]}},{"type":"Feature","properties":{"id":39,"area":"Yosemite National Park","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-119.569104266,37.8746151974]}},{"type":"Feature","properties":{"id":3,"area":"Flatirons","count":"10","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.29268064,39.987329121]}},{"type":"Feature","properties":{"id":47,"area":"The Bugaboos","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-116.802018296,50.7595666629]}},{"type":"Feature","properties":{"id":148,"area":"Looking Glass Rock","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-82.7919387817383,35.2999958797244]}},{"type":"Feature","properties":{"id":14,"area":"Morrison Boulders","count":"14","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.186045185194,39.6521257678843]}},{"type":"Feature","properties":{"id":46,"area":"Estes Park Valley","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.545340396,40.3841768345]}},{"type":"Feature","properties":{"id":48,"area":"Winslow Wall","count":"9","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.664224002,34.9422661668]}},{"type":"Feature","properties":{"id":28,"area":"St. Vrain Canyons","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.270860064,40.2230118361]}},{"type":"Feature","properties":{"id":17,"area":"Index","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.573932538,47.819264167]}},{"type":"Feature","properties":{"id":83,"area":"The Homestead","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.780970242,33.1744117301]}},{"type":"Feature","properties":{"id":36,"area":"Indian Peaks","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.648943816,40.1008355249]}},{"type":"Feature","properties":{"id":15,"area":"Wind River Range","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.217241456,42.7830912413]}},{"type":"Feature","properties":{"id":151,"area":"Cathedral Spires Area","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.254516601562,39.4226685619832]}},{"type":"Feature","properties":{"id":77,"area":"San Rafael Swell","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.709766073,38.8744500391]}},{"type":"Feature","properties":{"id":30,"area":"North Cascades","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.009620507,48.4977766251]}},{"type":"Feature","properties":{"id":160,"area":"Fisher Towers","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.301862716675,38.7198717089364]}},{"type":"Feature","properties":{"id":50,"area":"Shelf Road","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.225784978,38.6304716503]}},{"type":"Feature","properties":{"id":33,"area":"RMNP - Rock","count":"27","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.711100666,40.3219923082]}},{"type":"Feature","properties":{"id":40,"area":"Smith Rock","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.145945856,44.3639541029]}},{"type":"Feature","properties":{"id":161,"area":"Kananaskis","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.148391723633,51.0167785019197]}},{"type":"Feature","properties":{"id":19,"area":"Joe's Valley","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.175571787,39.2767922248]}},{"type":"Feature","properties":{"id":51,"area":"Golden","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.226830713,39.7596730983]}},{"type":"Feature","properties":{"id":23,"area":"City of Rocks","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-113.72620088,42.0593997128]}},{"type":"Feature","properties":{"id":31,"area":"Sheep's Nose","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.193536186,39.1410017591]}},{"type":"Feature","properties":{"id":35,"area":"The Grenadiers","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-107.623149486,37.6307206713]}},{"type":"Feature","properties":{"id":76,"area":"Suicide Rock","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-116.69543208,33.7705239133]}},{"type":"Feature","properties":{"id":20,"area":"The Castle","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.381823306,39.310710117]}},{"type":"Feature","properties":{"id":44,"area":"Sedona Area","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.765093494,34.8668981803]}},{"type":"Feature","properties":{"id":37,"area":"Big Thompson Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.350526545,40.4242143549]}},{"type":"Feature","properties":{"id":34,"area":"Clear Creek Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.275232359,39.7422743456]}},{"type":"Feature","properties":{"id":82,"area":"Spearfish Canyon","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-103.85946569,44.4577147056]}},{"type":"Feature","properties":{"id":81,"area":"Central Sierra","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-120.035539409,38.4616484301]}},{"type":"Feature","properties":{"id":32,"area":"The Crestones","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.585959771,37.9682099772]}},{"type":"Feature","properties":{"id":25,"area":"Moab Area","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.550293545,38.5691103612]}},{"type":"Feature","properties":{"id":12,"area":"Vedauwoo","count":"17","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.379440495,41.1712483426]}},{"type":"Feature","properties":{"id":1,"area":"Boulder Canyon","count":"48","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.392478109,40.002038878]}},{"type":"Feature","properties":{"id":10,"area":"Alderfer/Three Sisters Park","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.348180282,39.6254135908]}},{"type":"Feature","properties":{"id":79,"area":"The Wet Mountains","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.191770843,38.1674429947]}},{"type":"Feature","properties":{"id":26,"area":"High Sierra","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.54499984,37.157061514]}},{"type":"Feature","properties":{"id":42,"area":"Red Rock","count":"14","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.465571134,36.1365490303]}},{"type":"Feature","properties":{"id":164,"area":"Lover's Leap","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.21327495575,39.6159703577025]}},{"type":"Feature","properties":{"id":18,"area":"Triassic","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.742354034,39.3361432375]}},{"type":"Feature","properties":{"id":134,"area":"The Gunks","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-74.1896438598633,41.7418587781142]}},{"type":"Feature","properties":{"id":78,"area":"Zion National Park","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-113.085829741,37.1739747388]}},{"type":"Feature","properties":{"id":150,"area":"Colorado National Monument ","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.724479675293,39.1022242249515]}},{"type":"Feature","properties":{"id":100,"area":"Matthews-Winters Park","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.211343765259,39.6852608104674]}},{"type":"Feature","properties":{"id":168,"area":"Red River Gorge","count":"11","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-85.8251953125,37.3701571840575]}},{"type":"Feature","properties":{"id":167,"area":"Unaweep Canyon","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.608436584473,38.8155024136138]}},{"type":"Feature","properties":{"id":158,"area":"Buffalo Creek","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.276317596436,39.3713313851305]}},{"type":"Feature","properties":{"id":13,"area":"Indian Creek","count":"36","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.555714101,38.0677559485]}},{"type":"Feature","properties":{"id":49,"area":"Mount Sir Donald","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-117.430796199,51.2555943402]}},{"type":"Feature","properties":{"id":22,"area":"North Table Mountain/Golden Cliffs","count":"13","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.217952728271,39.7697558493979]}},{"type":"Feature","properties":{"id":9,"area":"Mt. Evans","count":"12","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.643592126,39.5905338457]}},{"type":"Feature","properties":{"id":45,"area":"Blanca Peak","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.486110283,37.5773543856]}},{"type":"Feature","properties":{"id":27,"area":"Black Canyon of the Gunnison","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-107.747076491,38.5780403446]}},{"type":"Feature","properties":{"id":38,"area":"Joshua Tree National Park","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.909254936,33.8836295249]}},{"type":"Feature","properties":{"id":74,"area":"Bishop Area","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.396158825,37.3699959129]}},{"type":"Feature","properties":{"id":6,"area":"Thunder Ridge","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.217976675,39.198861745]}},{"type":"Feature","properties":{"id":149,"area":"Escalante Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.329486846924,38.6695623524907]}},{"type":"Feature","properties":{"id":29,"area":"Upper Dream Canyon","count":"11","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.409211601,40.009905828]}},{"type":"Feature","properties":{"id":2,"area":"Lumpy Ridge","count":"47","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.53992566,40.4091402072]}},{"type":"Feature","properties":{"id":21,"area":"Devil's Head","count":"28","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.102240136,39.2598380997]}},{"type":"Feature","properties":{"id":41,"area":"Castlewood Canyon SP","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-104.756451476,39.3432826379]}},{"type":"Feature","properties":{"id":75,"area":"Wasatch Range","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.651238549,40.5820951456]}},{"type":"Feature","properties":{"id":5,"area":"South Platte","count":"26","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.330025531,39.3456645626]}},{"type":"Feature","properties":{"id":7,"area":"Turkey Rocks","count":"9","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.2376065,39.1143079656]}}]},
          tickAreaPts : {"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"features":[{"type":"Feature","properties":{"id":43,"area":"Devil's Tower","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-104.721760961,44.5894021524]}},{"type":"Feature","properties":{"id":8,"area":"Sleeping Rock aka Sheep's Nose Bouldering","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.19392163,39.1410444144]}},{"type":"Feature","properties":{"id":11,"area":"Eldorado Canyon SP","count":"50","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.287120748,39.9333633897]}},{"type":"Feature","properties":{"id":166,"area":"Eldorado Mountain","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.287475585938,39.919084444406]}},{"type":"Feature","properties":{"id":80,"area":"The Needles","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.4862312,36.1112817364]}},{"type":"Feature","properties":{"id":135,"area":"Trout Creek","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.10710144043,44.8022098946824]}},{"type":"Feature","properties":{"id":16,"area":"Independence Pass","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-106.697929309,39.119964176]}},{"type":"Feature","properties":{"id":39,"area":"Yosemite National Park","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-119.569104266,37.8746151974]}},{"type":"Feature","properties":{"id":3,"area":"Flatirons","count":"10","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.29268064,39.987329121]}},{"type":"Feature","properties":{"id":47,"area":"The Bugaboos","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-116.802018296,50.7595666629]}},{"type":"Feature","properties":{"id":148,"area":"Looking Glass Rock","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-82.7919387817383,35.2999958797244]}},{"type":"Feature","properties":{"id":14,"area":"Morrison Boulders","count":"14","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.186045185194,39.6521257678843]}},{"type":"Feature","properties":{"id":46,"area":"Estes Park Valley","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.545340396,40.3841768345]}},{"type":"Feature","properties":{"id":48,"area":"Winslow Wall","count":"9","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.664224002,34.9422661668]}},{"type":"Feature","properties":{"id":28,"area":"St. Vrain Canyons","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.270860064,40.2230118361]}},{"type":"Feature","properties":{"id":17,"area":"Index","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.573932538,47.819264167]}},{"type":"Feature","properties":{"id":83,"area":"The Homestead","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.780970242,33.1744117301]}},{"type":"Feature","properties":{"id":36,"area":"Indian Peaks","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.648943816,40.1008355249]}},{"type":"Feature","properties":{"id":15,"area":"Wind River Range","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.217241456,42.7830912413]}},{"type":"Feature","properties":{"id":151,"area":"Cathedral Spires Area","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.254516601562,39.4226685619832]}},{"type":"Feature","properties":{"id":77,"area":"San Rafael Swell","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.709766073,38.8744500391]}},{"type":"Feature","properties":{"id":30,"area":"North Cascades","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.009620507,48.4977766251]}},{"type":"Feature","properties":{"id":160,"area":"Fisher Towers","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.301862716675,38.7198717089364]}},{"type":"Feature","properties":{"id":50,"area":"Shelf Road","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.225784978,38.6304716503]}},{"type":"Feature","properties":{"id":33,"area":"RMNP - Rock","count":"27","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.711100666,40.3219923082]}},{"type":"Feature","properties":{"id":40,"area":"Smith Rock","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-121.145945856,44.3639541029]}},{"type":"Feature","properties":{"id":161,"area":"Kananaskis","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.148391723633,51.0167785019197]}},{"type":"Feature","properties":{"id":19,"area":"Joe's Valley","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.175571787,39.2767922248]}},{"type":"Feature","properties":{"id":51,"area":"Golden","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.226830713,39.7596730983]}},{"type":"Feature","properties":{"id":23,"area":"City of Rocks","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-113.72620088,42.0593997128]}},{"type":"Feature","properties":{"id":31,"area":"Sheep's Nose","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.193536186,39.1410017591]}},{"type":"Feature","properties":{"id":35,"area":"The Grenadiers","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-107.623149486,37.6307206713]}},{"type":"Feature","properties":{"id":76,"area":"Suicide Rock","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-116.69543208,33.7705239133]}},{"type":"Feature","properties":{"id":20,"area":"The Castle","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.381823306,39.310710117]}},{"type":"Feature","properties":{"id":44,"area":"Sedona Area","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.765093494,34.8668981803]}},{"type":"Feature","properties":{"id":37,"area":"Big Thompson Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.350526545,40.4242143549]}},{"type":"Feature","properties":{"id":34,"area":"Clear Creek Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.275232359,39.7422743456]}},{"type":"Feature","properties":{"id":82,"area":"Spearfish Canyon","count":"6","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-103.85946569,44.4577147056]}},{"type":"Feature","properties":{"id":81,"area":"Central Sierra","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-120.035539409,38.4616484301]}},{"type":"Feature","properties":{"id":32,"area":"The Crestones","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.585959771,37.9682099772]}},{"type":"Feature","properties":{"id":25,"area":"Moab Area","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.550293545,38.5691103612]}},{"type":"Feature","properties":{"id":12,"area":"Vedauwoo","count":"17","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.379440495,41.1712483426]}},{"type":"Feature","properties":{"id":1,"area":"Boulder Canyon","count":"48","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.392478109,40.002038878]}},{"type":"Feature","properties":{"id":10,"area":"Alderfer/Three Sisters Park","count":"16","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.348180282,39.6254135908]}},{"type":"Feature","properties":{"id":79,"area":"The Wet Mountains","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.191770843,38.1674429947]}},{"type":"Feature","properties":{"id":26,"area":"High Sierra","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.54499984,37.157061514]}},{"type":"Feature","properties":{"id":42,"area":"Red Rock","count":"14","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.465571134,36.1365490303]}},{"type":"Feature","properties":{"id":164,"area":"Lover's Leap","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.21327495575,39.6159703577025]}},{"type":"Feature","properties":{"id":18,"area":"Triassic","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-110.742354034,39.3361432375]}},{"type":"Feature","properties":{"id":134,"area":"The Gunks","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-74.1896438598633,41.7418587781142]}},{"type":"Feature","properties":{"id":78,"area":"Zion National Park","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-113.085829741,37.1739747388]}},{"type":"Feature","properties":{"id":150,"area":"Colorado National Monument ","count":"5","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.724479675293,39.1022242249515]}},{"type":"Feature","properties":{"id":100,"area":"Matthews-Winters Park","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.211343765259,39.6852608104674]}},{"type":"Feature","properties":{"id":168,"area":"Red River Gorge","count":"11","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-85.8251953125,37.3701571840575]}},{"type":"Feature","properties":{"id":167,"area":"Unaweep Canyon","count":"7","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.608436584473,38.8155024136138]}},{"type":"Feature","properties":{"id":158,"area":"Buffalo Creek","count":"4","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.276317596436,39.3713313851305]}},{"type":"Feature","properties":{"id":13,"area":"Indian Creek","count":"36","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-109.555714101,38.0677559485]}},{"type":"Feature","properties":{"id":49,"area":"Mount Sir Donald","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-117.430796199,51.2555943402]}},{"type":"Feature","properties":{"id":22,"area":"North Table Mountain/Golden Cliffs","count":"13","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.217952728271,39.7697558493979]}},{"type":"Feature","properties":{"id":9,"area":"Mt. Evans","count":"12","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.643592126,39.5905338457]}},{"type":"Feature","properties":{"id":45,"area":"Blanca Peak","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.486110283,37.5773543856]}},{"type":"Feature","properties":{"id":27,"area":"Black Canyon of the Gunnison","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-107.747076491,38.5780403446]}},{"type":"Feature","properties":{"id":38,"area":"Joshua Tree National Park","count":"2","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-115.909254936,33.8836295249]}},{"type":"Feature","properties":{"id":74,"area":"Bishop Area","count":"1","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-118.396158825,37.3699959129]}},{"type":"Feature","properties":{"id":6,"area":"Thunder Ridge","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.217976675,39.198861745]}},{"type":"Feature","properties":{"id":149,"area":"Escalante Canyon","count":"19","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-108.329486846924,38.6695623524907]}},{"type":"Feature","properties":{"id":29,"area":"Upper Dream Canyon","count":"11","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.409211601,40.009905828]}},{"type":"Feature","properties":{"id":2,"area":"Lumpy Ridge","count":"47","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.53992566,40.4091402072]}},{"type":"Feature","properties":{"id":21,"area":"Devil's Head","count":"28","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.102240136,39.2598380997]}},{"type":"Feature","properties":{"id":41,"area":"Castlewood Canyon SP","count":"3","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-104.756451476,39.3432826379]}},{"type":"Feature","properties":{"id":75,"area":"Wasatch Range","count":"8","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-111.651238549,40.5820951456]}},{"type":"Feature","properties":{"id":5,"area":"South Platte","count":"26","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.330025531,39.3456645626]}},{"type":"Feature","properties":{"id":7,"area":"Turkey Rocks","count":"9","areatype":"TODO"},"geometry":{"type":"Point","coordinates":[-105.2376065,39.1143079656]}}]},
          crags : null,
          areas : null,
          ticks : null,
          todos : null,
          todoLayerStyle : areaTodoPtsDefaultStyle,
          tickLayerStyle : areaTickPtsDefaultStyle
        };

        this.setTodoAreaPtsCache = function(areas) {
          this.todoAreaPtsCache = areas;
        }

        this.getTodoAreaPtsCache = function() {
          return this.todoAreaPtsCache;
        }

        this.setTickAreaPtsCache = function(areas) {
          this.tickAreaPtsCache = areas;
        }

        this.getTickAreaPtsCache = function() {
          return this.tickAreaPtsCache;
        }
    }

    componentWillReceiveProps() {

    }

    componentDidMount() {
    		this.toDoAreaReq = $.get("todoareas", function (result) {
    			this.setTodoAreaPtsCache(result);
    		}.bind(this), "json");


    		this.toDoCragReq = $.get("todocrags", function (result) {
    			this.setState({
    				todoCragPts: result
    			});
    		}.bind(this), "json");


    		this.tickAreaReq = $.get("tickareas", function (result) {
    			this.setTickAreaPtsCache(result);
    			this.setTimeSlider();
    		}.bind(this), "json");


    		this.cragsReq = $.get("crags", function (result) {
    			this.setState({
    				crags: result
    			});
    		}.bind(this), "json");


    		this.areasReq = $.get("areas", function (result) {
    			this.setState({
    				areas: result
    			});

    			this.setSearchBar(this.state.areas.features);
    		}.bind(this), "json");


    		this.ticksReq = $.get("ticks", function (result) {
    			this.setState({
    				    ticks: result
    			});

          this.processRoutes(this.state.ticks["routes"], TICKROUTETYPE);
    		}.bind(this), "json");


    		this.todosReq = $.get("todos", function (result) {
    				this.setState({
    				      todos: result
    				});

            this.processRoutes(this.state.todos["routes"], TODOROUTETYPE);
    		}.bind(this), "json");


    		// this.missingAreasReq = $.get("missingareas", function (result) {
        //
    		// 	this.setState({
    		// 		missingareas: result
    		// 	});
        //
    		// 	reportMissingAreas(this.state.missingareas);
        //
    		// }.bind(this), "json");


        // var areaTodoPtsDefaultStyle = this.getTodoStyle(feature);

        // var getTodoStyle = function(test, test2) {
        //   return {
        //       radius: getLocationSizeBucket(layer),
        //       fillColor: "#0a4958",
        //       stroke: false,
        //       weight: 1,
        //       opacity: 1,
        //       fillOpacity: 0.8
        //   }
        // }

    		////
    		// Process route data
    		// content type can be 'TODO' or 'TICK'
    		////
    		this.processRoutes = function(routesArr, contentType) {
    				for(var rtI=0; rtI<routesArr.length; rtI++){
    					var route = routesArr[rtI];

    					if(contentType === TODOROUTETYPE){
    						route.routeCategory = TODOROUTETYPE;
    						this.setToDoLocationRouteAttributes(route);
    						this.setCragLocationRouteAttributes(route);
    					}
    					else if(contentType === TICKROUTETYPE){
    						route.routeCategory = TICKROUTETYPE;
    						this.setTickLocationRouteAttributes(route);
    					}
    				}

    				this.setToDoLocationRouteFrequency();
    				this.setCragLocationRouteFrequency();
    				this.setTickLocationRouteFrequency();
    		}


    		////
    		// Set the types (trad, sport, boulder, etc...) and the route tracking array on the location objects
    		//
    		////
    		this.setToDoLocationRouteAttributes = function(route) {

    			// @todoAreaPts
          let todoAreaPts = this.getTodoAreaPtsCache();
    			for(var n=0; n<todoAreaPts.features.length; n++){
    				var currAreaId = todoAreaPts.features[n].properties.id;

    				if(!todoAreaPts.features[n].properties.customRouteArr){
    					todoAreaPts.features[n].properties.customRouteArr = [];
    				}
    				if(!todoAreaPts.features[n].properties.customTradCt){
    					todoAreaPts.features[n].properties.customTradCt = 0;
    				}
    				if(!todoAreaPts.features[n].properties.customSportCt){
    					todoAreaPts.features[n].properties.customSportCt = 0;
    				}
    				if(!todoAreaPts.features[n].properties.customBoulderCt){
    					todoAreaPts.features[n].properties.customBoulderCt = 0;
    				}
    				if(!todoAreaPts.features[n].properties.customAlpineCt){
    					todoAreaPts.features[n].properties.customAlpineCt = 0;
    				}

    				if(currAreaId === route.area){
    					todoAreaPts.features[n].properties.customRouteArr.push(route);

    					var type = String(route.type ? String(route.type) : 'n/a').trim();
    					if(type.toLowerCase() === "trad"){
    						todoAreaPts.features[n].properties.customTradCt = todoAreaPts.features[n].properties.customTradCt + 1;
    					}
    					else if(type.toLowerCase() === "sport"){
    						todoAreaPts.features[n].properties.customSportCt = todoAreaPts.features[n].properties.customSportCt + 1;
    					}
    					else if(type.toLowerCase() === "boulder"){
    						todoAreaPts.features[n].properties.customBoulderCt = todoAreaPts.features[n].properties.customBoulderCt + 1;
    					}
    					else if(type.toLowerCase() === "alpine"){
    						todoAreaPts.features[n].properties.customAlpineCt = todoAreaPts.features[n].properties.customAlpineCt + 1;
    					}
    				}
    			}
    		}


    		////
    		// Set the types (trad, sport, boulder, etc...) and the route tracking array on the location objects
    		//
    		////
    		this.setCragLocationRouteAttributes = function(route) {

    			if(route.crag){
    				// @todoCragPts
            let todoCragPts = this.state.todoCragPts;
    				for(let n=0; n<todoCragPts.features.length; n++){
    					var currAreaId = todoCragPts.features[n].properties.id;

    					if(!todoCragPts.features[n].properties.customRouteArr){
    						todoCragPts.features[n].properties.customRouteArr = [];
    					}
    					if(!todoCragPts.features[n].properties.customTradCt){
    						todoCragPts.features[n].properties.customTradCt = 0;
    					}
    					if(!todoCragPts.features[n].properties.customSportCt){
    						todoCragPts.features[n].properties.customSportCt = 0;
    					}
    					if(!todoCragPts.features[n].properties.customBoulderCt){
    						todoCragPts.features[n].properties.customBoulderCt = 0;
    					}
    					if(!todoCragPts.features[n].properties.customAlpineCt){
    						todoCragPts.features[n].properties.customAlpineCt = 0;
    					}

    					if(currAreaId === route.crag){
    						todoCragPts.features[n].properties.customRouteArr.push(route);

    						var type = String(route.type ? String(route.type) : 'n/a').trim();

    						if(type.toLowerCase() === "trad"){
    							todoCragPts.features[n].properties.customTradCt = todoCragPts.features[n].properties.customTradCt + 1;
    						}
    						else if(type.toLowerCase() === "sport"){
    							todoCragPts.features[n].properties.customSportCt = todoCragPts.features[n].properties.customSportCt + 1;
    						}
    						else if(type.toLowerCase() === "boulder"){
    							todoCragPts.features[n].properties.customBoulderCt = todoCragPts.features[n].properties.customBoulderCt + 1;
    						}
    						else if(type.toLowerCase() === "alpine"){
    							todoCragPts.features[n].properties.customAlpineCt = todoCragPts.features[n].properties.customAlpineCt + 1;
    						}
    					}
    				}
    			}
    		}


    		////
    		// Sets custom attributes of ticks on locations.
    		//
    		// @route - a route representing either a tick or a todo
    		////
    		this.setTickLocationRouteAttributes = function(route) {

    			// @tickAreaPts
          let tickAreaPts = this.getTickAreaPtsCache();
    			for(let n=0; n<tickAreaPts.features.length; n++){
    				var currAreaId = tickAreaPts.features[n].properties.id;

    				if(!tickAreaPts.features[n].properties.customTicksArr){
    					tickAreaPts.features[n].properties.customTicksArr = [];
    				}
    				if(!tickAreaPts.features[n].properties.customTradCt){
    					tickAreaPts.features[n].properties.customTradCt = 0;
    				}
    				if(!tickAreaPts.features[n].properties.customSportCt){
    					tickAreaPts.features[n].properties.customSportCt = 0;
    				}
    				if(!tickAreaPts.features[n].properties.customBoulderCt){
    					tickAreaPts.features[n].properties.customBoulderCt = 0;
    				}
    				if(!tickAreaPts.features[n].properties.customAlpineCt){
    					tickAreaPts.features[n].properties.customAlpineCt = 0;
    				}

    				if(currAreaId === route.area){
    					var type = String(route.type ? String(route.type) : 'n/a').trim();
    					if(type.toLowerCase() === "trad"){
    						tickAreaPts.features[n].properties.customTradCt = tickAreaPts.features[n].properties.customTradCt + 1;
    					}
    					else if(type.toLowerCase() === "sport"){
    						tickAreaPts.features[n].properties.customSportCt = tickAreaPts.features[n].properties.customSportCt + 1;
    					}
    					else if(type.toLowerCase() === "boulder"){
    						tickAreaPts.features[n].properties.customBoulderCt = tickAreaPts.features[n].properties.customBoulderCt + 1;
    					}
    					else if(type.toLowerCase() === "alpine"){
    						tickAreaPts.features[n].properties.customAlpineCt = tickAreaPts.features[n].properties.customAlpineCt + 1;
    					}
    				}


    				if(currAreaId === route.area){
    					tickAreaPts.features[n].properties.customTicksArr.push(route);
    				}
    			}
    		}

    		////
    		// Set the frequency of ticks on locations that will dictate the point size.
    		//
    		////
    		this.setTickLocationRouteFrequency = function() {

    			// @tickAreaPts
          let cachedTickAreaPts = this.getTickAreaPtsCache();
    			for(let n=0; n<cachedTickAreaPts.features.length; n++){
    				var currAreaId = cachedTickAreaPts.features[n].properties.id;

    				cachedTickAreaPts.features[n].properties.customTicksCt = 0;

    				cachedTickAreaPts.features[n].properties.customTicksCt = cachedTickAreaPts.features[n].properties.count;
    			}

          this.setState({
            tickAreaPts: cachedTickAreaPts,
            tickLayerStyle : getModifiedStyle.bind(null, this, 'ALL', areaTickPtsDefaultStyle)
          });
    		}


    		////
    		// Set the frequency of todos on locations that will dictate the point size.
    		//
    		////
    		this.setToDoLocationRouteFrequency = function() {

          var cachedTodoAreaPts = this.getTodoAreaPtsCache();
    			for(var n=0; n<cachedTodoAreaPts.features.length; n++){
    				var currAreaId = cachedTodoAreaPts.features[n].properties.id;

    				// create or reset var to ensure a clean ct
    				cachedTodoAreaPts.features[n].properties.customRouteCt = 0;

    				cachedTodoAreaPts.features[n].properties.customRouteCt = cachedTodoAreaPts.features[n].properties.count;
    			}
          this.setState({
            todoAreaPts: cachedTodoAreaPts,
            todoLayerStyle : getModifiedStyle.bind(null, this, 'ALL', areaTodoPtsDefaultStyle)
          });
    		}


        // getModifiedStyle.bind(null, this, 'ALL')
        function getModifiedStyle(thisRef, filter, currentStyleObj, feature) {
            var radiusForType = 10;
            switch (filter.toUpperCase()) {
              case 'ALL':
                // customRouteCt is currently ToDo frequency and will take priority over existing area points
                if(feature.properties.customRouteCt > 0){
                  radiusForType = getLocationSizeBucket(feature.properties.customRouteCt);
                }

                if(feature.properties.customTicksCt > 0){
                  radiusForType = getLocationSizeBucket(feature.properties.customTicksCt);
                }
                break;
              case 'TRAD':
                if(feature.properties.customTradCt > 0){
                  radiusForType = getLocationSizeBucket(feature.properties.customTradCt);
                }
                break;
              case 'SPORT':
                if(layer.feature.properties.customSportCt > 0){
                  radiusForType = getLocationSizeBucket(feature.properties.customSportCt);
                }
                break;
              case 'BOULDER':
                if(layer.feature.properties.customBoulderCt > 0){
                  radiusForType = getLocationSizeBucket(feature.properties.customBoulderCt);
                }
                break;
              case 'ALPINE':
                if(layer.feature.properties.customAlpineCt > 0){
                  radiusForType = getLocationSizeBucket(feature.properties.customAlpineCt);
                }
                break;
            }
            currentStyleObj.radius = radiusForType;

            return currentStyleObj;
        }


    		////
    		// Set the frequency of crags on locations that will dictate the point size.
    		//
    		////
    		this.setCragLocationRouteFrequency = function() {

    			// @todoCragPts
          let todoCragPts = this.state.todoCragPts;
    			for(let n=0; n<todoCragPts.features.length; n++){
    				var currAreaId = todoCragPts.features[n].properties.id;

    				// create or reset var to ensure a clean ct
    				todoCragPts.features[n].properties.customRouteCt = 0;

    				todoCragPts.features[n].properties.customRouteCt = todoCragPts.features[n].properties.count;
    			}
    		}


        ////
        // Sets the size of the location points respective to the amount of climbs in that area
        // TODO: better check for ticks vs. todos
        //
        // NOTE: only resizes areas that are currently added to the map.
        //
        // @param filter - a filter keyword that filters the radius by route type.
        ////




        this.setTimeSlider = function() {
          var allTickArr = [];
          for(var n=0; n<this.state.tickAreaPts.features.length; n++){
            var tickArr = this.state.tickAreaPts.features[n].properties.customTicksArr;

            if(tickArr){
              for(var d=0; d<tickArr.length; d++){
                allTickArr.push(new Date(tickArr[d].date));
              }
            }
          }

          var sortDatesAscending = function (date1, date2) {
            // This is a comparison function that will result in dates being sorted in
            // ASCENDING order.
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
            return 0;
          };

          var sortedAllTickArr = allTickArr.sort(sortDatesAscending);

          $("#tick-slider").slider({
              range: "min",
              value: allTickArr.length,
              min: 1,
              max: allTickArr.length-1,
              create: function( event, ui ) {
                  // A silly hack because the slider is appending a ghostly empty <p> element to my label. No time to look deeper now.
                  if($("#time-slider-label").next("p").text().trim().length === 0){
                    $("#time-slider-label").next("p").remove();
                  }
              },
              slide: function( event, ui ) {
                var sliderPos = ui.value;
                var selectedDate = sortedAllTickArr[sliderPos];

                if($("#tick-time-chart")){
                  $("#tick-time-chart").remove()
                }

                if(selectedDate){

                  if(!$("#chart-row-1").is(':visible')){
                $("#chart-row-1").show();
              }

                $("#chart-row-1").append('<div id="tick-time-chart" ></div>');
                var lineChart = new LineChart(tickAreaPts.features, selectedDate, "#tick-time-chart", $("#tick-time-chart").parent().width());
                lineChart.build();

                var tickLocs = tickAreaPts.features;
                var rtsCt = 0;
                for(var t=0; t<tickLocs.length; t++){
                  var thisLoc = tickLocs[t];
                  var thisLocTicks = thisLoc.properties.customTicksArr;
                  var laterThanTicksCt = 0;

                  for(var i=0; i<thisLocTicks.length; i++){
                    if(new Date(thisLocTicks[i].date) > selectedDate){
                      laterThanTicksCt = laterThanTicksCt + 1;
                    }
                    else{
                      rtsCt = rtsCt + 1;
                    }
                  }

                  var newRadius = getLocationSizeBucket(thisLocTicks.length - laterThanTicksCt);

                  map.eachLayer(function (layer) {
                    if(layer.feature && layer.feature.properties.customTicksCt){
                      var mapLayerId = layer.feature.properties.id;
                      if(thisLoc.properties.id === mapLayerId){
                        layer.setRadius(newRadius);
                      }
                   }
                });
                }

                if( ! $("#time-slider-label").is(":visible")){
                  $("#time-slider-label").show();
                }
                $("#time-slider-label").text( selectedDate.getMonth() + " / " + selectedDate.getDay() + " / " + selectedDate.getFullYear()  + " | " + rtsCt + " Ticks");
              }
              },
              stop: function( event, ui ) {
                setTimeout(function(){
                  $("#time-slider-label").fadeOut(400);
                  if($("#tick-time-chart:visible").length > 0){
                    $("#chart-row-1").fadeOut(400);
                    $("#time-time-chart").remove();
                  }
                }, 30000);

              }
           });
        }


        this.setSearchBar = function(areas) {
            var substringMatcher = function(strs) {
              return function findMatches(q, cb) {
                var matches, substringRegex;

                // an array that will be populated with substring matches
                matches = [];

                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');

                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                  if (substrRegex.test(str)) {
                    matches.push(str);
                  }
                });

                cb(matches);
              };
            };

            var areasArr = [];
            for(var i=0; i<areas.length; i++){
              var areaName = areas[i].properties.area;
              var geom = areas[i].geometry.coordinates;
              areasArr.push(JSON.stringify({"areaName":areaName, "geom":geom}));
            }


            $('#area-search .typeahead').typeahead({
              hint: true,
              highlight: true,
              minLength: 1
            },
            {
              name: 'areas',
              source: substringMatcher(areasArr),
              display:function(area) {
                return JSON.parse(area).areaName;
              },
            }).bind('typeahead:select', function(e, suggestion) {
                var sugObj = JSON.parse(suggestion);
                map.setView(L.latLng(sugObj.geom[1],sugObj.geom[0]), 14);
            });
        }

        // TODO: THIS IS WHERE WE ARE WORKING

        this.getRouteArrayByType = function(routeArr){
          let routeType = this.props.routeType
          console.log(routeType)
          var newTypeArr = [];

          if(routeType.toUpperCase() === "ALL"){
            return routeArr;
          }
          else{
            for(let i=0; i<routeArr.length; i++){
              var rt = routeArr[i];
              if(rt.type && rt.type.toUpperCase() === routeTyoe.toUpperCase()){
                newTypeArr.push(rt);
              }
            }
          }
          return newTypeArr;
        }
      }
     componentWillMount() {

     }

     componentWillUnmount() {
     	  this.toDoAreaReq.abort();
     	  this.toDoCragReq.abort();
     	  this.tickAreaReq.abort();
     	  this.cragsReq.abort();
     	  this.areasReq.abort();
     	  this.ticksReq.abort();
     	  this.todosReq.abort();
     	  this.missingAreasReq.abort();

        // this.map.off('click', this.onMapClick);
        // this.map = null;
     }

     onMapClick() {
         // Clear the info box
        //  if($("#info-box-content").text().length > 0){
        //    $("#info-box-content").html("");
        //  }
        //  if($(".info-area-title").text().length > 0){
        //    $(".info-area-title").text("");
        //  }
        //  if($("#info-container").is(':visible')){
        //    $("#info-container").hide();
        //  }
         //
        //  if(drawnItems){
        //    drawnItems.eachLayer(function(layer){drawnItems.removeLayer(layer)});
         //
        //    disableEditModeInToolbar();
        //  }

        console.log("map has been clicked")
     }
      resizeLocations(filter) {
         map.eachLayer((layer) => {
           if(layer.feature){
             layer.setRadius(0);

             if(filter.toUpperCase() === 'ALL'){
               // customRouteCt is currently ToDo frequency and will take priority over existing area points
               if(layer.feature.properties.customRouteCt > 0){
                 var routeCt = getLocationSizeBucket(layer.feature.properties.customRouteCt);
                 layer.setRadius(routeCt);
               }

               if(layer.feature.properties.customTicksCt > 0){
                 var ticksCt = getLocationSizeBucket(layer.feature.properties.customTicksCt);
                 layer.setRadius(ticksCt);
               }

             }
             else if(filter.toUpperCase() === 'TRAD'){
               if(layer.feature.properties.customTradCt > 0){
                 var routeCt = getLocationSizeBucket(layer.feature.properties.customTradCt);
                 layer.setRadius(routeCt);
               }
             }
             else if(filter.toUpperCase() === 'SPORT'){
               if(layer.feature.properties.customSportCt > 0){
                 var routeCt = getLocationSizeBucket(layer.feature.properties.customSportCt);
                 layer.setRadius(routeCt);
               }
             }
             else if(filter.toUpperCase() === 'BOULDER'){
               if(layer.feature.properties.customBoulderCt > 0){
                 var routeCt = getLocationSizeBucket(layer.feature.properties.customBoulderCt);
                 layer.setRadius(routeCt);
               }
             }
             else if(filter.toUpperCase() === 'ALPINE'){
               if(layer.feature.properties.customAlpineCt > 0){
                 var routeCt = getLocationSizeBucket(layer.feature.properties.customAlpineCt);
                 layer.setRadius(routeCt);
               }
             }
           }

         })

       }

    render () {
        const { store } = this.context;
        var that = this;
        const position = [this.state.lat, this.state.lng];

        function onEachTodoFeature(thisRef, feature, layer) {
      	   layer.on({
              mouseover: todoHoverAction,
              mouseout: resetAreaHover,
              click: featureClickEvent
            });
        }

        function onEachTickFeature(thisRef, feature, layer) {
           layer.on({
              mouseover: tickHoverAction,
              mouseout: resetAreaHover,
              click: featureClickEvent
            });
        }

        function resetAreaHover(e) {
          var layer = e.target;
          resetFeatureColor(layer);
          // removeAllCharts();
        }

        function resetFeatureColor(layer) {
          console.log(layer.feature.properties)
          if(layer.feature.properties.areatype === "TODO") {
              layer.setStyle({"fillColor": TODOFILL});
            }
            else if(layer.feature.properties.areatype === "CRAG"){
              layer.setStyle({"fillColor": CRAGFILL});
            }
            else if(layer.feature.properties.areatype === "TICK"){
              layer.setStyle({"fillColor": TICKFILL});
            }
        }

        // function resizeLocations(rtCount) {
        //       console.log('rtCount', rtCount)
        //       const newSize = getLocationSizeBucket(rtCount)
        //       console.log('newSize', newSize)
        // }


        ////
        // click event for areas
        ////
        function featureClickEvent(e) {

          var layer = e.target;

          // if(!$("#info-container").is(':visible')){
          //   $("#info-container").show();
          // }
          //
          // if($(".info-ul").length > 0){
          //   $(".info-ul").remove();
          // }
          //
          // if($(".info-area-title").text().length > 0){
          //   $(".info-area-title").remove();
          // }
          //
          // // This is a really weak check. we need to make sure this is
          // var subHeading = "";
          // if(layer.feature.properties.customTicksArr){
          //   var layers = layer.feature.properties.customTicksArr;
          //   subHeading = "Ticks";
          // }
          // else {
          //   var layers = layer.feature.properties.customRouteArr;
          //   subHeading = "ToDo";
          // }
          //
          // // Sort the array by the orderIndex property
          // function compare(a,b) {
          //   if (a.difficultyindex < b.difficultyindex)
          //      return -1;
          //   if (a.difficultyindex > b.difficultyindex)
          //     return 1;
          //   return 0;
          // }
          // layers.sort(compare);
          //
          // $("#info-area-title").text(subHeading+": "+layer.feature.properties.area);
          //
          // for(var l=0; l<layers.length; l++){
          //
          //     if(routeTypeFilter === "ALL" || layers[l].type.toUpperCase() === routeTypeFilter ){
          //     var name = String(layers[l].name ? layers[l].name : 'n/a');
          //     var type = String(layers[l].type ? layers[l].type :"n/a");
          //     if(type.toUpperCase() === "TRAD" || type.toUpperCase() === "SPORT" || type.toUpperCase() === "ALPINE"){
          //       var rating = String(layers[l].ropegrade ? layers[l].ropegrade : 'n/a');
          //     }
          //     else{
          //       var rating = String(layers[l].bouldergrade ? layers[l].bouldergrade : 'n/a');
          //     }
          //     var pitches = String(layers[l].pitches ? layers[l].pitches :"n/a");
          //     var stars = String(layers[l].stars ? layers[l].stars :"n/a");
          //     var starVotes = String(layers[l].starVotes ? layers[l].starVotes :"n/a");
          //     var url = String(layers[l].url ? layers[l].url :"n/a");
          //     var geoLoc = String(layers[l].location ? layers[l].location :"n/a");
          //     var crag = getLocationName(layers[l].area) ;
          //     var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
          //     var imgMed = String(layers[l].imgMed ? layers[l].imgMed :"n/a");
          //
          //     var routeHTMLStr = "<ul class='info-ul'>";
          //     routeHTMLStr += "<li class='info-text'><h3 class='info-header'><u>" +  name + "</u></h3></li>";
          //     routeHTMLStr += "<li class='info-text'><i>Rating:  </i>" +  rating + "</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Type:  </i>" +  type + "</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Pitches:  </i>" +  pitches + "</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Stars:  </i>" +  stars + " out of "+ starVotes + " votes</li>";
          //     routeHTMLStr += "<li class='info-text'><i>Crag:  </i>" +  crag + "</li>";
          //     routeHTMLStr += "<li class='info-text'><a class='info-link' target='_blank' href='"+  url + "'>See it on Mountain Project</a></li>";
          //     // routeHTMLStr += "<li class='info-link'> <img class='info-image' src=http://mountainproject.com"+ imgMed +" alt='Climbing Img'> </li>";
          //     routeHTMLStr += "</ul>";
          //
          //     $("#info-box").append(routeHTMLStr);
          //   }
          //
          // }

          // function getLocationName(areaId) {
          //   var areaName = "";
          //   for(var n=0; n<todoAreaPts.features.length; n++){
          //     var thisAreaId = todoAreaPts.features[n].properties.id;
          //     if(areaId === thisAreaId){
          //       areaName = todoAreaPts.features[n].properties.area;
          //     }
          //   }
          //
          //   return areaName;
          // }
        }


        function tickHoverAction(e) {
              var layer = e.target;

              // if($("#tick-time-chart")){
              //   $("#tick-time-chart").remove()
              // }

              layer.setStyle({"fillColor":TICKFILLHOVER});

              // $("#left-sidebar-heading-info-container").show();
              // $("#left-sidebar-heading").text(layer.feature.properties.area);
              //
              // //////
              // /// TODO: this is really boring. Make this rout info more interesting
              // /////
              // if(layer.feature.properties.customTicksArr){
              //   var html = '<div class="tick-info-container">';
              // for(var i=0; i<layer.feature.properties.customTicksArr.length; i++){
              //   var rt = layer.feature.properties.customTicksArr[i];
              //   var date = new Date(rt.date);
              //   var dateStr = date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
              //
              //   var newTickInfo = '<div class="info-content"><b>' + rt.name + '</b> : ' + rt.notes + ' ' + dateStr + '</div>'
              //   html += newTickInfo;
              // }
              // html += "</div>";
              //
              //  $("#hover-text-info-container").html('<p class="info-content"><b>' + layer.feature.properties.customTicksCt + '</b> Ticks</p>')
              //
              //  if(!$("#chart-row-1").is(':visible')){
              //   $("#chart-row-1").show();
              // }
              // if(!$("#chart-row-2").is(':visible')){
              //   $("#chart-row-2").show();
              // }
              //
              //  $("#chart-row-1").append('<div id="tick-grade-chart" ></div>');
              // var hoverBarChart = new BarChart(getRouteArrayByType(layer.feature.properties.customTicksArr, routeTypeFilter), "#tick-grade-chart", $("#tick-grade-chart").parent().width());
              // hoverBarChart.build();
              //
              // $("#chart-row-2").append('<div id="tick-type-chart" ></div> <div id="tick-height-chart" ></div>');
              // new PieChart(layer.feature, "#tick-type-chart", $("#tick-type-chart").parent().width()/2, routeTypeFilter);
              // new RouteHeightPieChart(getRouteArrayByType(layer.feature.properties.customTicksArr, routeTypeFilter), "#tick-height-chart", $("#tick-height-chart").parent().width()/2);

            // TODO: Add some more fun hover actions like a chart of all the comments from ticked routes
          // }
        }


        // action to perform when mousing over a feature
        function todoHoverAction(e) {
            var layer = e.target;
            store.dispatch(hoverFeatureInfo(layer))
            console.log("dispatched")
            // removeAllCharts();

          //   if($("#tick-time-chart")){
          //       $("#tick-time-chart").remove()
          //     }
          //
            if(layer.feature.properties.areatype === "TODO") {
              layer.setStyle({"fillColor": TODOFILLHOVER});
            }
            else if(layer.feature.properties.areatype === "CRAG"){
              layer.setStyle({"fillColor": CRAGFILLHOVER});
            }
          //
          // $("#left-sidebar-heading-info-container").show();
          //   $("#left-sidebar-heading").text(layer.feature.properties.area);
          //
          //   var routeCountPropertyName = "customRouteCt"; // Default
          //   if(routeTypeFilter === "ALL"){
          //     routeCountPropertyName = "customRouteCt";
          //   }
          //   else if(routeTypeFilter === "TRAD"){
          //     routeCountPropertyName = "                       Ct";
          //   }
          //   else if(routeTypeFilter === "SPORT"){
          //     routeCountPropertyName = "customSportCt";
          //   }
          //   else if(routeTypeFilter === "BOULDER"){
          //     routeCountPropertyName = "customBoulderCt";
          //   }
          //   else if(routeTypeFilter === "ALPINE"){
          //     routeCountPropertyName = "customAlpineCt";
          //   }
          //
          //   if( layer.feature.properties[routeCountPropertyName] ){
          //     $("#hover-text-info-container").html('<p class="info-content"><b>' + layer.feature.properties[routeCountPropertyName] + '</b> ToDos</p>');
          //
          //   if(!$("#chart-row-1").is(':visible')){
          //     $("#chart-row-1").show();
          //   }
          //   if(!$("#chart-row-2").is(':visible')){
          //     $("#chart-row-2").show();
          //   }
          //
          //   $("#chart-row-1").append('<div id="todo-grade-chart" ></div>');
              // var todoBarChart = new BarChart(that.getRouteArrayByType(layer.feature.properties.customRouteArr, routeTypeFilter), "#todo-grade-chart", $("#todo-grade-chart").parent().width());
              // todoBarChart.build();
          //
          //     $("#chart-row-2").append('<div id="todo-type-chart" ></div> <div id="todo-height-chart" ></div>');
          //   new PieChart(layer.feature, "#todo-type-chart", $("#todo-type-chart").parent().width()/2, routeTypeFilter);
          //   new RouteHeightPieChart(getRouteArrayByType(layer.feature.properties.customRouteArr, routeTypeFilter), "#todo-height-chart", $("#todo-height-chart").parent().width()/2);
          // }
        }

        function areaTodoPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allAreaPtsDefaultStyle);
        }

        function cragTodoPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allCragPtsDefaultStyle);
        }

        function areaTickPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, areaTickPtsDefaultStyle);
        }

        function areaPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allAreaPtsDefaultStyle);
        }

        function cragPtsPointToLayer (feature, latlng) {
            return L.circleMarker(latlng, allCragPtsDefaultStyle);
        }
         function filterByRouteType(feature) {
           if (feature.properties.customTradCt === 0) {
             return false
           } else if (feature.properties.customTradCt > 0) {
             return true
           }
         }

        let toDoAreaPts = this.state.todoAreaPts
        if (this.props.routeType.routeType === 'ALL') {
          toDoAreaPts = this.state.todoAreaPts
        } else if (this.props.routeType.routeType === 'TRAD') {
          let tradRouteCount = { features: this.state.todoAreaPts.features.filter(filterByRouteType) }
          toDoAreaPts = Object.assign(toDoAreaPts, tradRouteCount)
          // resizeLocations(toDoAreaPts)
        }

  		return(
        <Map center={position} zoom={this.state.zoom} zoomControl={false} >

          <ZoomControl position={"topright"}></ZoomControl>

          <LayersControl position='topright'>
            <LayersControl.BaseLayer name='OSM Light' checked={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='OSM'>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay name='To-Do Areas' checked={true}>
              <GeoJsonUpdatable
                ref={'map'} //TODO: remove if we use props
                data={toDoAreaPts}
                resizeLocation={() =>this.resizeLocations().bind(this)}
                style={this.state.todoLayerStyle}
                onEachFeature={onEachTodoFeature.bind(null, this)}
                pointToLayer={areaTodoPtsPointToLayer}
                getLocationSizeBucket={getLocationSizeBucket}
              >
              </GeoJsonUpdatable>
            </LayersControl.Overlay>

            {/* <LayersControl.Overlay name='To-Do Crags' checked={false}>
              <GeoJsonUpdatable data={this.state.todoCragPts} style={allCragPtsDefaultStyle} onEachFeature={onEachFeature.bind(null, this)} ></GeoJsonUpdatable>
            </LayersControl.Overlay> */}

            <LayersControl.Overlay name='Tick Areas' checked={false}>
              <GeoJsonUpdatable
                data={this.state.tickAreaPts}
                style={this.state.tickLayerStyle}
                onEachFeature={onEachTickFeature.bind(null, this)}
                pointToLayer={areaTickPtsPointToLayer} >
              </GeoJsonUpdatable>
            </LayersControl.Overlay>

            {/* <LayersControl.Overlay name='All Areas (editable)' checked={false}>
              <GeoJsonUpdatable data={this.state.areas} style={areaTodoPtsDefaultStyle} onEachFeature={onEachFeature.bind(null, this)} ></GeoJsonUpdatable>
            </LayersControl.Overlay>

            <LayersControl.Overlay name='All Crags (editable)' checked={false}>
              <GeoJsonUpdatable data={this.state.crags} style={allAreaPtsDefaultStyle} onEachFeature={onEachFeature.bind(null, this)} ></GeoJsonUpdatable>
            </LayersControl.Overlay> */}

          </LayersControl>

        </Map>
  		);
    }
}
MapComponent.contextTypes = {
  store: React.PropTypes.object
}

// window.ReactDOM.render(<SimpleExample />, document.getElementById('map'));
export default MapComponent;
