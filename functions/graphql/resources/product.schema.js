const productTypes = `

    type Product {
        id: ID!
        title: String!
        slug: String!
        description: String!
        details: String!
        price: Float!
        isService: Boolean!
        isActivated: Boolean!
        isFeatured: Boolean!
        categories: [Category!]!
        createdAt: String!
        updatedAt: String!
    }

    type ProductData {
        products: [Product!]!
        totalRecords: Int!
        totalPages: Int!
    }

    input ProductInputData {
        title: String!
        slug: String
        description: String!
        details: String!
        price: Float!
        isService: Boolean!
        isActivated: Boolean!
        isFeatured: Boolean!
    }

    input ProductCategoryInputData {
        productId: ID!
        categoryId: ID!
    }
`;

const productQueries = `
    product(id: ID!): Product!
    products(filter: String, sortField: String, sortOrder: String, page: Int, pageSize: Int): ProductData!
`;

const productMutations = `
    createProduct(productInput: ProductInputData): Product!
    createProductCategory(productId: ID!, categoryId: ID!): Product!
    updateProduct(id: ID!, productInput: ProductInputData): Product!
    deleteProduct(id: ID!): Boolean
    deleteProductCategory(productId: ID!, categoryId: ID!): Product!
`;

module.exports = {
    productTypes,
    productQueries,
    productMutations
}
