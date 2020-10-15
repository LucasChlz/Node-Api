const { User } = require('discord.js');
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const product = await Product.find();

        await Product.countDocuments((err, count) => {
            if (count === 0) 
                return response.status(400).send({ message: "you don't have any product registred" });

            return response.send({
                message: `You have ${count} products`,
                product
            })
        })
    } catch (err) {
        return response.status(400).send({ message: 'error to trying listing products'})
    }
});

router.get('/:name_url', async (request, response) => {
    const nameUrl = request.params.name_url;
    
    try {
        const singleProduct = await Product.findOne({ name_url: nameUrl });

        await Product.countDocuments((err, count) => {
            if (count == 0 || singleProduct === null)
                return response.status(400).send({ message: "you don't have any product registred with this name_url"});
            
            return response.send({
                message: 'Product sucessfully found',
                singleProduct
            });
        });
    } catch (err) {
        console.log(err);
        return response.status(400).send({ message: "error"});
    }
});

router.post('/create', async (request, response) => {
    const { name, description, amount, price, createdAt } = request.body;

    try {

        var newName = name;
        const validateNameUrl = () => {
            newName = newName.replace(/[áàãâä]/gi, 'a');
            newName = newName.replace(/[éèêë]/gi, 'e');
            newName = newName.replace(/[íìîï]/gi, 'i');
            newName = newName.replace(/[óòõôö]/gi, 'o');
            newName = newName.replace(/[úùûü]/gi, 'u');
            newName = newName.replace(/[ç]/gi, 'c');
            newName = newName.replace(/[^a-z0-9]/gi, '_');
            newName = newName.replace(/_+/gi, '-');
            newName = newName.toLowerCase();
        
            return newName;
        }

        if (await Product.findOne({ name_url: validateNameUrl() }))
            return response.status(400).send({ error: 'This product already exist' });

        const product = await Product.create({
            name,
            description,
            amount,
            price,
            name_url: validateNameUrl(),
            createdAt
        });

        return response.send({
            product,
            message: 'product sucessfully created'
        });

    } catch (err) {
        return response.status(400).send({ message: 'error trting create product, please fill all fields'});
    }
});

router.delete('/delete', async (request, response) => {
    try {            
        const deleteProducts = await Product.deleteMany();

        if (deleteProducts.n === 0) 
            return response.status(400).send({ message: "you don't have products to deleted"});

        return response.send({
            message: 'product sucessfully deleted', 
            info: `${deleteProducts.deletedCount} products have been deleted`
        });

    } catch (err) {
        console.log(err);
        return response.status(400).send({ message: "error trying delete"});
    }
});

module.exports = app => app.use('/', router);