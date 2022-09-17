import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";
const createStore = () => {
  return new Vuex.Store({
    state() {
      return {
        loadedPosts: [],
        token: null,
      };
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return !!state.token;
      },
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          (post) => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost;
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      },
    },
    actions: {
      //     nuxtServerInit(vueContext, context) {
      //       return new Promise((resolve, reject) => {
      //         setTimeout(() => {
      //           vueContext.commit("setPosts", [
      //             {
      //               id: "1",
      //               title: "First post",
      //               previewText: "This is our first post",
      //               thumbnail:
      //                 "https://miro.medium.com/max/1400/0*Wz93rPzLLTq1VwVW",
      //             },
      //             {
      //               id: "2",
      //               title: "Second post",
      //               previewText: "This is our second post",
      //               thumbnail:
      //                 "https://miro.medium.com/max/1400/0*Wz93rPzLLTq1VwVW",
      //             },
      //             {
      //               id: "3",
      //               title: "Third post",
      //               previewText: "This is our third post",
      //               thumbnail:
      //                 "https://miro.medium.com/max/1400/0*Wz93rPzLLTq1VwVW",
      //             },
      //           ]);
      //         }, 1500);
      //         resolve();
      //       });
      //     },
      //     setPosts(context, posts) {
      //       context.commit("setPosts", posts);
      //     },

      nuxtServerInit(vueContext, context) {
        return axios.get(process.env.baseUrl + "/posts.json").then((res) => {
          const postsArray = [];
          for (const key in res.data) {
            postsArray.push({
              ...res.data[key],
              id: key,
            });
          }
          vueContext.commit("setPosts", postsArray);
        });
      },
      addPost(vuexContext, post) {
        const createdPost = { ...post, updatedDate: new Date() };
        return axios
          .post(
            "https://nuxt-blog-65c4f-default-rtdb.firebaseio.com/posts.json?auth=" +
              vuexContext.state.token,
            createdPost
          )
          .then((result) => {
            vuexContext.commit("addPost", {
              ...createdPost,
              id: result.data.name,
            });
            // this.$router.push("/admin");
          })
          .catch((error) => console.log(error));
      },
      editPost(vuexContext, editedPost) {
        return axios
          .put(
            "https://nuxt-blog-65c4f-default-rtdb.firebaseio.com/posts/" +
              editedPost.id +
              ".json?auth=" +
              vuexContext.state.token,
            editedPost
          )
          .then(() => {
            vuexContext.commit("editPost", editedPost);
          })
          .catch((error) => console.log(error));
      },
      authenticateUser(vuexContext, postData) {
        let authUrl =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          process.env.fbApiKey;
        if (postData.isLogin) {
          authUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
            process.env.fbApiKey;
        }
        return axios
          .post(authUrl, {
            email: postData.email,
            password: postData.password,
            returnSecureToken: true,
          })
          .then(({ data }) => {
            vuexContext.commit("setToken", data.idToken);
            localStorage.setItem("token", data.idToken);
            localStorage.setItem(
              "expirationDate",
              new Date().getTime() + +data.expiresIn * 1000
            );
            Cookie.set("jwt", data.idToken);
            Cookie.set(
              "expirationDate",
              new Date().getTime() + +data.expiresIn * 1000
            );
            // return axios.post("http://localhost:3000/api/track-data", {
            //   data: "Authorized!!",
            // });
          })
          .catch((err) => console.log(err));
      },

      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("jwt="));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split("=")[1];
          expirationDate = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("expirationDate="))
            .split("=")[1];
        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("expirationDate");
        }

        if (new Date().getTime() > +expirationDate || !token) {
          console.log("No Token or invalid Token");
          vuexContext.dispatch("logout");
          return;
        }
        vuexContext.commit("setToken", token);
      },
      logout(vuexContext) {
        vuexContext.commit("clearToken");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("expirationDate");
        }
      },
    },
  });
};

export default createStore;
