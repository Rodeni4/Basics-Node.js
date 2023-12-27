const express = require('express');

const fs = require('fs').promises; 

const Joi = require('joi'); // Подключение библиотечки для валидации

const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    age: Joi.number().min(0).required(),
    city: Joi.string().min(2),       
});

const app = express();

app.use(express.json());

let users = [];

// Функция для чтения пользователей из файла
function readUsersFromFile() {
    return fs.readFile('users.json', 'utf8')
        .then((data) => {
            users = JSON.parse(data);
        })
        .catch((err) => {
            console.error('Ошибка чтения файла:', err);
            users = [];
        });
}

// Функция для записи пользователей в файл
function writeUsersToFile() {
    return fs.writeFile('users.json', JSON.stringify(users, null, 2), 'utf8')
        .catch((err) => {
            console.error('Ошибка записи в файл:', err);
        });
}

app.get('/users', (req, res) => {
    readUsersFromFile()
        .then(() => {
            res.send({ users });
        });
});

app.get('/users/:id', (req, res) => {
    const user = users.find((user) => user.id === +(req.params.id));
    readUsersFromFile()
        .then(() => {            
            if (user) {
                res.send({ user });
            } else {
                res.status(404).send({ user: null });
            }
        });
});

app.post('/users', (req, res) => {
    const result = userSchema.validate(req.body);

    if (result.error) {
        return res.status(500).send({ error: result.error.details });
    }

    const userId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    readUsersFromFile()
        .then(() => {           
            users.push({
                id: userId,
                ...req.body,
            });
            return writeUsersToFile();  // Возвращаем промис для обработки успешной записи
        })
        .then(() => {
            res.send({ id: userId });  // Отправляем ответ только после успешной записи
        })
        .catch((err) => {
            console.error('Ошибка при добавлении пользователя:', err);
            res.status(500).send('Ошибка сервера');
        });
});

app.put('/users/:id', (req, res) => {
    const result = userSchema.validate(req.body);

    if (result.error) {
        return res.status(500).send({ error: result.error.details });
    }

    const userId = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === userId);

    readUsersFromFile()
        .then(() => {
            if (index !== -1) {
                users[index] = { id: userId, ...req.body };                
                return writeUsersToFile().then(() => {
                    res.send({ user: users[index] });
                });   
            } else {
                res.status(404).send({ user: null });
            }
        })             
        .catch((err) => {
            console.error('Ошибка при обновлении пользователя:', err);
            res.status(500).send('Ошибка сервера');
        });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    readUsersFromFile()
        .then(() => {
            const index = users.findIndex(user => user.id === userId);
            if (index !== -1) {
                users.splice(index, 1);
                return writeUsersToFile().then(() => {
                    res.send('Пользователь успешно удален');          
                }); 
            } else {
                res.status(404).send('Пользователь не найден');
            }
        })
        .catch((err) => {
            console.error('Ошибка при удалении пользователя:', err);
            res.status(500).send('Ошибка сервера');
        });
});

app.listen(3000, () => {
    readUsersFromFile()
        .then(() => {
            console.log('Сервер запущен на порте 3000');
        });
});
