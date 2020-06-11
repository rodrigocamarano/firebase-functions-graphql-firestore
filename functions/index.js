const functions = require('firebase-functions');
const express = require('express');
const compression = require('compression');
const graphqlHttp = require('express-graphql');
const bodyParser = require('body-parser');
const cors = require('cors');
const schema = require('./graphql/schema');
const resolver = require('./graphql/resolvers');

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(cors());

app.use(
    '/graphql',
    graphqlHttp({
        schema,
        rootValue: resolver,
        graphiql: true,
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occurred.';
            const code = err.originalError.code || 500;
            return { message: message, status: code, data: data };
        }
    })
);

exports.api = functions.https.onRequest(app);