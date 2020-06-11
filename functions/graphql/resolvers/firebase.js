const admin = require('firebase-admin');

admin.initializeApp();

const dbCategories = admin.firestore().collection("categories");
const dbProducts = admin.firestore().collection("products");

module.exports = {
    dbCategories,
    dbProducts
}
