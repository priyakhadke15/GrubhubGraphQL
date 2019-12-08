import { gql } from 'apollo-boost';

const getorderdetailsQuery = (orderID) => gql`
    {
        orderdetails(orderID:"${orderID}") {
            iDesc
            price
            itemName
        }
    }
`;
export { getorderdetailsQuery };