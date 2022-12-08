import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'))
app.use(cookieParser());

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

let items = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 200,
  },
  { 
    name: "Cappuccino", 
    image: "/static/img/cappuccino.jpg", 
    price: 200 
  },
  { 
    name: "Espresso", 
    image: "/static/img/espresso.jpg", 
    price: 150 
  },
  { 
    name: "Flat-white", 
    image: "/static/img/flat-white.jpg", 
    price: 250 
  },
  { 
    name: "Latte-macchiato", 
    image: "/static/img/latte-macchiato.jpg", 
    price: 300 
  },
  { 
    name: "Latte", 
    image: "/static/img/latte.jpg", 
    price: 250
  },
]

let users = {}

app.get("/", (_, res) => {
  //res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu')
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items,
    title: "Меню"
  });
});

app.get("/buy/:name", (req, res) => {
  createUser(req.cookies.username)
  users[req.cookies.username].cart.push(items.find(el => el.name == req.params.name))
  console.log(users)
  res.redirect('/menu')
});

app.get("/cart", (req, res) => {
  createUser(req.cookies.username)
  let cart_items_user = users[req.cookies.username].cart || []
  res.render("cart", {
    layout: "default",
    items: cart_items_user,
    sum: cart_items_user.length !== 0 ? cart_items_user.map(item => item.price).reduce((a, b) => (a + b)) : 0,
    title: "Корзина",
  });
});

app.post("/cart", (req, res) => {
  var today = new Date();
  var now = today.toLocaleString();
  users[req.cookies.username].history.push({time: now, body: users[req.cookies.username].cart})
  users[req.cookies.username].cart = []
  res.redirect('/menu')
});

app.get("/login", (req, res) => {
  let username = req.query.username || req.cookies.username || 'Ананим'
  res.cookie('username', username)
  //console.log(req.query.username)
  //console.log(req.cookies.username)
  //console.log(username)
  res.render("login", { 
    layout: "default",
    username,
    title: "Логин",
  })
});

app.get("/history", (req, res) => {
  createUser(req.cookies.username)
  res.render("history", { 
    layout: "default",
    history_list: users[req.cookies.username].history,
    title: "История"
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));

function createUser(name) {
  if (users[name] == undefined)
    users[name] = {
      history: [],
      cart: []
    }
}