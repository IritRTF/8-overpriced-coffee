const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;
changeTheme()
themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  document.cookie = `color=${root.classList.value}`
  console.log(document.cookie)
});

function changeTheme(){
  let array = {};
  let coockiesArray = document.cookie.split(/; /);
  for (let i = 0, len = coockiesArray.length; i < len; i++) {
    let cookie = coockiesArray[i].split(/=/);
    array[cookie[0]] = cookie[1];
  }
  if (array.color === 'dark'){
    root.classList.toggle("dark");
  }
}