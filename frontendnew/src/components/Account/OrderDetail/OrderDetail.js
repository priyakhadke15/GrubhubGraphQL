import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';

class OrderDetail extends Component {

    constructor(props) {
        super(props);
        const { match: { params: { orderID } } } = this.props;
        this.state = {
            msg: '',
            items: [],
            orderID
        }
        props.client.query({
            query: gql`
                {
                    orderdetails(orderID: "2d6b90a9-b1d7-406d-bf56-bb4c61fcab6b") {
                        iDesc
                        price
                        itemName
                    }
                }
            `
        }).then(result => {
            console.log(result);
        }).catch(err => {
            console.error(err);
        });
    }
    async componentDidMount() {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            this.props.toggleSpinner("Fetching...");
            const response = await fetch(`/api/v1/order/details?orderID=${this.state.orderID}`, {
                method: 'get',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const res = await response.json();
            await sleep(1000);
            this.props.toggleSpinner();
            if (response.status === 200) {
                this.setState({
                    msg: '',
                    items: res
                });
            } else if (response.status === 401) {
                this.setState({ msg: 'please login to continue...' });
            }
        }
        catch (e) {
            await sleep(1000);
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
    }
    render() {
        return (
            <div>
                <div className="container">
                    <div className="recipes-list">
                        <pre>{this.state.msg}</pre>
                        {this.state.items.map(item => (
                            <article className="recipe" key={item.itemID}>
                                <figure className="recipe-image"><img src={item.iImage && item.iImage !== "undefined" ? item.iImage : "/generic-item.png"} alt={item.orderID} /></figure>
                                <div className="recipe-detail">
                                    <h2 className="recipe-title">{item.itemName} </h2>
                                    <h4>{item.iDesc}</h4>
                                    <h4>{item.secName}</h4>
                                    <div className="recipe-meta">
                                        <span className="time"><img alt="dollar" src="/images/dollar.png" />{item.totalprice}</span>
                                        <span className="time"><img alt="quantity" src="/images/icon-pie-chart.png" />{item.quantity}</span>
                                    </div>

                                </div>

                            </article>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default withApollo(OrderDetail);