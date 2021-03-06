<template>
  <div class="content">
    <div class="tile is-ancestor">
      <div class="tile is-parent" v-for="(stat, key) of statsToDisplay" :key="key">
        <article class="tile is-child notification" :class="humanFriendlyStats[key].state">
          <p class="title">{{ name }}</p>
          <p class="subtitle">
            {{ stat['name'] }}
            <span class="tag">{{ humanFriendlyStats[key].usage | round }}
              <span v-if="humanFriendlyStats[key].limit">&nbsp;/&nbsp;{{ humanFriendlyStats[key].limit | round }}</span>
            </span>
          </p>
          <progress class="progress" :value="humanFriendlyStats[key].usage | round" :max="humanFriendlyStats[key].limit | round" v-if="humanFriendlyStats[key].limit" ></progress>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import './filters.js'  // custom filters

export default {
  props: {
    name: {
      type: String,
      default: () => ('N/A'),
    },
    stats: {
      type: Object,
      default: () => (null),
    },
    statsToDisplay: {
      type: Object,
      default: () => ({
        'concurrent_svms': {
          'name': 'Concurrent SVMs',
          'processing': (value) => ( value ),
        },
        'concurrent_storage_size': {
          'name': 'Storage Size (GB)',
          'processing': (value) => ( value / 1024 ),
        },
      }),
    },
  },

  computed: {
    humanFriendlyStats: function () {
      // Compute human-friendly stats by applying processing function. Only
      // process stats meant to be displayed.
      //
      // Array.prototype.reduce reduces an array to a single value by somewhat
      // merging the previous value with the current. The chain is initialized
      // by an empty object {}. On every iteration a new key of myObject is
      // added with its square as value.
      // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
      return Object.keys(this.stats).reduce(function(previous, current) {
        // Initialize human-friednly version with raw data
        previous[current] = this.stats[current]
        // Process fields and compute occupancy rate if stat is to be displayed and limit is not null
        if (this.statsToDisplay.hasOwnProperty(current)) {
          previous[current].usage = this.statsToDisplay[current].processing(this.stats[current].usage)
          if (previous[current].limit) {
            previous[current].limit = this.statsToDisplay[current].processing(this.stats[current].limit)
            previous[current].state = this.getClassFromOccupancyRate(previous[current].usage / previous[current].limit)
          } else {
            previous[current].state = 'is-info'
          }
        }
        return previous;
      }.bind(this), {})
    },
  },

  methods: {
    getClassFromOccupancyRate: function(occupancyRate) {
      if (occupancyRate < 0.75) {
        return 'is-success'
      } else if (occupancyRate < 0.90) {
        return 'is-warning'
      } else {
        return 'is-danger'
      }
    },
  },
}
</script>

<style>
</style>
