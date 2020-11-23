const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cluster = require('cluster');
const cpus = require('os').cpus().length;
const porta = 3000;
const app = express();

if (cluster.isMaster) {
    for (let i = 0; i < cpus; i++) {
        worker = cluster.fork();
        console.log(`Starting up worker N: ${worker.id}`);
    }
} else {
    function filter(id, name, user) {
        let flag = false;
        let posts = db.getPosts();

        if (posts.length != 0) posts.some(e => {
            if (posts.some(p => (p.id === id && p.name === name)
                && (p.user === user))) {
                flag = true;
            }
        });

        let product = ({ id: id, name: name, user: user });

        if (flag) {
            return flag;
        } else {
            addProduct(product, posts);
            return flag;
        }
    }

    async function addProduct(product, posts) {
        posts.push(product);
        if (posts.length == 1) addTimer(product, posts);
    }

    function addTimer(product, posts) {
        setTimeout(() => {
            posts.shift();
        }, 1000 * 600);
    }

    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/products', (req, res, next) => {
        res.send(db.getProducts());
    });

    app.post('/products', (req, res, next) => {
        const product = {
            id: parseInt(req.body.id),
            user: req.body.user,
            name: req.body.name
        };

        let flag = filter(product.id, product.name, product.user);

        if (!flag) {
            db.saveProduct(product);
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    })

    app.listen(porta, () => {
        console.log(`Port: ${porta} (localhost)`);
    });
}