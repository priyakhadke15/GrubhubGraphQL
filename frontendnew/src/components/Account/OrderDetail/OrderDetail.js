import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { getorderdetailsQuery } from '../../../graphql/';

class OrderDetail extends Component {

    constructor(props) {
        super(props);
        const { match: { params: { orderID } } } = this.props;
        this.state = {
            msg: '',
            items: [],
            orderID
        }
    }
    async componentDidMount() {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            this.props.toggleSpinner("Fetching...");
            await sleep(1000);
            this.props.toggleSpinner();
            //try graphql
            this.props.client.query({
                query: getorderdetailsQuery(`${this.state.orderID}`)
            }).then(result => {
                console.log(result);
                this.setState({
                    msg: '',
                    items: result.data.orderdetails
                });
            }).catch(err => {
                this.setState({ msg: err });
            });
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