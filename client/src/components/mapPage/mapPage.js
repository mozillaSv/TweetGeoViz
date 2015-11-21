'use strict';

var React = require('react');
var toastr = require('toastr');
var Map = require('./components/map.js');
var SearchBar = require('./components/searchBar.js');
var SlidePanel = require('./components/slidePanel.js');
var DataPopup = require('./components/dataPopup.js');

var MapActions = require('../../actions/mapActions.js');
var TweetsActions = require('../../actions/tweetsActions.js');
var PopupActions = require('../../actions/dataPopupActions.js');
var SearchBarActions = require('../../actions/searchBarActions.js');

var DataPopupStore = require('../../stores/dataPopupStore.js');
var SlidePanelStore = require('../../stores/slidePanelStore.js');
var MapStore = require('../../stores/mapStore.js');
var TweetsStore = require('../../stores/tweetsStore.js');
var SearchBarStore = require('../../stores/searchBarStore.js');

var MapPage = React.createClass({

  getInitialState: function() {
    return {
      popupData: DataPopupStore.getData(),
      mapData: MapStore.getData(),
      tweetsData: TweetsStore.getData(),
      slidePanelData: SlidePanelStore.getData(),
      searchBarData: SearchBarStore.getData(),
      error: {}
    }
  },

  componentWillMount: function() {
    TweetsStore.addChangeListener(this._tweetsStoreChange);
    DataPopupStore.addChangeListener(this._dataPopupStoreChange);
    MapStore.addChangeListener(this._mapStoreChange);
    SlidePanelStore.addChangeListener(this._slidePanelStoreChange);
    SearchBarStore.addChangeListener(this._searchBarStoreChange);
  },

  componentWillUnmount: function() {
    TweetsStore.removeChangeListener(this._tweetsStoreChange);
    DataPopupStore.addChangeListener(this._dataPopupStoreChange);
    MapStore.addChangeListener(this._mapStoreChange);
    SlidePanelStore.addChangeListener(this._slidePanelStoreChange);
    SearchBarStore.addChangeListener(this._searchBarStoreChange);
  },

  _searchBarStoreChange: function() {
    this.setState({
      searchBarData: SearchBarStore.getData()
    });
  },

  _slidePanelStoreChange: function() {
    this.setState({
      slidePanelData: SlidePanelStore.getData()
    });
  },

  _dataPopupStoreChange: function() {
    this.setState({
      popupData: DataPopupStore.getData()
    });
  },

  _mapStoreChange: function() {
    this.setState({
      mapData: MapStore.getData()
    });
  },

  _tweetsStoreChange: function() {
    this.setState({
      tweetsData: TweetsStore.getData()
    });
  },

  _searchQueryChange: function(event) {
    SearchBarActions.changeValue(event.target.name, event.target.value);
  },

  _onClickSearch: function() {
    TweetsActions.search(this.state.searchQuery);
  },

  _onFocusSearchField: function() {
    SearchBarActions.focus();
  },

  _slidePanelChange: function(event) {
    var name = event.target.name;
    var value = event.target.value;

    if (name === 'showPopupOnClick') {
      value = event.target.checked;

      return PopupActions.changeValue(name, value);
    }

    if (name === 'clickRadius') {
      value = parseInt(value, 10);

      return MapActions.changeValue(name, value);
    }
  },

  _onPopupClose: function() {
    PopupActions.close();
  },

  _onMapClick: function(options) {
    options = options || {};

    MapActions.click({
      point: options.point,
      lpoint: options.lpoint,
      showPopupOnClick: this.state.showPopupOnClick,
      bounds: options.bounds,
      searchQuery: this.state.searchQuery
    });
  },

  render: function() {
    return (
      <div>
        <div className='snap-drawers'>
          <div className='snap-drawer snap-drawer-left'>
            <SlidePanel
              visible = {this.state.slidePanelData.visible}
              clickRadius = {this.state.mapData.clickRadius}
              showPopupOnClick = {this.state.popupData.showPopupOnClick}
              onChange = {this._slidePanelChange} />
          </div>
        </div>

        <div className='site-wrapper snap-content'>
          <div className='site-wrapper-inner'>

            <Map
              isCircleVisible = {this.state.mapData.isCircleVisible}
              lpoint = {this.state.mapData.lpoint}
              onClick = {this._onMapClick}
              clickRadius = {this.state.mapData.clickRadius}
              heatMapData = {this.state.tweetsData.heatMapData} />

            <SearchBar
              searchQuery = {this.state.searchBarData.searchQuery}
              onChange = {this._searchQueryChange}
              onFocus = {this._onFocusSearchField}
              onClickSearch = {this._onClickSearch} />

            <DataPopup
              data = {this.state.tweetsData.selectedTweets}
              visible = {this.state.popupData.visible}
              point = {this.state.popupData.point}
              onClose = {this._onPopupClose} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MapPage;
