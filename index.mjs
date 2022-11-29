import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let cartKorz=[];
let history = []

app.use(cookieParser());
app.use("/static", express.static("static"))

const products  = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 777,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 333
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 222
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 111
  },
  {
    name: "Flat white",
    image: "/static/img/flat-white.jpg",
    price: 666
  },
  {
    name: "Latte macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 228
  },
]


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
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items:products,
    title:'Меню'
  });
});

app.get("/buy/:name", (req, res) => {
  const username = getUsername(req);

  if (cartKorz[username] === undefined) cartKorz[username] = [];
  cartKorz[username].push(products.find(product =>product.name === req.params.name));
  console.log(cartKorz[username])
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const username = getUsername(req);
  console.log(cartKorz)
  console.log(cartKorz[username])
  if (cartKorz[username] === undefined) cartKorz[username] = [];
  res.render("cart", {
    layout: "default",
    cartKorz: cartKorz[username],
    sum: cartKorz[username].reduce((sum, item) => sum + item.price, 0),
    title:"Корзина"
  })
});

app.post("/cart", (req, res) => {
  const username = getUsername(req);
  if (history[username] === undefined) history[username] = [];
  if (cartKorz[username].length > 0) {
    history[username].push({
      number: history[username].length + 1,
      items: cartKorz[username],
      totalPrice: cartKorz[username].reduce((sum, item) => sum + item.price, 0),
    });
    cartKorz[username] = []
  }
  if (cartKorz[username] !== undefined) cartKorz[username] = [];
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  const username = req.query.username || getUsername(req);
  res.cookie("username", username)
  res.render("login", {
    layout: "default",
    username: username,
    title:'Регистрация'
    }
  )
});

app.get("/history", (req, res) => {
  const username = getUsername(req);
  if (history[username] === undefined) history[username] = [];
  res.render("history", {
    layout: "default",
    history: history[username],
    title: "История",
  })
});

function getUsername(req) {
  return req.cookies.username || "Аноним"
}

app.listen(port, () => console.log(`App listening on port ${port}`));
