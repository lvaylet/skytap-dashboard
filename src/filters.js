import Vue from 'vue'

/**
 * Vue filter to round the decimal to the given place.
 * http://jsfiddle.net/bryan_k/3ova17y9/
 *
 * @param {String} value    The value string.
 * @param {Number} decimals The number of decimal places.
 */
Vue.filter('round', function(value = 0, decimals = 0) {
  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return value;
});
