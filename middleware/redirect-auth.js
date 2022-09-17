export default function (context) {
  console.log("[Middleware] redirect auth");
  if (context.store.getters.isAuthenticated) {
    context.redirect("/");
  }
}
