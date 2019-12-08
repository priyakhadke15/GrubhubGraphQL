import { gql } from 'apollo-boost';

const getIemsQuery = (itemName) => gql`
    {
        items(itemName:"${itemName}") {
            itemID
            iImage
            restaurantId
            itemName
            cuisine
            iDesc
            price
            name
          } 
    }
`;
const getMenuQuery = (restaurantId) => gql`
    {
        items(restaurantId:"${restaurantId}") {
            itemID
            iImage
            restaurantId
            itemName
            cuisine
            iDesc
            price
            name
            secName
          } 
    }
`;

export { getIemsQuery, getMenuQuery };