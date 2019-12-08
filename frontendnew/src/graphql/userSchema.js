import { gql } from 'apollo-boost';

const getPersonsQuery = gql`
    {
        profile {
            email
            firstName
            lastName
            profileImage
          } 
    }
`;

export { getPersonsQuery };