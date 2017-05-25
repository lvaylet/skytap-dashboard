// TODO Investigate options to avoir hardcoding the names of the statistics, or
// turn them into properties. Figure out how to apply custom computations to
// concurrent_storage_size (" / 1024 | round")

<template>
  <div class="box is-info">
    <h1 class="title">{{ name }}</h1>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child notification" :class="states.concurrent_svms">
          <p class="title">Concurrent SVMs</p>
          <p class="subtitle">{{ stats.concurrent_svms.usage }} / {{ stats.concurrent_svms.limit }}</p>
          <progress class="progress" :value="stats.concurrent_svms.usage" :max="stats.concurrent_svms.limit"></progress>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification" :class="states.concurrent_storage_size">
          <p class="title">Storage Size (GB)</p>
          <p class="subtitle">{{ stats.concurrent_storage_size.usage / 1024 | round }} / {{ stats.concurrent_storage_size.limit / 1024 }}</p>
          <progress class="progress" :value="stats.concurrent_storage_size.usage / 1024 | round" :max="stats.concurrent_storage_size.limit / 1024"></progress>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
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
  },

  data: () => ({
    'concurrent_svms': 'Cumulative SVMs',
    'concurrent_storage_size': 'Storage Size (GB)',
  }),

  computed: {
    // Compute regional metrics to determine tile colors (success, warning...)
    states: function () {
      return this.stats
      ? {
        'concurrent_svms': this.getClassFromOccupancyRate(this.stats.concurrent_svms.usage / this.stats.concurrent_svms.limit),
        'concurrent_storage_size': this.getClassFromOccupancyRate(this.stats.concurrent_storage_size.usage / this.stats.concurrent_storage_size.limit),
      }
      : 'is-info'  // return is-info by default
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
    }
  }
}
</script>

<style>
</style>
