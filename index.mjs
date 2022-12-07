import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import { KeyObject } from "crypto";

let username = "Неизвестный";
const rootDir = process.cwd();
const port = 3000;
const app = express();
let coffeeCart = [];
const arrayWithAllCoffee = [
  { name: "Americano", image: "/static/img/americano.jpg", price: 999 },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 100 },
  { name: "Flat white", image: "/static/img/flat-white.jpg", price: 200 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 300 },
  { name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg", price: 400 },
];
let history = [];

app.use(cookieParser(""));
app.use("/static", express.static("static"))
   
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
    helpers: {
      get_sum: function (items) {
      let x = 0;
      for (let i = 0; i < items.length; i++)
      x += items[i].price;
      return x;
      }
    }
  })
);

app.get("/", (_, res) => {
  res.redirect("/menu");
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: [
      { name: "Americano", image: "/static/img/americano.jpg", price: 999 },
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
      { name: "Espresso", image: "/static/img/espresso.jpg", price: 100 },
      { name: "Flat white", image: "/static/img/flat-white.jpg", price: 200 },
      { name: "Latte", image: "/static/img/latte.jpg", price: 300 },
      { name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg", price: 400 },
    ],
    title: "MENU",
  });
});

app.get("/buy/:name", (req, res) => {
  if (coffeeCart[username] === undefined){
    coffeeCart[username] = [];}
  for (let index = 0; index < arrayWithAllCoffee.length; index++) { 
    if(arrayWithAllCoffee[index].name === req.params.name)
      coffeeCart[username].push(arrayWithAllCoffee[index])
  }
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  if (coffeeCart[username] === undefined){
    coffeeCart[username] = [];}
  res.render("cart", {
    layout: "default",
    items: coffeeCart[username],
    title: "CART",
  });
});

app.post("/cart", (req, res) => {
  history.push({user: username, allDrinks: coffeeCart[username]});
  coffeeCart[username] = [];
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  username = req.query.username || req.cookies.username || "Неизвестный";
  res.cookie("username", username);
  res.render("login", { 
    layout: "default",
    username: username,
    title: "LOGIN",
  });
});

app.get("/history", (req, res) => {
  res.render("history", { 
    layout: "default",
    title: "HISTORY",
    history: history,
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
