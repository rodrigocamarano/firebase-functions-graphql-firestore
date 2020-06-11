const validator = require('validator');
const slug = require('slug');
const { dbProducts, dbCategories } = require('./firebase');
const { getListProducts, getListProductsActivated, getProduct, getCategory } = require('./collections');

module.exports = {

    // Queries
    products: async ({ filter, sortField, sortOrder, page, pageSize }) => {
        if (!sortField) {
            sortField = "createdAt";
        }
        if (!sortOrder) {
            sortOrder = "desc";
        }
        if (!page || page < 0) {
            page = 1;
        }
        if (!pageSize || pageSize < 0) {
            pageSize = 1000;
        }
        let totalRecords;
        let items = [];
        if (!filter || validator.isEmpty(filter) || !validator.isLength(filter, { min: 3 })) {

            await dbProducts
                .get()
                .then(docs => {
                    totalRecords = docs.size;
                    return
                });
            await dbProducts
                .orderBy(sortField, sortOrder)
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .get()
                .then(async docs => {
                    items = await getListProducts(docs, true);
                    return
                });
        }
        else {
            console.log(slug(filter, { lower: true }));
            await dbProducts
                .where('slug', '>=', slug(filter, { lower: true }))
                .where('slug', '<=', slug(filter, { lower: true }) + '\uf8ff')
                .get()
                .then(docs => {
                    totalRecords = docs.size;
                    return
                });
            await dbProducts
                .where('slug', '>=', slug(filter, { lower: true }))
                .where('slug', '<=', slug(filter, { lower: true }) + '\uf8ff')
                .orderBy('slug', sortOrder)
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .get()
                .then(async docs => {
                    items = await getListProducts(docs, true);
                    return
                });
        }
        const totalPages = Math.ceil(totalRecords / pageSize);
        return {
            products: items,
            totalRecords,
            totalPages
        };
    },
    product: async ({ id }) => {
        let product;
        await dbProducts
            .doc(id)
            .get()
            .then(async doc => {
                product = await getProduct(doc, true);
                return
            })
            .catch(() => {
                const error = new Error('No product found!');
                error.code = 404;
                throw error;
            });
        return product;
    },

    // Mutations
    createProduct: async ({ productInput }) => {
        const errors = [];
        if (validator.isEmpty(productInput.title.trim())) {
            errors.push({ message: 'Title cannot be null.' });
        }
        if (!validator.isLength(productInput.title.trim(), { max: 63 })) {
            errors.push({ message: 'Title must be at most 63 characters.' });
        }
        if (validator.isEmpty(productInput.description.trim())) {
            errors.push({ message: 'Description cannot be null.' });
        }
        if (!validator.isLength(productInput.description.trim(), { min: 120, max: 160 })) {
            errors.push({ message: 'Description must be 120 to 160 characters.' });
        }
        if (validator.isEmpty(productInput.details.trim())) {
            errors.push({ message: 'Details cannot be null.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const createProduct = await dbProducts.where("slug", "==", slug(productInput.title.trim(), { lower: true })).get()
            .then(async docs => {
                if (docs.size === 0) {
                    let created;
                    await dbProducts.add({
                        title: productInput.title.trim(),
                        slug: slug(productInput.title.trim(), { lower: true }),
                        description: productInput.description,
                        details: productInput.details,
                        price: productInput.price,
                        isService: productInput.isService,
                        isActivated: productInput.isActivated,
                        isFeatured: productInput.isFeatured,
                        categories: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                        .then(async successeCreated => {
                            await dbProducts
                                .doc(successeCreated.id)
                                .get()
                                .then(async lastCreated => {
                                    created = await getProduct(lastCreated, true);
                                });
                        });
                    return created;
                }
                else {
                    const error = new Error('Product exists already!');
                    error.code = 404;
                    throw error;
                }
            });
        return createProduct;
    },
    createProductCategory: async ({ productId, categoryId }) => {
        const GetProduct = async productId => {

            let product;
            await dbProducts
                .doc(productId)
                .get()
                .then(async doc => {
                    product = await getProduct(doc, false);
                    return
                })
                .catch(() => {
                    const error = new Error('No product found!');
                    error.code = 404;
                    throw error;
                });
            return product;
        };

        const GetCategory = async categoryId => {

            let category;
            await dbCategories
                .doc(categoryId)
                .get()
                .then(async doc => {
                    category = await getCategory(doc, false);
                    return
                })
                .catch(() => {
                    const error = new Error('No category found!');
                    error.code = 404;
                    throw error;
                });

            return category;
        };

        const product = await GetProduct(productId);
        const category = await GetCategory(categoryId);

        let existsInProduct = false;

        for (let i = 0; i < product.categories.length; i++) {
            const _category = product.categories[i];
            if (_category === category._id) {
                existsInProduct = true;
            }
        }
        if (existsInProduct === false) {
            const udpatedCategories = product.categories;
            udpatedCategories.push(categoryId);
            await dbProducts
                .doc(productId)
                .update({
                    categories: udpatedCategories,
                    updatedAt: new Date()
                })
                .catch(err => {
                    const error = new Error(err);
                    error.code = 404;
                    throw error;
                });
        }
        else {
            const error = new Error('Product already linked to the category.');
            error.code = 404;
            throw error;
        }
        // ---------------
        let existsInCategory = false;
        for (let i = 0; i < category.products.length; i++) {
            const _product = category.products[i];
            if (_product === product._id) {
                existsInCategory = true;
            }
        }
        if (existsInCategory === false) {
            const updatedProducts = category.products;
            updatedProducts.push(productId);
            await dbCategories
                .doc(categoryId)
                .update({
                    products: updatedProducts,
                    updatedAt: new Date()
                })
                .catch(err => {
                    const error = new Error(err);
                    error.code = 404;
                    throw error;
                });
        }
        else {
            const error = new Error('Category already linked to the product.');
            error.code = 404;
            throw error;
        }

        let updatedProduct;
        await dbProducts
            .doc(productId)
            .get()
            .then(async doc => {
                updatedProduct = await getProduct(doc, true);
                return
            })
            .catch(() => {
                const error = new Error('No product found!');
                error.code = 404;
                throw error;
            });
        return updatedProduct;
    },
    updateProduct: async ({ id, productInput }) => {
        const errors = [];
        if (validator.isEmpty(productInput.title.trim())) {
            errors.push({ message: 'Title cannot be null.' });
        }
        if (!validator.isLength(productInput.title.trim(), { max: 63 })) {
            errors.push({ message: 'Title must be at most 63 characters.' });
        }
        if (validator.isEmpty(productInput.description.trim())) {
            errors.push({ message: 'Description cannot be null.' });
        }
        if (!validator.isLength(productInput.description.trim(), { min: 120, max: 160 })) {
            errors.push({ message: 'Description must be 120 to 160 characters.' });
        }
        if (validator.isEmpty(productInput.details.trim())) {
            errors.push({ message: 'Details cannot be null.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        await dbProducts
            .where("slug", "==", slug(productInput.title.trim(), { lower: true }))
            .get()
            .then(docs => {
                if (docs.size > 0) {
                    let check;
                    docs.forEach(doc => {
                        check++;
                        if (check === 0) {
                            if (doc.id !== id) {
                                const error = new Error('Product exists already!');
                                error.data = errors;
                                error.code = 404;
                                throw error;
                            }
                        }
                    });
                }
                return
            });
        let updated;
        const updateProduct = await dbProducts
            .doc(id)
            .update({
                title: productInput.title.trim(),
                slug: slug(productInput.title.trim(), { lower: true }),
                description: productInput.description,
                details: productInput.details,
                price: productInput.price,
                isService: productInput.isService,
                isActivated: productInput.isActivated,
                isFeatured: productInput.isFeatured,
                updatedAt: new Date()
            })
            .then(async () => {
                await dbProducts
                    .doc(id)
                    .get()
                    .then(async lastUpdated => {
                        updated = await getProduct(lastUpdated, true);
                        return
                    });
                return updated;
            })
            .catch(err => {
                const error = new Error(err);
                error.code = 404;
                throw error;
            });
        return updateProduct;
    },
    deleteProductCategory: async ({ productId, categoryId }) => {
        const GetProduct = async productId => {

            let product;
            await dbProducts
                .doc(productId)
                .get()
                .then(async doc => {
                    product = await getProduct(doc, false);
                    return
                })
                .catch(() => {
                    const error = new Error('No product found!');
                    error.code = 404;
                    throw error;
                });
            return product;
        };

        const GetCategory = async categoryId => {

            let category;
            await dbCategories
                .doc(categoryId)
                .get()
                .then(async doc => {
                    category = await getCategory(doc, false);
                    return
                })
                .catch(() => {
                    const error = new Error('No category found!');
                    error.code = 404;
                    throw error;
                });

            return category;
        };

        const product = await GetProduct(productId);
        const category = await GetCategory(categoryId);

        let udpatedCategories = product.categories;
        udpatedCategories = udpatedCategories.filter(item => {
            return item !== categoryId;
        });
        await dbProducts
            .doc(productId)
            .update({
                categories: udpatedCategories,
                updatedAt: new Date()
            })
            .catch(err => {
                const error = new Error(err);
                error.code = 404;
                throw error;
            });
        // ---------------
        let updatedProducts = category.products;
        updatedProducts = updatedProducts.filter(item => {
            return item !== productId;
        });
        await dbCategories
            .doc(categoryId)
            .update({
                products: updatedProducts,
                updatedAt: new Date()
            })
            .catch(err => {
                const error = new Error(err);
                error.code = 404;
                throw error;
            });

        let updatedProduct;
        await dbProducts
            .doc(productId)
            .get()
            .then(async doc => {
                updatedProduct = await getProduct(doc, true);
                return
            })
            .catch(() => {
                const error = new Error('No product found!');
                error.code = 404;
                throw error;
            });
        return updatedProduct;
    },
    deleteProduct: async ({ id }) => {
        await dbCategories
            .get()
            .then(async docs => {
                docs.forEach(async doc => {
                    doc.data().products.forEach(async product => {
                        if (id === product) {
                            let products = doc.data().products;
                            products = products.filter(item => {
                                return item !== product;
                            });
                            await dbCategories
                                .doc(doc.id)
                                .update({
                                    products
                                });
                        }
                    })
                })
                return
            });

        await dbProducts
            .doc(id)
            .delete();

        return true;
    }
};