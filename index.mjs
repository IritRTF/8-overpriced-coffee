import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";


const rootDir = process.cwd();
const port = 3000;
const app = express();


// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view

app.use("/static", express.static("static"));
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/"),
  })
);
app.use(cookieParser("secret"));
let cart={};
let history={}
const drinks = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  { 
    name: "Cappuccino", 
    image: "/static/img/cappuccino.jpg",
    price: 999 
  },
  {
    name: "Espresso", 
    image: "/static/img/espresso.jpg",
    price: 999 
  },
  {
    name: "Flat-White", 
    image: "/static/img/flat-white.jpg",
    price: 999 
  },
  {
    name: "Latte-macchiato", 
    image: "/static/img/latte-macchiato.jpg",
    price: 999 
  },
  {
    name: "Latte", 
    image: "/static/img/latte.jpg",
    price: 999 
  }
];

app.get("/", (_, res) => {
  res.clearCookie("name");
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    title:"Menu",
    items: drinks,
  });
});


app.get("/buy/:name", (req, res) => {
  let username = req.cookies.name;
  console.log(username);
  if (username){
    let drink = req.params.name;
    let drinkName = drinks.find((item) => item.name === drink);
    cart[username].push(drinkName);
  res.redirect('/menu');
}
  else{
    res.redirect('/login');
  }
  
});

app.get("/cart", (req, res) => {
  let username = req.cookies.name
  if (username){
    res.render('cart', {
    layout: "default",
    title : "Cart",
    total_price: cart[username].map((item) => item.price).reduce((pr, sum)=>pr+sum,0),
    items:cart[username],
  })
  }
  else{
    res.redirect('/login');
  } 
});

app.post("/cart", (req, res) => {
  let username = req.cookies.name;
  history[username]=history[username].concat(cart[username]);
  console.log(history[username]);
  cart[username]=[];
  res.redirect('/cart');
});

app.get("/login", (req, res) => {
  let username = req.query.username;
  if (username){
    res.cookie("name", username);
    if (!(username in cart)) {
      history[username]=[];
      cart[username] = [];  
  }
  }
  res.render('login', {
    layout: "default",
    title:"Login",
    user_name: username || "Аноним"
  });
});
  
app.get("/history", (req, res) => {
  let username = req.cookies.name
  if (username){
    res.render('history', {
    layout: "default",
    title : "History",
    total_price: history[username].map((item) => item.price).reduce((pr, sum)=>pr+sum,0),
    items:history[username],
  })
  }
  else{
    res.redirect('/login');
  } 
});
  
app.post("/history",(req,res)=>{
  let username = req.cookies.name;
  history[username] = [];
  res.redirect("/history");
});
app.listen(port, () => console.log(`App listening on port ${port}`));
