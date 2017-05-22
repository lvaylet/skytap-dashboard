<template>
  <div id="app">
    <h1>Skytap Resource Usage (from API)</h1>
    <ul v-if="usage">
      <li>
        <h2>Global</h2>
        <just-gage :value="usage.global.concurrent_vms.usage" :max="usage.global.concurrent_vms.limit"></just-gage>
        <just-gage :value="usage.global.cumulative_svms.usage" :max="usage.global.cumulative_svms.limit"></just-gage>
      </li>
      <li v-for="(region, regionName) of usage" v-if="regionName != 'global'">
        <h2>{{ regionName }}</h2>
        <!--<just-gage v-for="stat in stats" :value="region.stat.usage" :max="region.stat.limit"></just-gage>-->
        <just-gage :value="region.concurrent_svms.usage" :max="region.concurrent_svms.limit"></just-gage>
        <just-gage :value="region.concurrent_storage_size.usage / 1024" :max="region.concurrent_storage_size.limit / 1024"></just-gage>
      </li>
    </ul>

    <ul v-if="errors && errors.length">
      <li v-for="error of errors">
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import { HTTP_REST_API } from './http-common'

// Import Raphael for JustGage to work
import Raphael from 'raphael/raphael'
global.Raphael = Raphael

import JustGage from './JustGage.vue'

export default {
  name: 'app',

  data: () => ({
    usage: {},
    stats: ['concurrent_svms', 'concurrent_storage_size'],
    errors: []
  }),

  // Register components
  components: {
    'just-gage': JustGage,
  },

  created () {
    // Query API on startup then poll periodically
    this.loadData()
    setInterval(function () {
      this.loadData()
    }.bind(this), 5000)
  },

  methods: {
    loadData: function () {
      HTTP_REST_API.get('getUsage')
      .then(response => {
        this.usage = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
