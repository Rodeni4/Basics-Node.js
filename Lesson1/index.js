const createCounter = () => {
    let count = 0;
    return {
        increment() { ++count; },
        counter() { return count; }
    }
};

const counter1 = createCounter();
const counter2 = createCounter();

const http = require('http');
const server = http.createServer((req, res) => {

    if (req.url === '/') {
        counter1.increment();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(`<h1>Страница создана</h1><p>Просмотров ${counter1.counter()}</p><a href="/about">ссылка на страницу /about</a>`);
    } else if (req.url === '/about') {
        counter2.increment();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(`<h1>Страница about</h1><p>Просмотров ${counter2.counter()}</p><a href="/">ссылка на страницу /</a>`);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end('<h1>Ошибка 404</h1>');
    }
});

server.listen(3000);
