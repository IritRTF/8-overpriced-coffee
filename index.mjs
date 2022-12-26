import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
const rootDir = process.cwd();
const port = 3000;
const app = express();
let secret = "my_secret";

app.use(cookieParser(secret));

const ALL_KINDS = [
    {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 300,
    },
    {
        name: "Cappuccino",
        image: "/static/img/cappuccino.jpg",
        price: 250,
    },
    {
        name: "espresso",
        image: "/static/img/espresso.jpg",
        price: 199,
    },
    {
        name: "flat-white",
        image: "/static/img/flat-white.jpg",
        price: 349,
    },
    {
        name: "latte",
        image: "/static/img/latte.jpg",
        price: 219,
    },
];

const cart = {};

const history = {};
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");

app.use("/static", express.static("static"));

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
    res.clearCookie("name");
    res.sendFile(path.join(rootDir, "/static/html/index.html"));
    res.redirect("/menu");
});

app.get("/menu", (req, res) => {
    if (req.cookies?.name) {
        res.render("menu", {
            layout: "default",
            title: "Меню",
            items: ALL_KINDS,
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/cart", (req, res) => {
    let username = req.cookies?.name;
    if (username) {
        let c = cart[username];
        res.render("cart", {
            layout: "default",
            title: "Корзина",
            total_price: c.map((c) => c.price).reduce((p, c) => p + c, 0),
            items: c,
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/buy/:name", (req, res) => {
    let username = req.cookies?.name;
    if (username) {
        let name_drink = req.params.name;
        let drink = ALL_KINDS.find((v) => v.name === name_drink);

        if (drink) {
            cart[username].push(drink);
            res.redirect("/menu");
        } else {
            res.status(404).end();
        }
    } else {
        res.redirect("/login");
    }
});

app.post("/cart", (req, res) => {
    let username = req.cookies?.name;
    if (username) {
        history[username].push(cart[username].slice());
        cart[username].length = 0;
        res.redirect("/cart");
    } else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    let username = req.query?.username;
    if (username) {
        res.cookie("name", username);
        if (!(username in cart)) {
            cart[username] = [];
            history[username] = [[]];
        }
    }

    res.render("login", {
        layout: "default",
        title: "Личный кабинет",
        name_user: username ?? "Аноним",
    });
});

app.get("/history", (req, res) => {
    let username = req.cookies?.name;
    if (!username) {
        res.redirect("/login");
    } else {
        res.render("history", {
            layout: "default",
            title: "История",
            helpers: {
                getTotalCount: (c) => console.log(history[username]),
            },

            carts: history[username],
        });
    }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
