const validator = require('validator');
const slug = require('slug');
const { dbCategories, dbProducts } = require('./firebase');
const { getListCategories, getCategory } = require('./collections');

module.exports = {

    // Queries
    categories: async ({ filter, sortField, sortOrder, page, pageSize }) => {
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

            await dbCategories
                .get()
                .then(docs => {
                    totalRecords = docs.size;
                    return
                });
            await dbCategories
                .orderBy(sortField, sortOrder)
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .get()
                .then(async docs => {
                    items = await getListCategories(docs, true);
                    return
                });
        }
        else {
            await dbCategories
                .where('slug', '>=', slug(filter, { lower: true }))
                .where('slug', '<=', slug(filter, { lower: true }) + '\uf8ff')
                .get()
                .then(docs => {
                    totalRecords = docs.size;
                    return
                });
            await dbCategories
                .where('slug', '>=', slug(filter, { lower: true }))
                .where('slug', '<=', slug(filter, { lower: true }) + '\uf8ff')
                .orderBy('slug', sortOrder)
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .get()
                .then(async docs => {
                    items = await getListCategories(docs, true);
                    return
                });
        }
        const totalPages = Math.ceil(totalRecords / pageSize);
        return {
            categories: items,
            totalRecords,
            totalPages
        };
    },
    category: async ({ id }) => {
        let category;
        await dbCategories
            .doc(id)
            .get()
            .then(async doc => {
                category = await getCategory(doc, true);
                return
            })
            .catch(() => {
                const error = new Error('No category found!');
                error.code = 404;
                throw error;
            });
        return category;
    },

    // Mutations
    createCategory: async ({ categoryInput }) => {
        const errors = [];
        if (validator.isEmpty(categoryInput.title)) {
            errors.push({ message: 'Title cannot be null.' });
        }
        if (!validator.isLength(categoryInput.title.trim(), { max: 63 })) {
            errors.push({ message: 'Title must be at most 63 characters.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const createCategory = await dbCategories.where("slug", "==", slug(categoryInput.title.trim(), { lower: true })).get()
            .then(async docs => {
                if (docs.size === 0) {
                    let created;
                    await dbCategories.add({
                        title: categoryInput.title.trim(),
                        slug: slug(categoryInput.title.trim(), { lower: true }),
                        isFeatured: categoryInput.isFeatured,
                        products: [],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                        .then(async successeCreated => {
                            await dbCategories
                                .doc(successeCreated.id)
                                .get()
                                .then(async lastCreated => {
                                    created = await getCategory(lastCreated, true);
                                    return
                                });
                        });
                    return created;
                }
                else {
                    const error = new Error('Category exists already!');
                    error.code = 404;
                    throw error;
                }
            });
        return createCategory;
    },
    updateCategory: async ({ id, categoryInput }) => {
        const errors = [];
        if (validator.isEmpty(categoryInput.title)) {
            errors.push({ message: 'Title cannot be null.' });
        }
        if (!validator.isLength(categoryInput.title.trim(), { max: 63 })) {
            errors.push({ message: 'Title must be at most 63 characters.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        await dbCategories
            .where("slug", "==", slug(categoryInput.title.trim(), { lower: true }))
            .get()
            .then(docs => {
                if (docs.size > 0) {
                    let check;
                    docs.forEach(doc => {
                        check++;
                        if (check === 0) {
                            if (doc.id !== id) {
                                const error = new Error('Category exists already!');
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
        const updateCategory = await dbCategories
            .doc(id)
            .update({
                title: categoryInput.title.trim(),
                slug: slug(categoryInput.title.trim(), { lower: true }),
                isFeatured: categoryInput.isFeatured,
                updatedAt: new Date()
            })
            .then(async () => {
                await dbCategories
                    .doc(id)
                    .get()
                    .then(async lastUpdated => {
                        updated = await getCategory(lastUpdated, true);
                        return
                    });
                return updated;
            })
            .catch(err => {
                const error = new Error(err);
                error.code = 404;
                throw error;
            });
        return updateCategory;
    },
    deleteCategory: async ({ id }) => {
        await dbProducts
            .get()
            .then(async docs => {
                docs.forEach(async doc => {
                    doc.data().categories.forEach(async category => {
                        if (id === category) {
                            let categories = doc.data().categories;
                            categories = categories.filter(item => {
                                return item !== category;
                            });
                            await dbProducts
                                .doc(doc.id)
                                .update({
                                    categories
                                });
                        }
                    })
                })
                return
            });

        await dbCategories
            .doc(id)
            .delete();

        return true;
    }
};