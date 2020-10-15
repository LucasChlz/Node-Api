const { User } = require('discord.js');
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', (request, response) => {

});

router.post('/create', async (request, response) => {
    const { name } = request.body;

    try {
        if (await Product.findOne({ name }))
            return response.status(400).send({ error: 'This product already exist' });

        const product = await Product.create(request.body);

        return response.send({
            product
        });

    } catch (err) {
        console.log(err)
    }
});

module.exports = app => app.use('/', router);