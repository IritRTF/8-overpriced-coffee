import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const cart = [];
const history = [];
let username = "Аноним"
const items = [
  {name: "Americano", image: "/static/img/americano.jpg", price: 999 },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 400 },
  { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 300 },
  { name: "Latte-macchiato", image: "/static/img/Latte-macchiato.jpg", price: 200 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 100 },
]

app.use('/static', express.static('static'))
app.use(cookieParser())

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
    helpers:{
      price_sum: function (items) {
        let sum = 0;
        for (let index = 0; index < items.length; index++)
          sum += items[index].price;
        return sum;
      }
      }
  })
);

app.get("/", (_, res) => {
  res.redirect('/menu')
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: items,
    title: "Меню",
  });
});

app.get("/buy/:name", (req, res) => {
  if (cart[username] === undefined) 
    cart[username] = [];
  items.forEach(element => {
    if (req.params.name === element.name)
      cart[username].push(element)
  });
  res.redirect('/menu')
});

app.get("/cart", (req, res) => {
  if (cart[username] === undefined) 
    cart[username] = [];
  res.render("cart", {
    layout: "default",
    items: cart[username],
    title: "Корзина",
  });
});

app.get("/history", (req, res) => {
  if (cart[username] === undefined) 
    cart[username] = [];
  res.render("history", {
    layout: "default",
    order: history[username],
    title: "История заказов",
  });
});

app.post("/cart", (req, res) => {
  if (history[username] === undefined) 
    history[username] = [];
  history[username].push({cooffee: cart[username]});
  cart[username] = [];
  res.redirect('/menu');
});

app.get("/login", (req, res) => {
  username = req.query.username || req.cookies.username || "Аноним";
  res.cookie('username', username);
  res.render('login', {
    layout: 'default',
    username : username,
    title: "Личный кабинет",
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
