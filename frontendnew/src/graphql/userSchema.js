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

const loginQuery = ({ email, password }) => {
    return gql`
        {
            login (email:"${email}", password:"${password}") {
                email
                firstName
                lastName
            } 
        }
    `;
};

const editProfileMutation = ({ email, password, firstName, lastName }) => {
    const updateThese = [];
    email && (updateThese.push(`email:"${email}"`));
    password && (updateThese.push(`password:"${password}"`));
    firstName && (updateThese.push(`firstName:"${firstName}"`));
    lastName && (updateThese.push(`lastName:"${lastName}"`));
    return gql`
        mutation {
            profile (${updateThese.join(" ")}) {
                id
                email
                firstName
                lastName
            }
        }
    `;
};

export { getPersonsQuery, loginQuery, editProfileMutation };