'use strict';

/*global module*/
module.exports = function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  next(err);
};
