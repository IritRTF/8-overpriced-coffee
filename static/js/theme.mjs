const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (getCookie("theme") === "dark"){
  root.classList.add("dark");
}
else{
  root.classList.remove("dark");
}

themeSwitch.checked = defaultState;
console.log(getCookie("theme"));
themeSwitch.addEventListener("click", () => {
  if (getCookie("theme") === "dark"){
    document.cookie = encodeURIComponent("theme") + '=' + encodeURIComponent("light");
    root.classList.remove("dark");
  }
  else{
    document.cookie = encodeURIComponent("theme") + '=' + encodeURIComponent("dark");
    root.classList.add("dark");
  }
});
