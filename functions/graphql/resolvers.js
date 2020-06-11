const { categories, categoriesActivated, category, categorySlug, createCategory,
  updateCategory, deleteCategory
} = require('./resolvers/category.resolver');
const { products, productsActivated, product, productSlug, createProduct, createProductCategory,
  updateProduct, deleteProduct, deleteProductCategory
} = require('./resolvers/product.resolver');

module.exports = {

  convertToBrazilianUTC: function (date) {

    let transformadDate = new Date(date);
    transformadDate.setHours(date.getHours() + 3);

    return transformadDate;
  },

  // Categories
  categories, categoriesActivated, category, categorySlug, createCategory,
  updateCategory, deleteCategory,

  // Product
  products, productsActivated, product, productSlug, createProduct, createProductCategory,
  updateProduct, deleteProduct, deleteProductCategory

};