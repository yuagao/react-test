import React, { Component } from 'react';
import EsriLoaderReact from 'esri-loader-react';

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lat: this.props.lat,
      log: this.props.log
    };
    console.log(this.state)
  }

  componentDidMount() {
    console.log(EsriLoaderReact);
  }

  render() {

    // const options = {
    //   url: 'https://js.arcgis.com/4.6/'
    // };

    const options = {
      url: 'https://js.arcgis.com/3.23/'
    };


    return(
      <div className="App">
        <EsriLoaderReact
         options={options}
         modulesToLoad={[

           "esri/map",
            "esri/layers/FeatureLayer",
            "esri/dijit/PopupTemplate",
            "esri/dijit/Legend",

         ]}
         onReady={({loadedModules: [Map, FeatureLayer, PopupTemplate, Legend], containerNode}) => {

           // const map = new Map({
           //   basemap: "dark-gray",
           //   ground: "world-elevation"
           // });
           //
           // const mapView = new MapView({
           //    container: containerNode,
           //    map: map,
           //    center: [this.state.lat, this.state.log],
           //    zoom: 11,
           //    padding: {
           //     right: 300
           //    }
           //  });
           //
           //  const popupTemplate = { // autocasts as new PopupTemplate()
           //     title: "Marriage in NY, Zip Code: {ZIP}",
           //     content: "<p><b> Marriage Rate: {MARRIEDRATE}% </b></p>" +
           //         "<p> Married: {MARRIED_CY}</p>" +
           //         "<p> Never Married: {NEVMARR_CY}</p>" +
           //         "<p> Divorced: {DIVORCD_CY}</p>"
           //  };
           //
           //  const featureLayer = new FeatureLayer({
           //    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NYCDemographics1/FeatureServer/0",
           //    outFields: ["*"],
           //    popupTemplate: popupTemplate
           //  });
           //  map.add(featureLayer);

           const map = new Map(containerNode, {
             basemap: "dark-gray-vector",
             center: [ -73.92872, 40.71321 ],
             zoom: 11
           });

           // Enable clustering in the layer's constructor
           // and add the layer to the map

           const serviceUrl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/nyc_parks_gardens_hist_sites/FeatureServer/0";

           const layer = new FeatureLayer(serviceUrl, {
             outFields: [ "facname", "proptype", "factype", "address" ],
             featureReduction: {
               type: "cluster"
             },
             infoTemplate: new PopupTemplate({
               title: "{facname}",
               description: "{proptype} {factype} on {address}."
             })
           });
           map.addLayer(layer);

           // map.on("load", function(evt){
           //   const legend = new Legend({
           //     map: map,
           //     layerInfos: [{
           //       layer: layer,
           //       title: "Parks and historic sites"
           //     }]
           //   }, containerNode);
           //   legend.startup();
           // });

         }}
        />
      </div>
    )
  }

}

export default Map;
