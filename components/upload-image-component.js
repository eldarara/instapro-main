import { uploadImage } from "../api.js";
import { hideError, setError } from "./error.js";

export function renderUploadImageComponent({ element, onImageUrlChange, page = null }) {
  let imageUrl = "";
  const errorDiv = document.querySelector(".app_error");
  const render = () => {

    element.innerHTML = `${page === "ADD_POST" ? `
    ${imageUrl
        ? `<div class="upload_image">
        <div class="file-upload-image-conrainer">
          <img class="file-upload-image" src="${imageUrl}">
          <button class="file-upload-remove-button button">Заменить изображение</button>
        </div>
        </div>
        <p>Введите описание изображения</p>
          <textarea name="description" class="textarea_description" placeholder="Описание должно быть не менее 5 символов" id="comments" cols="70" rows="5"></textarea>
        `
        : `
          <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите изображение
          </label>  
    `
      }
</div> ` :
      `<div class="upload=image">
      ${imageUrl
        ? `
          <div class="file-upload-foto-conrainer">
            <img class="file-upload-foto" src="${imageUrl}">
            <button class="file-upload-remove-button button">Заменить фото</button>
          </div>
          `
        : `
            <label class="file-upload-label secondary-button">
                <input
                  type="file"
                  class="file-upload-input"
                  style="display:none"
                />
                Выберите фото
            </label>
            </div>`
      }
   ` }
`;

    const fileInputElement = element.querySelector(".file-upload-input");

    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {

        const lableEl = document.querySelector(".file-upload-label");
        lableEl.setAttribute("disabled", true);
        lableEl.textContent = "Загружаю файл...";

        uploadImage({ file }).then(({ fileUrl }) => {
          imageUrl = fileUrl;
          onImageUrlChange(imageUrl);
          render();
          hideError();

          if (document.querySelector(".textarea_description")) {
            document.querySelector(".textarea_description").addEventListener("input", (e) => {
              (e.target.value.length > 5) ? document.querySelector(".add_button").removeAttribute("disabled") : document.querySelector(".add_button").setAttribute("disabled", true);
            });
          }
        }).catch((error) => {
          if (error.message === "Failed to fetch") {
            setError(errorDiv, "Изображение не загружено, нет соединения с сервером!");
          }
          else { setError(errorDiv, error.message); }
          render();
        })
          ;
      }
    });

    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        document.querySelector(".add_button").setAttribute("disabled", true);
        imageUrl = "";
        onImageUrlChange(imageUrl);
        render();
      });
  };

  render();
}