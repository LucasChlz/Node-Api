const { User } = require('discord.js');
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const product = await Product.find();

        await Product.countDocuments((err, count) => {
            if (count === 0) 
                return response.send({ message: "you don't have any product registred" });

            return response.send({
                product
            })
        })
    } catch (err) {
        return response.send({ message: 'error to trying listing products'})
    }
});

router.post('/create', async (request, response) => {
    const { name } = request.body;

    try {
        if (await Product.findOne({ name }))
            return response.status(400).send({ error: 'This product already exist' });

        const product = await Product.create(request.body);

        return response.send({
            product,
            message: 'product sucessfully created'
        });

    } catch (err) {
        return response.send({ message: 'error trting create product'});
    }
});

module.exports = app => app.use('/', router);