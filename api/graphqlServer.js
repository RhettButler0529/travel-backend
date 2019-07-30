const express = require('express');
const express_graphql = require('express-graphql')
const {buildSchema} = require('graphql')

// GraphQL buildSchema
const schema = buildSchema(`
    type Query  {
        message: String
    }
`)

const root = {
    message: () =>  'Hello World'
}

// Create an express server and GraphQL ednpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000, () => console.log('Express GraphQL server now running ...'))
