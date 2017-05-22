<template>
  <div id="app">
    <h1>Skytap Dashboard</h1>
    <ul v-if="usage">
      <li>
        <h2>Global</h2>
        <just-gage :value="usage.global.concurrent_vms.usage"
                   :max="usage.global.concurrent_vms.limit"
                   :options="{ title: 'VMs' }" />
        <just-gage :value="usage.global.cumulative_svms.usage"
                   :max="usage.global.cumulative_svms.limit"
                   :options="{ title: 'Cumulative SVM Hours' }" />
      </li>
      <li v-for="(region, regionName) of usage" v-if="regionName != 'global'">
        <h2>{{ regionName }}</h2>
        <just-gage :value="region.concurrent_svms.usage"
                   :max="region.concurrent_svms.limit"
                   :options="{ title: 'SVMs' }" />
        <just-gage :value="region.concurrent_storage_size.usage / 1024"
                   :max="region.concurrent_storage_size.limit / 1024"
                   :options="{ title: 'Storage Size [GB]' }" />
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
    usage: null,
    stats: ['concurrent_svms', 'concurrent_storage_size'],
    errors: [],
  }),

  // Register components
  components: {
    'just-gage': JustGage,
  },

  created () {
    // Query API and get usage on startup then poll periodically
    this.loadData()
    setInterval(function () {
      this.loadData()
    }.bind(this), 5000)
    // `.bind(this)` is required so the function inside `setInterval` can
    // understand `this`. `setInterval` is not evaluated yet while its arguments
    // are still being evaluated. `this.loadData().bind(...)` is evaluated, then
    // setInterval is called with the result (bound function).
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
