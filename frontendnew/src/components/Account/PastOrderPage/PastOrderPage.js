import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PastOrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            orders: [],
            persons: []
        }
    }
    async componentDidMount() {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            this.props.toggleSpinner("Fetching...");
            const response = await fetch('/api/v1/order?status=delivered', {
                method: 'get',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const res = await response.json();
            console.log(res);
            await sleep(1000);
            this.props.toggleSpinner()
            if (response.status === 200) {
                if (res.orders.length > 0) {
                    this.setState({
                        msg: '',
                        orders: res.orders,
                        persons: res.persons
                    });
                }
                else {
                    this.setState({
                        msg: 'No Order History for you'
                    });
                }
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
                        {this.state.orders.map(order => (
                            <article className="recipe" key={order.orderID}>
                                <figure className="recipe-image"><img src={order.image && order.image !== "undefined" ? order.image : "/generic-item.png"} alt={order.orderID} /></figure>
                                <div className="recipe-detail">
                                    {this.state.persons.length > 0 && <h2 className="recipe-title"><Link to={`/order/details/${order.orderID}`}>{this.state.persons[0].firstName} {this.state.persons[0].lastName}</Link></h2>}
                                    {this.state.orders.length > 0 && <h2 className="recipe-title"><Link to={`/order/details/${order.orderID}`}>{order.name} </Link></h2>}
                                    <h4>{order.itemName}</h4>
                                    <span><img src="/images/icon-map-marker-alt.png" />{order.deliveryAdd}</span>
                                    <div className="recipe-meta">
                                        <span className="time"><img src="/images/icon-time.png" />{new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}</span>
                                        <span className="time"><img src="/images/dollar.png" />{order.price}</span>
                                        <span className="time"><img src="/images/icon-time.png" />{order.status}</span>
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
export default PastOrderPage;