import express from 'express';
import data from './data.js';

const app = express();


app.get('/', (req, res) => {
    res.send(`<h1 style="text-align: center; background-color: powderblue">Server at http://localhost:${port}</h1>`);
});

app.get('/api/products', (req, res) => (
    res.send(data.products))
);

app.get('/api/product/:slug', (req, res) => {
    console.log(req.params);
    const product = data.products.find((x) => (x.slug === req.params.slug));
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found.' });
    }
  
});

const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
    console.log(`Server at http://localhost:${port}`);
});