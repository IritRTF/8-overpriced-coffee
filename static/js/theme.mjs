const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;
swap()
themeSwitch.addEventListener("click", () => {
    root.classList.toggle("dark");
    document.cookie = `color=${root.classList.value}`
    console.log(document.cookie)
});

function swap() {
    let obj = {};
    let cookies = document.cookie.split(/; /);
    for (let i = 0, len = cookies.length; i < len; i++) {
        let cookie = cookies[i].split(/=/);
        obj[cookie[0]] = cookie[1];
    }
    if (obj.color == 'dark') {
        root.classList.toggle("dark");
    }
}