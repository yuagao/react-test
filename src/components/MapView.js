import React, { Component } from 'react';
import EsriLoaderReact from 'esri-loader-react';
import logo from '../images/logo.svg';
import traffic from '../images/traffic.png';
import dump from '../images/dump.png';

class MapView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      queryPoint: {
        lat: this.props.queryPoint.x,
        log: this.props.queryPoint.y
      },
      queryPoint: this.props.queryPoint,
      isDisplayed: this.props.isDisplayed
    };
    this.mapObjects = {
      view: null,
      map: null,
      featureLayer: null,
      graphicsLayer: null,
      graphicClass: null,
      geometryEngineClass: null,
      pointClass: null,
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    console.log('new props');
    if (nextProps.queryPoint !== this.state.queryPoint) {
      // Query features based on point
      this.queryFeature(nextProps.queryPoint);
      this.setState({
        queryPoint: nextProps.queryPoint
      })
    }

    if (nextProps.isDisplayed !== this.state.isDisplayed) {
      this.setState({
        isDisplayed: nextProps.isDisplayed
      })
    }
  }

  queryFeature(point) {
    // Create buffer based on point
    const pt = this.mapObjects.pointClass({
      type: 'point',
      x: point.x,
      y: point.y,
      z: 0
    })
    const buffer = this.mapObjects.geometryEngineClass.geodesicBuffer(pt, 20000, "meters", true);

    //Create Query
    const query = this.mapObjects.featureLayer.createQuery();
    query.where = '1=1';
    query.geometry = buffer;
    query.spatialRelationship = 'intersects';

    this.renderCurrentLocation(pt);

    // Execute query
    this.mapObjects.featureLayer.queryFeatures(query).then((results) => {
      this.props.onQueryResultsReturned(results.features);
    });
  }

  renderCurrentLocation(point) {
    const graphic = this.mapObjects.graphicClass({
      geometry: point,
      symbol: this.mapObjects.myLocationSymbol
    });
    // this.mapObjects.graphicslayer.add(graphic);
  }


  exportMapObjects(map, view, featureLayer, graphicsLayer, myLocationSymbol, graphic, geoEngine, point) {
    this.mapObjects = {
      view: view,
      map: map,
      featureLayer: featureLayer,
      graphicsLayer: graphicsLayer,
      myLocationSymbol: myLocationSymbol,
      graphicClass: graphic,
      geometryEngineClass: geoEngine,
      pointClass: point
    };
  }

  exportQueryResults(response) {
    this.props.onMapClicked(response.results[0].graphic.attributes)
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    return(
      <div className={(this.state.isDisplayed? 'show' : 'hidden')}>
        <EsriLoaderReact
         options={options}
         modulesToLoad={[
           'esri/Map',
           'esri/Basemap',
           'esri/views/MapView',
           'esri/views/SceneView',
           'esri/layers/SceneLayer',
           'esri/layers/FeatureLayer',
           'esri/layers/GraphicsLayer',
           'esri/geometry/geometryEngine',
           'esri/WebScene',
           'esri/Graphic',
           'esri/geometry/Point',
           'esri/symbols/PictureMarkerSymbol',
           'esri/symbols/SimpleFillSymbol',
           'esri/symbols/SimpleMarkerSymbol',
           'esri/Color',
           'esri/renderers/UniqueValueRenderer',
           'dojo/_base/lang'
         ]}
         onReady={({loadedModules: [Map, Basemap, MapView, SceneView, SceneLayer, FeatureLayer, GraphicsLayer, geometryEngine, WebScene, Graphic, Point, PictureMarkerSymbol, SimpleFillSymbol,SimpleMarkerSymbol, Color, UniqueValueRenderer, lang], containerNode}) => {

           // Initilize Map and View

           var scene = new WebScene({
             portalItem: {
               id: "f076224843674290a706e7f1d05f32d5"
             }
           });

          //  var scene = new Map({
          //   basemap: 'streets'
          // });

           const view = new SceneView({
             container: containerNode,
             map: scene,
             camera: {
               position: [-122.402, 37.787, 439.35],
               tilt: 0,
               heading: 0
             }
           });

           // Customize view UI
           // view.ui.remove(["zoom","navigation-toggle"]);

           const gLayer = new GraphicsLayer();
           scene.add(gLayer);

           const defaultSymbol = new PictureMarkerSymbol({
                url:{dump}.dump,
                width: '103px',
                height: '92px'
            });

            const trafficSymbol = new PictureMarkerSymbol({
                 url:{traffic}.traffic,
                 width: '103px',
                 height: '92px'
             });


           const red = new Color('red')

           const myLocationSymbol = new SimpleMarkerSymbol({
             color: red
           })

           let renderer = new UniqueValueRenderer({
               field: "Category",
               defaultSymbol: defaultSymbol,
               uniqueValueInfos: [{
               value: "Transportation",
               symbol: trafficSymbol
             },
             {
                value: "Facility",
                symbol: defaultSymbol
             }]
           });


          // Add Layers
          const featureLayer = new FeatureLayer({
            url: "https://services.arcgis.com/rqiKEkqyZ6RGCUcD/ArcGIS/rest/services/ReportedIssues/FeatureServer/0",
            outFields: ["*"],
            renderer: renderer,
            popupEnabled: true
          });
          scene.add(featureLayer);

          this.exportMapObjects(scene, view, featureLayer, gLayer, myLocationSymbol, Graphic,  geometryEngine, Point);

         // Bind view events
         view.when(function(){
           // Export map objects


           view.on("click", function(event){
             const screenPoint = {
               x: event.x,
               y: event.y
             };
             view.hitTest(screenPoint)
               .then(function(response){
                 this.exportQueryResults(response);
               }.bind(this));
           }.bind(this));

         }.bind(this), function(error){

         });

         }}

        />

      </div>
    )
  }


}

export default MapView;
