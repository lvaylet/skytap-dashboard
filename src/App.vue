// TODO Make refresh interval a variable and bind it to input field
// TODO Use Bulma Cards to organize content in tiles?
// TODO Apply success, warning and danger classes reactively based on usage wrt. limit

<template>
  <div id="app">
    <h1>Skytap Dashboard <icon v-show="loading" name="refresh" spin></icon></h1>

    <label for="refresh-interval">Refresh every (milliseconds): </label>
    <input v-model="refreshInterval" id="refresh-interval">
    <button @click="loadData">Refresh</button>

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

    <h2>Bulma Tiles</h2>
    <div class="tile is-ancestor is-vertical" v-if="usage">
      <div class="tile is-parent">
        <article class="tile is-child notification is-info">
          <p class="title">Global</p>
          <p class="title">VMs</p>
    	    <p class="subtitle">{{ usage.global.concurrent_vms.usage }}</p>
          <p class="title">Cumulative SVM Hours</p>
    	    <p class="subtitle">{{ usage.global.cumulative_svms.usage }}</p>
        </article>
      </div>
      <div class="tile">
    	  <div class="tile is-parent" v-for="(region, regionName) of usage" v-if="regionName != 'global'">
    		  <article class="tile is-child notification is-success">
    		    <p class="title">{{ regionName }}</p>
            <p class="title">SVMs</p>
            <p class="subtitle">{{ region.concurrent_svms.usage }} / {{ region.concurrent_svms.limit }}</p>
            <progress class="progress" :value="region.concurrent_svms.usage" :max="region.concurrent_svms.limit"></progress>
            <p class="title">Storage Size (GB)</p>
            <p class="subtitle">{{ region.concurrent_storage_size.usage / 1024 }} / {{ region.concurrent_storage_size.limit / 1024 }}</p>
            <progress class="progress" :value="region.concurrent_storage_size.usage / 1024" :max="region.concurrent_storage_size.limit / 1024"></progress>
          </article>
    	  </div>
      </div>
    </div>

  </div>
</template>

<script>
import { HTTP_REST_API } from './http-common'

import JustGage from './JustGage.vue'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'

export default {
  name: 'app',

  data: () => ({
    usage: null,
    statsToDisplay: ['concurrent_svms', 'concurrent_storage_size'],  // unused, figure out how to iterate on this when creating the regional gauges
    refreshInterval: 60000, // in milliseconds, used only with setTimeout below
    loading: false,
    errors: [],
  }),

  // Register components
  components: {
    'just-gage': JustGage,
    'icon': Icon,
  },

  created: function () {
    // Load data once on startup, then poll periodically. Drawback is the period
    // cannot be changed easily.
    this.loadData()
    setInterval(() => { this.loadData() }, 5000)
    // or setInterval(function () { this.loadData() }.bind(this), 5000)
    // `.bind(this)` is required so the function inside `setInterval` can
    // understand `this`. `setInterval` is not evaluated yet while its arguments
    // are still being evaluated. `this.loadData().bind(...)` is evaluated, then
    // setInterval is called with the result (bound function). In other words,
    // the `this` parameter passed to `bind()` is retained via a closure and
    // explicitly set as `this` when the function is later called, using
    // `Function.prototype.apply()`.
  },

  methods: {
    // FIXME Figure out how to evaluate this.loading = false in all cases
    // Putting it after `get(...)` does not help. It is executed before the
    // request response is received (as axios run async?).
    loadData: function () {
      this.loading = true
      HTTP_REST_API.get('skytap/usage')
      .then(response => {
        this.usage = response.data
        this.loading = false
      })
      .catch(e => {
        this.errors.push(e)
        this.loading = false
      })
      // this.loading = false  // does not work

      // setTimeout can be used instead of setInterval (see above) so the
      // function has a timeout on itself and updates periodically.
      // `setTimeout` requires an extra line of code to keep it propagating,
      // which can be a maintenance problem but also lets the period be changed
      // easily.
      // setTimeout(this.loadData, this.refreshInterval)
    }
  },
}
</script>

<style lang="css">
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

@import "~bulma/css/bulma.css";  /* == ../node_modules/bulma/css/bulma.css'; */
</style>
