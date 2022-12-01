import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import * as Console from "console";

class Drink{
    constructor(name, image, price) {
      this.name = name;
      this.image = image;
      this.price = price;
    }
}

const rootDir = process.cwd();
const port = 3001;
const app = express();
const __dirname = path.resolve()
const drinks = [new Drink("Coffee","/static/img/Coffee.png",60),
    new Drink("Mors","/static/img/Mors.png", 40),
    new Drink("Apelsin", "/static/img/Apelsin.png", 30),
    new Drink("Tea-pot", "/static/img/Tea.png",30),
    new Drink("Energy", "/static/img/Energy.png",80)]
let usersDrinks = []
let orders = []
app.use('/static', express.static('static'));
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

app.get("/orders", (req, res) => {
    const username = getUsername(req);
    if (orders[username] === undefined) orders[username] = [];
    console.log(orders[username])
    res.render("orders", {
        layout: "default",
        order: orders[username],
        title: 'Заказы'
    })
});

app.get("/", (_, res) => {
  res.redirect("/menu");
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: drinks,
    title:'Меню'
  });
});

app.get("/buy/:name", (req, res) => {
  let drinkName = req.params.name;
  drinks.forEach(function (x){
    if (x.name === drinkName)
    {
        const username = getUsername(req);
        if (usersDrinks[username] === undefined) usersDrinks[username] = [];
        usersDrinks[username].push(new Drink(x.name,x.image, x.price));
    }
  })
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    const username = getUsername(req);
    if (usersDrinks[username] === undefined) usersDrinks[username] = [];
    res.render("cart", {
        layout: "default",
        drinks: usersDrinks[username],
        sum: usersDrinks[username].reduce((sum, item) => sum + item.price, 0),
        title: 'Корзина'
    })
});

app.post("/cart", (req, res) => {
    const username = getUsername(req);
    if (orders[username] === undefined) orders[username] = [];
    if (usersDrinks[username].length > 0) {
        orders[username].push({
            number: orders[username].length + 1,
            items: usersDrinks[username],
            totalPrice: usersDrinks[username].reduce((sum, item) => sum + item.price, 0),
        });
        usersDrinks[username] = []
    }
    if (usersDrinks[username] !== undefined) usersDrinks[username] = [];
    res.redirect("/cart");
});

app.get("/login", (req, res) => {
    const username = req.query.username || getUsername(req);
    res.cookie("username", username)
    res.render("login", {
            layout: "default",
            username: username,
            title: 'Личный кабинет'
        }
    )
});

function getUsername(req) {
    return req.cookies.username || "Аноним"
}

app.listen(port, () => console.log(`App listening on port ${port}`));
