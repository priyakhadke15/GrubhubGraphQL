const graphql = require('graphql');
const _ = require('lodash');
const { getPersons, savePerson, editPerson } = require('../DAL')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const personsResult = [
    {
        id: "02ce15b6-c777-42cf-b675-0f20499efced",
        email: "buyerpriya@abc.com",
        password: "803f81de676d3473fb33c065dc14e7d0",
        firstName: "Buyer",
        lastName: "Priya",
        profileImage: "undefined",
        isSeller: 0
    },

];

const PersonType = new GraphQLObjectType({
    name: 'Persons',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        profileImage: { type: GraphQLString },
        isSeller: { type: GraphQLString }
    })
});
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        Persons: {
            type: PersonType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                const { results } = await getPersons();
                return _.find(results, { id: args.id });
            }
        },
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery
});