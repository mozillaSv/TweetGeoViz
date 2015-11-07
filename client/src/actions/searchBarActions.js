'use strict';

var Dispatcher = require('../dispatcher/appDispatcher.js'),
    ActionTypes = require('../constants/actionTypes.js');

var SearchBarActions = {
  focus: function() {
    Dispatcher.dispatch({
      actionType: ActionTypes.SEARCH_ONFOCUS
    });
  }
};

module.exports = SearchBarActions;
