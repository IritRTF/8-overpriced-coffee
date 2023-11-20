import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let coffeeArray = [
  { name: "Americano", image: "/static/img/americano.jpg", price: 999 },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 999 },
  { name: "Flat White", image: "/static/img/flat-white.jpg", price: 999 },
  { name: "Latte macchiato", image: "/static/img/latte-macchiato.jpg", price: 999 },
  { name: "latte", image: "/static/img/latte.jpg", price: 999 },
]
let cart = [];

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
app.use("/static", express.static("static"))
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
  res.redirect("/menu")
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    title: 'Меню',
    items: coffeeArray
  });
});

app.get("/buy/:name", (req, res) => {
  for (let i = 0; i < coffeeArray.length; i++) {
    if (coffeeArray[i].name === req.params.name) {
      cart.push(coffeeArray[i])
    }
  }
  console.log(cart)
  res.redirect("/menu")
});

app.get("/cart", (req, res) => {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price
  }
  res.render("cart", {
    layout: "default",
    title: "Корзина",
    total: total,
    items: cart
  })
});

app.post("/cart", (req, res) => {
  cart = [];
  res.redirect("/menu")
});

app.get("/login", (req, res) => {
  let username = req.query?.username;
  if (username) {
    res.cookie("name", username);
  }
  res.render("login", {
    layout: "default",
    title: "Личный кабинет",
    user_name: username ?? "Гость",
  })
  console.log(req.query.username)
  res.cookie('username', req.query.username,)
  console.log(req)
})

app.post("/login", (req, res) => {
  console.log(req)
});

app.listen(port, () => console.log(`App listening on port ${port}`));
