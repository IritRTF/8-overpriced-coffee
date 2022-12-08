const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");
// localStorage.setItem('theme', 'light');

themeSwitch.checked = defaultState;
root.classList.value = localStorage.getItem('theme');
themeSwitch.addEventListener("click", () => {
  // localStorage.theme = 'dark';
  root.classList.toggle('dark');
  localStorage.theme = root.classList.value;
  // root.classList.toggle(localStorage.theme);
  // alert( localStorage.getItem('theme') );
});
