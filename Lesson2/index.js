const express = require('express');
const fs = require('fs');

const app = express();
const counterFile = 'counter.json';

app.use((req, res, next) => {
  try {
    let counterData = {};

    if (fs.existsSync(counterFile)) {
      counterData = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
    }
    
    const url = req.originalUrl;
    counterData[url] = (counterData[url] || 0) + 1;
    fs.writeFileSync(counterFile, JSON.stringify(counterData, null, 2));
    req.counterData = counterData;
    next();
  } catch (err) {
    console.error('Ошибка:', err);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/', (req, res) => {
  const count = req.counterData['/'] || 0;
  res.send(`<h1>Корневая страница</h1><p>Просмотров: ${count}</p><a href="/about">Ссылка на страницу /about</a>`);
});

app.get('/about', (req, res) => {
  const count = req.counterData['/about'] || 0;
  res.send(`<h1>Страниц about</h1><p>Просмотров: ${count}</p><a href="/">Ссылка на страницу /</a>`);
});

app.listen(3000, () => {
  console.log('Сервер запущен на порте 3000');
});