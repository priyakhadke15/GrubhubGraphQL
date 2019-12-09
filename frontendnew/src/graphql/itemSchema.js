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
const editItemMutation = ({ itemName, iDesc, price, secName }) => {
    const updateThese = [];
    itemName && (updateThese.push(`itemName:"${itemName}"`));
    iDesc && (updateThese.push(`iDesc:"${iDesc}"`));
    price && (updateThese.push(`price:${price}`));
    secName && (updateThese.push(`secName:"${secName}"`));
    return gql`
        mutation {
            item (${updateThese.join(" ")}) {
                itemName
                iDesc
                price
                secName
            }
        }
    `;
};

export { getIemsQuery, getMenuQuery, editItemMutation };