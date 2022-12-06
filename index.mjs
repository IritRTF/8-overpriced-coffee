import express from 'express';
import * as path from 'path';
import hbs from 'express-handlebars';
import cookieParser from 'cookie-parser';

const rootDir = process.cwd();
const port = 3000;
const app = express();

const users = {};

const auth = (req) => {
  const username = req.cookies?.username;
  return !!username && users[username];
};

const cart = [];
const items = [
  {
    name: 'Americano',
    image: '/static/img/americano.jpg',
    price: 999,
  },
  { name: 'Cappuccino', image: '/static/img/cappuccino.jpg', price: 999 },
  { name: 'Espresso', image: '/static/img/espresso.jpg', price: 999 },
  { name: 'Latte', image: '/static/img/latte.jpg', price: 999 },
];

app.use(cookieParser('123'));
app.use('/static', express.static('static'));

// Выбираем в качестве движка шаблонов Handlebars
app.set('view engine', 'hbs');
// Настраиваем пути и дефолтный view
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: path.join(rootDir, '/views/layouts/'),
    partialsDir: path.join(rootDir, '/views/partials/'),
  })
);

app.get('/', (req, res) => {
  if (!auth(req)) {
    res.redirect('/logout');
    return;
  }

  res.redirect('/menu');

  res.sendFile(path.join(rootDir, '/static/html/index.html'));
});

app.get('/menu', (req, res) => {
  if (!auth(req)) {
    res.redirect('/logout');
    return;
  }

  res.render('menu', {
    layout: 'default',
    items: items,
    title: 'Menu',
  });
});

app.get('/buy/:name', (req, res) => {
  if (!auth(req)) {
    res.redirect('/logout');
    return;
  }

  const username = req.cookies.username;

  items.forEach((item) => {
    if (item.name === req.params.name) {
      users[username].cart.push(item);
      // cart.push(item);
    }
  });
  res.redirect('/menu');
});

app.get('/cart', (req, res) => {
  if (!auth(req)) {
    res.redirect('/logout');
    return;
  }

  const username = req.cookies.username;

  res.render('cart', {
    layout: 'default',
    items: users[username].cart,
    title: 'Cart',
  });
});

app.post('/cart', (req, res) => {
  if (!auth(req)) {
    res.redirect('/logout');
    return;
  }

  const username = req.cookies.username;
  const history = users[username].history;
  const cart = users[username].cart;

  history.push(Array.from(cart));
  cart.length = 0;

  res.redirect('/menu');
});

app.get('/logout', (req, res) => {
  res.clearCookie('username').redirect('/login');
});

app.get('/login', (req, res) => {
  const username = req.query?.username;

  if (!username) {
    res.render('login', {
      layout: 'default',
      title: 'LogIn',
    });
    return;
  }

  if (!users[username]) {
    users[username] = {
      cart: [],
      history: [],
    };
  }
  console.log(users);
  res.cookie('username', username).redirect('/menu');
});

app.get('/history', (req, res) => {
  if (!auth(req)) {
    res.redirect('/logout');
    return;
  }

  const username = req.cookies.username;

  res.render('history', {
    layout: 'default',
    orders: users[username].history,
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
