import { LIKE_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { wrapHashtagsInText } from "./function.js";

export function renderUserPostPageComponent({ appEl }) {



  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = posts.map((comment, likes) => {
    return `<li class="post post_${comment.id}">
                      <div class="post-header" data-user-id="${comment.user.id}">
                          <img src="${comment.user.imageUrl}" class="post-header__user-image">
                          <p class="post-header__user-name">${comment.user.name}</p>
                      </div>
                      <div class="post-image-container">
                        <img class="post-image" src="${comment.imageUrl}">
                      </div>
                      <div class="post-likes">
                        <button data-post-id="${comment.id}" class="like-button">
                          <img src="${comment.isLiked ? `./assets/images/like-active.svg">` : `/assets/images/like-not-active.svg">`}
                        </button>
                        <p class="post-likes-text" title="${comment.likes.length > 0 ? "Лайкнул " + comment.likes.map((names) => names.name).join(" , ") : "Никто ещё не лайкнул"}">
                          Нравится: <strong>${comment.isLiked === true && comment.likes.length > 1 ? "вам и еще " + Number(comment.likes.length - 1) : comment.likes.length}</strong>
                        </p>
                      </div>
                      <p class="post-text">
                        <span class="user-name">${comment.user.name}</span>
                        ${wrapHashtagsInText(comment.description, comment.user.id)}
                      </p>
                      <p class="post-date">
                      ${formatDistanceToNow(parseISO(comment.createdAt), { locale: ru })} назад
                      </p>
                      <p class="post-delete" data-post-id="${comment.id}">  &#10008; 
                    </p>
                    </li>
                  `;
  }).join("");
  appEl.innerHTML = `<div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">${appHtml} </ul>
    </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

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

}
/*а*/