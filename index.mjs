import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import * as Console from "console";

const rootDir = process.cwd();
const port = 3003;
const app = express();
let history=[];

const coffes= [
  {name: "Americano", image: "/static/img/americano.jpg", price: 999 },
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  { name: "Espresso", image: "/static/img/espresso.jpg", price: 999 },
  { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 999 },
  { name: "Latte-macchiato", image: "/static/img/Latte-macchiato.jpg", price: 999 },
  { name: "Latte", image: "/static/img/latte.jpg", price: 999 }
];
const cart=[];
const users = {"Аноним":[]};
let username="Аноним";
// Выбираем в качестве движка шаблонов Handlebars
app.use(cookieParser())
app.set("view engine", "hbs");
app.use('/static', express.static('static'))
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
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('../menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffes,
    title:"Меню",
  });
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: users[username],
    title:"Корзина",
  });
});

app.get("/login", (req, res) => {
  username = req.query.username || req.cookies.username ||  "Аноним";
  if (!(username in users))
    users[username]=[];
  console.log(users)
  res.cookie("username", username);
  res.render("login", {
    layout: "default",
    username: username,
    title:"Личный кабинет",
  });

});

app.get("/history", (req, res) => {
  
  res.render("history", {
    layout: "default",
    history: history,
  });

});

app.get("/buy/:name", (req, res) => {
  coffes.forEach(element => {
    if(element.name===req.params.name)
      users[username].push(element);
  });
  res.redirect("/menu");
});

app.post("/cart", (req, res) => {
  let userCoffes=users[username].slice(0);
  history.push( {name: username, items:userCoffes});
  users[username].length=0;
  res.redirect("/menu");
});



app.listen(port, () => console.log(`App listening on port ${port}`));
