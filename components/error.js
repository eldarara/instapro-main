
//import { errorDiv } from "../index.js";
//export const errorDiv = document.querySelector(".app_error");

export function setError(errorDiv, message) {
  errorDiv.style.visibility = 'visible';
return   errorDiv.innerHTML  = message;
}
export function hideError() {
  const errorDiv = document.querySelector(".app_error").style.visibility = 'hidden';
}


