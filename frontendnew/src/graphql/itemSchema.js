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
          } 
    }
`;

export { getIemsQuery };