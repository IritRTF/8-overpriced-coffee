import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import registerHelper from "express-handlebars";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let currentUser = "Аноним";
let users = {"Аноним":[]}
let history = [ {name: "Аноним", order: [{ name: "Americano", image: "/static/img/americano.jpg", price: 999 },
                          { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
                          { name: "Espresso", image: "/static/img/espresso.jpg", price: 400 }]},
                          
                {name: "Коля", order: [{ name: "Espresso", image: "/static/img/espresso.jpg", price: 400 },
                          { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 300 },
                          { name: "Latte-macchiato", image: "/static/img/Latte-macchiato.jpg", price: 200 },
                          { name: "Latte", image: "/static/img/latte.jpg", price: 100 }]}];

let menu = [
  { name: "Americano", image: "/static/img/americano.jpg", price: 999 },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 400 },
  { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 300 },
  { name: "Latte-macchiato", image: "/static/img/Latte-macchiato.jpg", price: 200 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 100 },
]
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
    helpers: {
      get_items_total_price: function (items) {
        let x = 0;  
        for (let i = 0; i < items.length; i++) 
            x += items[i].price;
        return x;   
      }
    }
  })
);

app.get("/", (_, res) => {
  res.redirect('/menu')
});

app.get("/cart", (req, res) => {
  currentUser = req.cookies.username ||  "Аноним";
  if (users[currentUser] === undefined)
    users[currentUser] = [];
  res.render("cart", {
    layout: "default",
    items: users[currentUser],
    username : currentUser,
    title: 'Корзина'
  });
});

app.post("/cart", (_, res) => {
  history.push({name: currentUser, order: users[currentUser]});
  users[currentUser] = [];
  res.redirect('/cart');
});

function get_user_orders(){
  let orders = [];
  for (var i = 0; i < history.length; i++){
    if (currentUser === history[i].name)
      orders.push(history[i])
  }
  return orders;
}

app.get("/history", (req, res) => {
  res.render("history", {
    layout: "default",
    history : get_user_orders(),
    title: 'История заказов'
  });
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: [
      { name: "Americano", image: "/static/img/americano.jpg", price: 999 },
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
      { name: "Espresso", image: "/static/img/espresso.jpg", price: 400 },
      { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 300 },
      { name: "Latte-macchiato", image: "/static/img/Latte-macchiato.jpg", price: 200 },
      { name: "Latte", image: "/static/img/latte.jpg", price: 100 },
    ],
    title: 'Меню'
  });
});



app.get("/buy/:name", (req, res, next) => {
  
  for (let i = 0; i < menu.length; i++) {
    if (req.params.name == menu[i].name){
      users[currentUser].push(menu[i]);
      break;
    }
  }
  next()
  }, (req, res) => {
    res.redirect('/menu')
  }, 

);  

app.get("/login", (req, res) => {
  let username = req.query.username || req.cookies.username ||  "Аноним";
  currentUser = username;
  if (users[currentUser] === undefined)
    users[currentUser] = [];
  res.cookie("username", username);
  res.render("login", {
    layout: "default",
    username: currentUser,
    title: 'Личный кабинет'
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));