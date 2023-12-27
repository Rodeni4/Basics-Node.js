const express = require('express');

// Подключение библиотечки для валидации
const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    age: Joi.number().min(0).required(),
    city: Joi.string().min(2),       
});

const app = express();

app.use(express.json());

const users = [];
let uId = 0;

app.get('/users', (req, res) => {
    res.send({ users });
});

app.get('/users/:id', (req, res) => {
    const user = users.find((user) => user.id === +(req.params.id));
    if(user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }    
});

app.post('/users', (req, res) => {
    const result = userSchema.validate(req.body); 

    if (result.error) {
        return res.status(500).send({ error: result.error.details })

    };

    uId += 1;
    users.push({
        id: uId,
        ...req.body,
    });
    res.send({ id: uId });
});

app.put('/users/:id', (req, res) => {
    const result = userSchema.validate(req.body); 

    if (result.error) {
        return res.status(500).send({ error: result.error.details })

    };

    const user = users.find((user) => user.id === +(req.params.id));
    
    if(user) {
        user.name = req.body.name;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.city = req.body.city;

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete('/users/:id', (req, res) => {
    const user = users.find((user) => user.id === +(req.params.id));
    
    if(user) {
        const userIndex = users.indexOf(user);

        users.splice(userIndex, 1);

        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});


app.listen(3000);