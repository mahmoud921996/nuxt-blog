<template>
  <div>
    <TheHeader @sideNavToggle="displaySideNav = !displaySideNav" />
    <TheSidenav :show="displaySideNav" @close="displaySideNav = false" />
    <nuxt />
  </div>
</template>
<script>
import TheHeader from "~/components/Navigation/TheHeader.vue";
import TheSidenav from "~/components/Navigation/TheSidenav.vue";
export default {
  components: {
    TheHeader,
    TheSidenav,
  },
  data() {
    return {
      displaySideNav: false,
    };
  },
};
</script>
<style>
html {
  font-family: "Montserrat", sans-serif;
}

body {
  margin: 0;
}
</style>
