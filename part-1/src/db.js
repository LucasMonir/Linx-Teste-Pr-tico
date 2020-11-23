const sequence = {
    _id: 1,
    get id() { return this._id++ }
};

let posts = [];
const products = {};

function getPosts() {
    return posts;
}

function updatePosts(updated) {
    posts = updated;
}

function shiftPost() {
    posts.shift();
}

function saveProduct(product) {
    if (!product.id) product.id = sequence.id;
    if (products[product.id]) {
        while (products[product.id]) {
            product.id =+ sequence.id;
        }
    }
    products[product.id] = product;
    return product;
}

function getProducts() {
    return Object.values(products);
}

module.exports = { saveProduct, getProducts, getPosts, updatePosts, shiftPost };