const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = document.cookie.split('theme=')[1] || '';
root.classList = defaultState

themeSwitch.checked = defaultState;
themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  document.cookie =`theme=${root.classList}`
});
