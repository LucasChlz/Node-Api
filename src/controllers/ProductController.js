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

router.get('/:id', async (request, response) => {
    const _id = request.params.id;
    
    try {
        const singleProduct = await Product.findOne({ _id });

        await Product.countDocuments((err, count) => {
            if (count == 0 || singleProduct === null)
                return response.status(400).send({ message: "you don't have any product registred with this id"});
            
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
        if (await Product.findOne({ name }))
            return response.status(400).send({ error: 'This product already exist' });

        const product = await Product.create({
            name,
            description,
            amount,
            price,
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

router.delete('/delete/:id', async (request, response) => {
    const _id = request.params.id;

    try {
        const deleteProduct = await Product.deleteOne({ _id });

        if (deleteProduct.n === 0)
            return response.status(400).send({ message: "you don't have any product with this name_url" });

        return response.send({
            message: 'product sucessfully deleted'
        });

    } catch (err) {
        console.log(err);
        return response.status(400).send({ message: "error trying deleted" });
    }
});

router.patch('/edit/:id', async (request, response) => {
    const _id = request.params.id;
    
    const product = await Product.findByIdAndUpdate({ _id }, request.body);

    response.send({
        message: "product sucessfully updated",
    })
});

module.exports = app => app.use('/', router);