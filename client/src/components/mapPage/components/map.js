// webpack specific - including required JS and CSS files
require('../../../less/mapPage/map.less');

import React, { Component, PropTypes } from 'react';

class Map extends Component {
  static propTypes = {
    isCircleVisible: PropTypes.bool,
    point: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    selector: PropTypes.string,
    clickRadius: PropTypes.number,
    heatMapData: PropTypes.array,
    searchUUID: PropTypes.string,
    mapOptions: PropTypes.object
  }

  static defaultProps = {
    isCircleVisible: false,
    lpoint: {
      lat: 0,
      lng: 0
    },
    clickRadius: 250,
    heatMapData: [],
    selector: '#map-canvas',
    mapOptions: {
      center: new google.maps.LatLng(21.2125, 31.1973),
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false
    },
    searchUUID: undefined
  }

  componentDidMount = () => {
    const {
      selector,
      mapOptions,
      heatMapData,
      isCircleVisible
    } = this.props;
    const element = document.querySelector(selector);

    this._googleMap = new google.maps.Map(element, mapOptions);

    // attach event to google map click
    google.maps.event.addListener(this._googleMap, 'click', this._onClick);

    this._renderHeatMap(heatMapData);
    this._toggleCircle(isCircleVisible);
  }

  componentDidUpdate = prevProps => {
    const {
      isCircleVisible,
      searchUUID,
      heatMapData
    } = this.props;

    // work with map circle only if its property has changed
    if (prevProps.isCircleVisible !== isCircleVisible) {
      this._toggleCircle(isCircleVisible);
    }

    // re-render heatmap only if search was changed
    if (prevProps.searchUUID !== searchUUID) {
      this._renderHeatMap(heatMapData);
    }
  }

  _onClick = event => {
    const { onClick } = this.props;
    const { latLng, pixel } = event;

    // get bounds for the click
    var bounds = new google.maps.Circle({
      center: new google.maps.LatLng(latLng.lat(), latLng.lng()),
      radius: this._getClickRadiusMeters()
    }).getBounds();

    onClick({
      point: {
        x: pixel.x,
        y: pixel.y
      },
      lpoint: {
        lat: latLng.lat(),
        lng: latLng.lng()
      },
      bounds: bounds
    });
  }

  _getClickRadiusMeters = () => {
    const KM = 1000;
    const { clickRadius } = this.props;

    return clickRadius * KM;
  }

  _showCircle = () => {
    const { lpoint: { lat, lng } } = this.props;

    this._hideCircle();

    this._mapCircle = new google.maps.Circle({
      map: this._googleMap,
      center: new google.maps.LatLng(lat, lng),
      clickable: false,
      radius: this._getClickRadiusMeters(),
      fillColor: '#fff',
      fillOpacity: 0.6,
      strokeColor: '#313131',
      strokeOpacity: 0.4,
      strokeWeight: 0.8
    });

    this._googleMap.setOptions({
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      panControl: false,
      disableDoubleClickZoom: true
    });
  }

  _hideCircle = () => {
    if (!this._mapCircle) {
      return;
    }

    this._mapCircle.setMap(null);
    this._googleMap.setOptions({
      draggable: true,
      zoomControl: true,
      scrollwheel: true,
      panControl: true,
      disableDoubleClickZoom: false
    });
  }

  _toggleCircle = isCircleVisible => {
    this[isCircleVisible ? '_showCircle' : '_hideCircle']();
  }

  _renderHeatMap = (heatMapData = []) => {
    // remove old heatmap if it was present
    if (this._heatMap) {
      this._heatMap.setMap(null);
    }

    if (!heatMapData.length) {
      return;
    }

    this._heatMap = new google.maps.visualization.HeatmapLayer({
      data: heatMapData,
      dissipating: false,
      radius: 5,
      map: this._googleMap
    });
  }

  render() {
    return (
      <div id='map-canvas'>
        Loading map...
      </div>
    );
  }
};

export default Map;
