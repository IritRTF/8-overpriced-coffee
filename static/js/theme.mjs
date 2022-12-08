const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;
if (document.cookie.includes("theme=dark")) {
    root.classList.toggle("dark");
    themeSwitch.checked = true;
}

themeSwitch.addEventListener("click", () => {
    root.classList.toggle("dark");
    console.log(root.classList.contains("dark"));

    document.cookie = !root.classList.contains("dark") ?
        encodeURIComponent("theme") + "=" + encodeURIComponent("light") :
        document.cookie = encodeURIComponent("theme") + "=" + encodeURIComponent("dark");
});