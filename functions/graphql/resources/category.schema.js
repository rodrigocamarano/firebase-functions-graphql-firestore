const categoryTypes = `    

    type Category {
        _id: ID!
        title: String!
        slug: String!
        isFeatured: Boolean!
        products: [Product!]!
        createdAt: String!
        updatedAt: String!
    }

    type CategoryData {
        categories: [Category!]!
        totalRecords: Int!
        totalPages: Int!
    }
    type CategorySlugData {
        category: Category!
    }

    input CategoryInputData {
        title: String!
        slug: String
        isFeatured: Boolean!
    }

`;

const categoryQueries = `
    categories(filter: String, sortField: String, sortOrder: String, page: Int, pageSize: Int): CategoryData!
    category(id: ID!): Category!
`;

const categoryMutations = `
    createCategory(categoryInput: CategoryInputData): Category!
    updateCategory(id: ID!, categoryInput: CategoryInputData): Category!
    deleteCategory(id: ID!): Boolean
`;

module.exports = {
    categoryTypes,
    categoryQueries,
    categoryMutations
}
