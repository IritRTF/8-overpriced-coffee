import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let carts = {};
let historyUsers = {};
let drinks = [
    { name: "Americano", image: "/static/img/americano.jpg", price: 109, },
    { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 29 },
    { name: "Flat-White", image: "/static/img/flat-white.jpg", price: 340 },
    { name: "Latte", image: "/static/img/latte.jpg", price: 1000 },
    { name: "Espresso", image: "/static/img/espresso.jpg", price: 1000 },
    { name: "Б-52", image: "https://hurricaneworld.ru/wp-content/uploads/3fd3d353118561d3e5e009a9c613045c.jpg", price: 2000 },
];

app.use(cookieParser());

app.use('/static', express.static('static'));
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "/views/layouts/"),
        partialsDir: path.join(rootDir, "/views/partials/"),
    })
);

app.get("/", (_, res) => {
    res.redirect('/menu');
    res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: drinks,
        title: "Напитки"
    });
});

app.get("/buy/:name", (req, res) => {
    if (!req.cookies.name) {
        res.redirect("/login");
        return;
    }
    carts[req.cookies.name].push(drinks.find(d => d.name === req.params.name));
    res.redirect('/menu');
});

app.get("/cart", (req, res) => {
    res.render("cart", {
        layout: "default",
        totalPrice: carts[req.cookies.name] ? carts[req.cookies.name].reduce((prev, curr) => prev + curr.price, 0) : 0,
        items: carts[req.cookies.name],
        title: "Корзина"
    });
});

app.post("/cart", (req, res) => {
    historyUsers[req.cookies.name].push({ drinks: carts[req.cookies.name] });
    carts[req.cookies.name] = []
    res.redirect("/cart");
});

app.get("/login", (req, res) => {
    let userName;
    if (req.query.username) {
        userName = req.query.username;
        res.cookie("name", userName);
    } else if (req.cookies && req.cookies.name) {
        userName = req.cookies.name;
    }

    if (!carts[userName])
        carts[userName] = [];
    if (!historyUsers[userName])
        historyUsers[userName] = [];
    res.render("login", {
        layout: "default",
        param: userName || "Аноним",
        title: "Личный кабинет",
        history: historyUsers[userName]
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));