import { DEL_PAGE, LIKE_PAGE, USER_POSTS_PAGE ,TAG_POSTS_PAGE} from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { wrapHashtagsInText } from "./function.js";
import { formatDistanceToNow,parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export function renderPostsPageComponent({ appEl, id }) {
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = posts.map((comment) => {
    return `<li class="post post_${comment.id}">
                    <div class="post-header" data-user-id="${comment.user.id}">
                        <img src="${comment.user.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${comment.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${comment.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${comment.id}" data-isLiked="${comment.isLiked}" class="like-button">
                        <img src="${comment.isLiked ? `./assets/images/like-active.svg">` : `/assets/images/like-not-active.svg">`}
                      </button>
                      <p class="post-likes-text" title="${comment.likes.length>0?"Лайкнул "+comment.likes.map((names)=>names.name).join(" , "):"Никто ещё не лайкнул"}">
                        Нравится: <strong>${comment.isLiked === true && comment.likes.length > 1 ? "вам и еще " + Number(comment.likes.length - 1) :comment.likes.length}</strong>
                      </p>

                    </div>
                    <p class="post-text">
                      <span class="user-name">${comment.user.name}</span>
                      ${wrapHashtagsInText(comment.description,comment.user.id)}
                    </p>
                    <p class="post-date">
                      ${formatDistanceToNow(parseISO(comment.createdAt), {locale: ru})} назад
                    </p>
                    <p class="post-delete" data-post-id="${comment.id}">  &#10008; 
                    </p>
                  </li>
                `;
  }).join("");
  (id) ? appEl.innerHTML = `${appHtml}` :
    appEl.innerHTML = `<div class="page-container">
  <div class="header-container"></div>
  <ul class="posts">${appHtml} </ul>
  </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
  
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let like of document.querySelectorAll(".like-button")) {
    like.addEventListener("click", () => {
      like.classList.add('loading_like');
      let likeIdPost = like.dataset.postId;
      let likeCheker = like.dataset.isliked;
      goToPage(LIKE_PAGE, {
        id: likeIdPost, param: likeCheker,
      }
      );
    })
  }

  for (let tag of document.querySelectorAll(".tag")) {
    tag.addEventListener("click", () => {
      goToPage(TAG_POSTS_PAGE, {
        tagsearsh: tag.dataset.tag,
        id : tag.dataset.id,
      });
    });
  }

  for (let del of document.querySelectorAll(".post-delete")) {
    del.addEventListener("click", () => {
      const idDel = del.dataset.postId;
      goToPage(DEL_PAGE, {
        id: idDel,
      }
      );
      
 
    });
  }

}
