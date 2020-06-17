const { dbCategories, dbProducts } = require('./firebase');

const getAllCategories = async nested => {
    const categories = [];
    if (nested === false) {
        await dbCategories
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    categories.push({
                        id: doc.id,
                        title: doc.data().title,
                        slug: doc.data().slug,
                        isFeatured: doc.data().isFeatured,
                        createdAt: doc.data().createdAt.toDate().toISOString(),
                        updatedAt: doc.data().updatedAt.toDate().toISOString()
                    })
                });
            });
        return categories;
    }
};

const getAllProducts = async nested => {
    const products = [];
    if (nested === false) {
        await dbProducts
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    products.push({
                        id: doc.id,
                        title: doc.data().title,
                        slug: doc.data().slug,
                        description: doc.data().description,
                        details: doc.data().details,
                        price: doc.data().price,
                        isService: doc.data().isService,
                        isActivated: doc.data().isActivated,
                        isFeatured: doc.data().isFeatured,
                        categories: doc.data().categories,
                        createdAt: doc.data().createdAt.toDate().toISOString(),
                        updatedAt: doc.data().updatedAt.toDate().toISOString()
                    })
                });
            });
        return products;
    }
};

const getListProducts = async (docs, nested) => {
    const items = [];
    docs.forEach(doc => {
        items.push({
            id: doc.id,
            title: doc.data().title,
            slug: doc.data().slug,
            description: doc.data().description,
            details: doc.data().details,
            price: doc.data().price,
            isService: doc.data().isService,
            isActivated: doc.data().isActivated,
            isFeatured: doc.data().isFeatured,
            categories: doc.data().categories,
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString()
        });
    });
    const allCategories = await getAllCategories(false);
    const getCategories = categories => {
        const result = [];
        categories.forEach(async category => {
            allCategories.forEach(element => {
                if (category === element.id) {
                    result.push({
                        ...element
                    });
                }
            });
        });
        result.sort((a, b) => {
            if (a.title > b.title) {
                return 1;
            }
            if (a.title < b.title) {
                return -1;
            }
            return 0;
        });
        return result;
    };
    return items.map(item => {
        return {
            ...item,
            categories: getCategories(item.categories)
        }
    });
};

const getListCategories = async (docs, nested) => {
    const items = [];
    docs.forEach(doc => {
        items.push({
            id: doc.id,
            title: doc.data().title,
            slug: doc.data().slug,
            isFeatured: doc.data().isFeatured,
            products: doc.data().products,
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString()
        });
    });
    const allProducts = await getAllProducts(false);
    const getProducts = products => {
        const result = [];
        products.forEach(async product => {
            allProducts.forEach(element => {
                if (product === element.id) {
                    result.push({
                        ...element
                    });
                }
            });
        });
        result.sort((a, b) => {
            if (a.title > b.title) {
                return 1;
            }
            if (a.title < b.title) {
                return -1;
            }
            return 0;
        });
        return result;
    };

    return items.map(item => {
        return {
            ...item,
            products: getProducts(item.products)
        }
    });
};

const getProduct = async (doc, nested) => {
    if (doc) {
        let product = {
            id: doc.id,
            title: doc.data().title,
            slug: doc.data().slug,
            description: doc.data().description,
            details: doc.data().details,
            price: doc.data().price,
            isService: doc.data().isService,
            isActivated: doc.data().isActivated,
            isFeatured: doc.data().isFeatured,
            categories: doc.data().categories,
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString()
        };
        const getCategories = await getAllCategories(false);
        const categories = [];
        product.categories.forEach(item => {
            getCategories.forEach(c => {
                if (c.id == item) {
                    categories.push(c);
                }
            });

            categories.sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                return 0;
            });
            if (nested === true) {
                product.categories = categories;
            }
        });

        return product;
    }
    else {
        const error = new Error('No product found!');
        error.code = 404;
        throw error;
    }
};

const getCategory = async (doc, nested) => {
    if (doc) {
        let category = {
            id: doc.id,
            title: doc.data().title,
            slug: doc.data().slug,
            isFeatured: doc.data().isFeatured,
            products: doc.data().products,
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString()
        };
        const getProducts = await getAllProducts(false);
        const products = [];
        category.products.forEach(item => {
            getProducts.forEach(p => {
                if (p.id == item) {
                    products.push(p);
                }
            });
            products.sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                return 0;
            });
            if (nested === true) {
                category.products = products;
            }
        });
        return category;
    }
    else {
        const error = new Error('No category found!');
        error.code = 404;
        throw error;
    }
};

module.exports = {
    getAllCategories,
    getListProducts,
    getListCategories,
    getProduct,
    getCategory
}
