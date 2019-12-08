import { gql } from 'apollo-boost';

const getPersonsQuery = gql`
    {
        profile {
            firstName
            lastName
            email
          } 
    }
`;

export { getPersonsQuery };