
import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { setError } from "./error.js";


export function renderAuthPageComponent({ appEl, setUser }) {
  let isLoginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${isLoginMode
        ? "Вход в&nbsp;Instapro"
        : "Регистрация в&nbsp;Instapro"
      }
                </h3>
              <div class="form-inputs">
    
                  ${!isLoginMode
        ? `
                      <div class="upload-image-container"></div>
                      <input type="text" id="name-input" class="input" placeholder="Имя" />
                      `
        : ""
      }
                  
                  <input type="text" id="login-input" class="input" placeholder="Логин" />
                  <input type="password" id="password-input" class="input" placeholder="Пароль" />
                  
                  <div class="form-error"></div>
                  
                  <button disabled="true" class="add_button" id="login-button">${isLoginMode ? "Войти" : "Зарегистрироваться"
      }</button>
              </div>
            
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Зарегистрироваться." : "Войти."}
                  </button>
                </p> 
               
              </div>
          </div>
      </div>    
`;

    appEl.innerHTML = appHtml;

    document.querySelector(".form-inputs").addEventListener("input", (e) => {
      let inputs = document.querySelectorAll(".input");
      let check = [];

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length > 5) {
          check.push(i);
        }
        document.querySelector(".add_button").setAttribute("disabled", true);
      }
      if (check.length === inputs.length) {
        document.querySelector(".add_button").removeAttribute("disabled");
        check = [];
      }
    });


    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
        page: "AUTH",
      });
    }
    document.getElementById("login-button").addEventListener("click", () => {
      if (isLoginMode) {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;
        const errorDiv = document.querySelector(".app_error");
        if (!login) {
          setError(errorDiv, "Введите логин");
          return;
        }

        if (!password) {
          setError(errorDiv, "Введите пароль");
          return;
        }

        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            setError(errorDiv, error.message);
          });
      } else {
        const login = document.getElementById("login-input").value;
        const name = document.getElementById("name-input").value;
        const password = document.getElementById("password-input").value;
        const errorDiv = document.querySelector(".app_error");
        if (!name) {
          setError(errorDiv, "Введите имя");
          return;
        }
        if (!login) {
          setError(errorDiv, "Введите логин");
          return;
        }

        if (!password) {
          setError(errorDiv, "Введите пароль");
          return;
        }

        if (!imageUrl) {
          setError(errorDiv, "Не выбрана фотография");
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
          imageUrl,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(errorDiv, error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };
  renderForm();




}


/*а*/