const { buildSchema } = require('graphql');

const { categoryTypes, categoryQueries, categoryMutations } = require('./resources/category.schema');
const { productTypes, productQueries, productMutations } = require('./resources/product.schema');

module.exports = buildSchema(`

    ${categoryTypes}
    ${productTypes}

    type RootQuery {
        
        ${categoryQueries}
        ${productQueries}
    }

    type RootMutation {
        
        ${categoryMutations}
        ${productMutations}
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);