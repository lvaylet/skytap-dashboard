<template>
  <section class="hero is-primary" v-once>
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {{ title }}
        </h1>
        <h2 class="subtitle" v-if="subtitle">
          {{ subtitle }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => ('Title'),
    },
    subtitle: {
      type: String,
      default: () => (null),
    },
  },
}
</script>

<style>
</style>
