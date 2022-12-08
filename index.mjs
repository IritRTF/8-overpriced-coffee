import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
// const port = 3000;
const port = 3001;
const app = express();

class Coffee {
  constructor(name, image, price) {
    this.name = name;
    this.image = image;
    this.price = price;
  }
};

class User {
  constructor(userName){
    this.userName = userName;
    this.cart = [];
    this.costCart = 0;
    this.historyCart = [];
  }

  buy (itemName) {
    for(let i = 0; i < menu.length; i++){
      if(itemName == menu[i].name) {
        this.cart.push(menu[i]);
        this.costCart += menu[i].price;
      }
    }
  }
}

let users = [];
let costCart = 0;
let historyCart = [];

let menu = [ 
  new Coffee("Americano", "/static/img/americano.jpg", 180),
  new Coffee("Cappuccino", "/static/img/cappuccino.jpg", 200),
  new Coffee("Espresso", "/static/img/espresso.jpg", 220),
  new Coffee("Flat White", "/static/img/flat-white.jpg", 205),
  new Coffee("Latte Macchiato", "/static/img/latte-macchiato.jpg", 230),
  new Coffee("Latte", "/static/img/latte.jpg", 210),
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

app.use(cookieParser());
app.use('/static' ,express.static('static'));

app.get("/", (_, res) => {
  
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    title: 'Menu',
    items: menu,
  });
});

app.get("/buy/:name", (req, res) => {
  let currentUser = req.cookies.userName;
  console.log(currentUser);
  // console.log(users);
  if(currentUser === undefined || currentUser === 'Аноним'){
    res.redirect('/login');
  }
  else {
    for(let i = 0; i < menu.length; i++){
      if(req.params.name == menu[i].name) {
        // if(users[currentUser].length) users[currentUser][0] = 0;
        // users[currentUser][0] += menu[i].price
        users[currentUser].push(menu[i]);
      }
    }
  }
  console.log(users);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  let currentUser = req.cookies.userName;
  res.render("cart", {
    layout: "default",
    title: 'Cart',
    items: users[currentUser],
    cost: costCart,
  });
});

app.post("/cart", (req, res) => {
  cart = [];
  costCart = 0;
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  let currentUser = req.query.username || req.cookies.username ||  "Аноним";

  res.cookie("userName", currentUser);
  checkAuthorization(currentUser);
  console.log(currentUser);

  res.render("login", {
    layout: "default",
    userName: currentUser,
    title: 'Личный кабинет'
  });
});

app.get("/history", (req, res) => {
  let currentUser = req.cookies.userName;

  res.render("history", {
    layout: "default",
    history: historyCart[currentUser],
    title: 'История заказов'
  });

});

function checkAuthorization(userName) {
  if(users[userName] === undefined){
    users[userName]=[];
  }
}
app.listen(port, () => console.log(`App listening on port ${port}`));
