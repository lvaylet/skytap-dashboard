<template>
  <div id="app">
    <!--<just-gage v-if="usage" v-bind:value="usage.EMEA.concurrent_svms.usage"></just-gage>-->
    <just-gage v-bind:value="dummy"></just-gage>
    <just-gage v-bind:value="dummy"></just-gage>

    <h1>Skytap Resource Usage (from API)</h1>
    <ul v-if="usage">
      <li v-for="(region, regionName) of usage">
        <h2>{{ regionName }}</h2>
        <div v-for="property in region">{{ property.id }}: {{ property.usage }} / {{ property.limit }}</div>
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

// Do not forget to import raphael for JustGage to work
import Raphael from 'raphael/raphael.min.js'
global.Raphael = Raphael

import JustGage from './JustGage.vue'

export default {
  name: 'app',

  data: () => ({
    usage: {},
    dummy: 67,
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
      this.dummy = Math.floor((Math.random() * 10) + 1) * 10
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
