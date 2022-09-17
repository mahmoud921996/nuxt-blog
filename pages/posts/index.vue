<template>
  <div class="page-posts">
    <PostsList :posts="loadedPosts" />
  </div>
</template>

<script>
export default {
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts;
    },
  },
};
</script>
<style scoped>
.page-posts {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
