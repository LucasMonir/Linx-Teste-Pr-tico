const express = require('express');
const bodyParser = require('body-parser');
const banco = require('./db');
const cluster = require('cluster');
const cpus = require('os').cpus().length;
const porta = 3000;

const app = express();

let posts = [];

if (cluster.isMaster) {
    for (let i = 0; i < cpus; i++) {
        let worker = cluster.fork();
        console.log(`Starting up worker N: ${worker.id}`);
    }
} else {
    function filter(id, name, user) {
        let flag = false;
        let product = { id: id, name: name, user: user };

        if (posts.length != 0) posts.forEach(e => {
            if (((e.user == user) && (e.id == id) && (e.name == name))) {
                flag = true;
            }
        });

        if (flag) {
            return flag;
        } else {
            addProduct(product);
            return flag;
        }
    }

    function addProduct(product) {
        posts.push(product);
        if (posts.length == 1) addTimer(product);
    }

    function addTimer(product) {
        setTimeout(() => {
            posts.shift();
        }, 1000 * 600);
    }

    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/products', (req, res, next) => {
        res.send(banco.getProducts());
    });

    app.get('/products/:id', (req, res, next) => {
        res.send(banco.getProduct(req.params.id));
    });

    app.post('/products', (req, res, next) => {
        const product = {
            id: parseInt(req.body.id),
            user: req.body.user,
            name: req.body.name
        };

        let flag = filter(product.id, product.name, product.user);

        if (!flag) {
            banco.saveProduct(product);
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    })

    app.put('/products/:id', (req, res, next) => {
        const product = banco.salvarProduct({
            id: req.body.id,
            name: req.body.name,
            user: req.body.user
        })

        res.send(product);
    });

    app.listen(porta, () => {
        console.log(`Port: ${porta} (localhost)`);
    });
}