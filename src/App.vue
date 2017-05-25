// TODO Make refresh interval a variable and bind it to input field? Then use
// setTimeout instead of setInterval

<template>
  <div id="app">

    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Skytap Dashboard
          </h1>
          <h2 class="subtitle">
            Monitor usage in real time
          </h2>
        </div>
      </div>
    </section>

    <section class="section" v-if="usage">
      <div class="container">
        <h2>Global</h2>
        <just-gage :value="usage.global.concurrent_vms.usage"
                   :max="usage.global.concurrent_vms.limit"
                   :options="{ title: 'VMs' }" />
        <just-gage :value="usage.global.cumulative_svms.usage"
                   :max="usage.global.cumulative_svms.limit"
                   :options="{ title: 'Cumulative SVM Hours' }" />
        <region v-for="(region, regionName) of usage" v-if="regionName != 'global'" :key="regionName" :name="regionName" :stats="region" />
      </div>
    </section>

    <section class="section" v-if="errors && errors.length">
      <div class="container">
        <div class="heading">
          <h1 class="title">
            Errors
          </h1>
          <h2 class="subtitle">
            Subtitle
          </h2>
          <ul>
            <li v-for="error of errors">
              {{ error.message }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="heading">
          <h1 class="title">
            Settings
          </h1>
          <h2 class="subtitle">
            Subtitle
          </h2>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Refresh Interval (ms)</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <p class="control">
                  <input class="input" type="text" placeholder="in milliseconds" v-model="refreshInterval">
                </p>
                <p class="control">
                  <a class="button is-primary" :class="{ 'is-loading': loading }" @click="loadData">Refresh</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Skytap Dashboard</strong> by <a href="http://www.talend.com">Talend</a>.
            Powered by <a href="https://vuejs.org/">Vue.js</a> and <a href="http://bulma.io/">Bulma</a>.
            The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
          <p>
            <a class="icon" href="https://github.com/lvaylet/skytap-dashboard">
              <i class="fa fa-github"></i>
            </a>
          </p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
import { HTTP_REST_API } from './http-common'
import JustGage from './JustGage.vue'
import Region from './Region.vue'
import './filters.js'  // custom filters

export default {
  name: 'app',

  data: () => ({
    usage: null,
    refreshInterval: 60000, // in milliseconds, used only with setTimeout below
    loading: false,
    errors: [],
  }),

  // Register components
  components: {
    'just-gage': JustGage,
    'region': Region,
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
    },
  },
}
</script>

<style lang="css">
@import "~bulma/css/bulma.css";  /* == ../node_modules/bulma/css/bulma.css'; */
@import "~font-awesome/css/font-awesome.css";
</style>
