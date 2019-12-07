import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UpcomingOrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            orders: [],
            persons: []
        }
    }

    sleep = msec => new Promise(r => setTimeout(r, msec));

    async repaint() {
        try {
            this.props.toggleSpinner('Loading...');
            const response = await fetch('/api/v1/order?status=new', {
                method: 'get',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const res = await response.json();
            await this.sleep(1000);
            this.props.toggleSpinner();
            if (response.status === 200) {
                if (res.orders.length > 0) {
                    this.setState({
                        msg: '',
                        orders: res.orders,
                        persons: res.persons,
                        id: ''
                    });
                }
                else {
                    this.setState({
                        msg: 'No Upcoming Orders for you'
                    });
                }
            } else if (response.status === 401) {
                this.setState({ msg: 'please login to continue...' });
            } else {
                this.setState({ msg: res.msg || res.message })
            }
        } catch (e) {
            await this.sleep(1000);
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
    }

    async componentDidMount() {
        this.repaint();
    }

    statusUpdate = orderID => async e => {
        e.preventDefault();
        const status = e.target.elements.orderstatus.value;
        this.props.toggleSpinner('Updating Order...');
        try {
            const response = await fetch(`/api/v1/order`, {
                method: 'put',
                mode: "cors",
                redirect: 'follow',
                headers: new Headers({ 'content-type': 'application/json' }),
                body: JSON.stringify({ orderID: orderID, status })
            });
            const body = await response.json();
            await this.sleep(2000);
            this.props.toggleSpinner();
            this.setState({ msg: body.message });
        } catch (err) {
            await this.sleep(2000);
            this.props.toggleSpinner();
            this.setState({ msg: err.message || err });
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
                                    {this.state.persons.length > 0 && <h2 className="recipe-title">
                                        Customer<Link to={`/order/details/${order.orderID}`}> {this.state.persons[0].firstName} {this.state.persons[0].lastName}</Link></h2>
                                    }
                                    {this.state.orders.length > 0 && <h2 className="recipe-title"><Link to={`/order/details/${order.orderID}`}>{order.name} </Link></h2>}
                                    <h4>{order.itemName}</h4>
                                    <span><img src="/images/icon-map-marker-alt.png" />{order.deliveryAdd}</span>
                                    <div className="recipe-meta">
                                        <span className="time"><img src="/images/icon-time.png" />{new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}</span>
                                        <span className="time"><img src="/images/dollar.png" />{order.price}</span>
                                        <span className="time"><img src="/images/icon-pie-chart.png" />{order.status}</span>
                                    </div>
                                    {this.state.persons.length > 0 && <div className="contact-form" style={{ color: "#898670", fontSize: "14px", width: "80%", margin: "0 auto" }}>
                                        <form onSubmit={this.statusUpdate(order.orderID).bind(this)}>
                                            <select name="orderstatus" style={{ width: "20%", marginRight: "20px", marginBottom: "0px" }}>
                                                <option selected={order.status.toLowerCase() === "new"} value="new">New</option>
                                                <option selected={order.status.toLowerCase() === "preparing"} value="preparing">Preparing</option>
                                                <option selected={order.status.toLowerCase() === "ready"} value="ready">Ready</option>
                                                <option selected={order.status.toLowerCase() === "delivered"} value="delivered">Delivered</option>
                                                <option selected={order.status.toLowerCase() === "cancel"} value="cancel">Cancel</option>
                                            </select>
                                            <input type="submit" value="Update Status" style={{ marginTop: "5px" }} />
                                        </form>
                                    </div>}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
} export default UpcomingOrderPage;