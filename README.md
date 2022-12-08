# Overpriced coffee

В задании будем делать серверную часть для кофешопа

0. Поставь зависимости и запусти сервер. Перейди в директорию задачи и выполни команду `npm install`. После установки зависимостей, выполни команду `npm run start`. После запуска, перейди по адресу [localhost:3000](http://localhost:3001)

1. Сделай так, чтобы сервер смог отдавать статические файлы из директории `/static`. В express для этого есть middleware `express.static`. Подбробнее можно прочитать [здесь](https://expressjs.com/en/starter/static-files.html). Обрати внимание, что название директории по умолчанию не является частью пути.

2. Сделай так, чтобы при заходе на `/` (корень сайта) происходил редирект на `/menu`. Это можно сделать с помощью одного из методов [response](https://expressjs.com/en/4x/api.html#res.redirect)

3. Изучи папку `/views` и файл `menu.hbs`. Добавь в меню ещё несколько напитков. Картинки можно взять из папки `/static/img` или найти самому, например на [Unsplash](https://unsplash.com/)

4. Сделай так, чтобы сервер смог отображать страницу корзины (`/cart`). Заготовку для страницы можно найти в файле `/static/html/cart`, переделай её в `/views/cart.hbs`. На текущем этапе у всех пользователей сайта корзина будет общая

5. Сделай так, чтобы при клике на ссылку на странице меню, выбранный кофе добавлялся в корзину, а затем происходил редирект обратно в меню. Для этого пригодятся [route parameters](https://expressjs.com/en/guide/routing.html#route-parameters)

6. Сделай так, чтобы при клике на ссылку оплатить текущий заказ завершался и корзина очищалась

7. Добавь страницу `/login` на которой будет возможность заполнить своё имя. Чтобы сохранить имя используй [cookie()](https://expressjs.com/en/4x/api.html#res.cookie). Чтобы читать имя потребуются [cookies](https://expressjs.com/en/4x/api.html#req.cookies) и `cookie-parser` [middleware](https://expressjs.com/en/resources/middleware/cookie-parser.html).

Обрати внимание, что форма посылается GET запросом. Чтобы прочитать параметры используй [query](https://expressjs.com/en/4x/api.html#req.query). Не забудь поправить шаблон, чтобы в нём отображалось сохранённое имя.

Убедись, что случайно не получился [XSS](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8%D0%BD%D0%B3). В этом поможет [документация Handlebars](https://handlebarsjs.com/#html-escaping)

8. Сейчас все пользователи нашего сайта имеют общую корзину. Сделай так, чтобы у каждого нового пользователя была своя корзина

9. \* Сделай так, чтобы у каждой страницы был свой title

10. \* Сделай так, чтобы переключение тёмной темы сохранялось при переходе между страницами сайта

11. \* Добавь страницу истории, где показаны все заказы пользователя
