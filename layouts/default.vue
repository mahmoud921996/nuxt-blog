<template>
  <div>
    <TheHeader @sideNavToggle="displaySideNav = !displaySideNav" />
    <TheSideNav :show="displaySideNav" @close="displaySideNav = false" />
    <nuxt />
  </div>
</template>
<script>
import TheHeader from "~/components/Navigation/TheHeader.vue";
import TheSideNav from "~/components/Navigation/TheSideNav.vue";
export default {
  components: {
    TheHeader,
    TheSideNav,
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
