import { addPost, getPosts, getUserPost, getLike, delPost } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LIKE_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
  DEL_PAGE,
  TAG_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { renderUserPostPageComponent } from "./components/user-post-page-component.js";

import { setError } from "./components/error.js";
import { sleep } from "./components/function.js";
const errorDiv = document.querySelector(".app_error");
export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
      LIKE_PAGE,
      DEL_PAGE,
      TAG_POSTS_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {

      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          const errorDiv = document.querySelector(".app_error");
          if (error === 'Failed to fetch') {
            setError(errorDiv, 'Остутстует интернет , или сервер не доступен.');
          }
          setError(errorDiv, 'Непредвиденная ошибка , попробуте перезагрузить страницу');
          sleep(5000);
          goToPage(POSTS_PAGE);

        });
    }

    if (newPage === USER_POSTS_PAGE) {
      const errorDiv = document.querySelector(".app_error");
      // TODO: реализовать получение постов юзера из API
      const id = data.userId;
      return getUserPost({ id, token: getToken() })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          setError(errorDiv, error);

          goToPage(USER_POSTS_PAGE);
        });

    }
    if (newPage === DEL_PAGE) {

      delPost({ token: getToken(), id: data.id });
      page = POSTS_PAGE;
      goToPage(POSTS_PAGE);
    }
    if (newPage === TAG_POSTS_PAGE) {
 
      function filterItems(query) {
        return posts.filter(function (el) {
          return el.description.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
      }
      const appEl = document.getElementById("app");
      const id = data.id;
      posts = filterItems(data.tagsearsh);
      return renderPostsPageComponent({
        appEl,
      });

    }
    if (newPage === LIKE_PAGE) {
      const id = data.id;
      const param = data.param;
      const onLike = id;
      const appEl = document.querySelector(`.post_${id}`);
    return getLike({ id, token: getToken(), like: param })
        .then((newPosts) => {
          posts.splice(0, posts.length);
          posts.push(newPosts);
          return renderPostsPageComponent({
            appEl, id,
          });
        })
        .catch((error) => {
          const errorDiv = document.querySelector(".app_error");
          if (error === 'Failed to fetch') {
            setError(errorDiv, 'Остутстует интернет , или сервер не доступен.');
          }
          setError(errorDiv, 'Непредвиденная ошибка , попробуте перезагрузить страницу');
          goToPage(AUTH_PAGE);
        });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // TODO: реализовать добавление поста в API
        return addPost({ token: getToken(), description, imageUrl })
          .then((newPosts) => {
            page = POSTS_PAGE;
            goToPage(POSTS_PAGE);
            renderApp();
          })
          .catch((error) => {
            const errorDiv = document.querySelector(".app_error");
            setError(errorDiv, error);
          });
      },
    });

  }



  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографию пользвателя
    return renderUserPostPageComponent({
      appEl,
    });



    appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    return;
  }
};




goToPage(POSTS_PAGE);
