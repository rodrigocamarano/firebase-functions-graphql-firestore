const { categories, categoriesActivated, category, categorySlug, createCategory,
  updateCategory, deleteCategory
} = require('./resolvers/category.resolver');
const { products, productsActivated, product, productSlug, createProduct, createProductCategory,
  updateProduct, deleteProduct, deleteProductCategory
} = require('./resolvers/product.resolver');

module.exports = {

  // Categories
  categories, categoriesActivated, category, categorySlug, createCategory,
  updateCategory, deleteCategory,

  // Product
  products, productsActivated, product, productSlug, createProduct, createProductCategory,
  updateProduct, deleteProduct, deleteProductCategory

};