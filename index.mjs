import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let allCoffee = [
    {name: "Americano", image: "/static/img/americano.jpg", price: 999},
    {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999},
    {name: "Espresso", image: "/static/img/espresso.jpg", price: 699},
    {name: "Flat White", image: "/static/img/flat-white.jpg", price: 799},
    {name: "Latte", image: "/static/img/latte.jpg", price: 799},
    {name: "Latte Machchiato", image: "/static/img/latte-macchiato.jpg", price: 1099},
];
let inBasket = [];

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
    // res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: allCoffee

    });
});

// app.route('/buy/:name')
//     .get((req, res) => {
//         inBasket.push(req.params);
//         console.log(inBasket)
//         res.redirect("/menu")
//         // res.send('Get a random book')
//     })
//     .post((req, res) => {
//         console.log(2)
//         // console.log(res.items);
//         // console.log(req.items);
//         // res.send('Add a book')
//     })
//     .put((req, res) => {
//         res.send('Update the book')
//     })
app.get("/buy/:name", (req, res) => {
    for (var i = 0; i < allCoffee.length; i++) {
        if (allCoffee[i].name === req.params.name) {
            inBasket.push(allCoffee[i])
        }
    }
    console.log(inBasket)
    res.redirect("/menu")
});

app.get("/cart", (req, res) => {
    let total = 0;
    for (let i =0; i<inBasket.length;i++){
        total += inBasket[i].price
    }
    res.render("cart", {
        layout: "default",
        total: total,
        items: inBasket
    })
});

app.post("/cart", (req,res) => {
    console.log("checkout")
    inBasket = [];
    res.redirect("/menu")
});

app.post("/cart", (req, res) => {
    res.status(501).end();
});

app.get("/login", (req, res) => {
    res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
