import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCart } from '../../actions';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            total: 0
        };
    }

    sleep = msec => new Promise(r => setTimeout(r, msec));

    _setTotal(items) {
        if (!Array.isArray(items) || items.length === 0) {
            this.setState({ total: 0 })
        } else {
            this.setState({
                total: items.reduce((acc, item) => acc + item.price * item.quantity, 0)
            })
        }
    }

    async componentDidMount() {
        this.props.toggleSpinner("Fetching...");
        await this.sleep(1000);
        this._setTotal(this.props.cartdata.items);
        this.props.toggleSpinner();
    }

    async placeOrder(e) {
        e.preventDefault();
        const { restaurantId, items } = this.props.cartdata;
        if (!restaurantId || !Array.isArray(items) || items.length === 0) {
            return alert("your cart is empty!");
        }
        const deliveryAdd = e.target.elements.address.value;
        try {
            this.props.toggleSpinner("Placing order...");
            const response = await fetch(`/api/v1/order`, {
                method: 'post',
                mode: "cors",
                redirect: 'follow',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ items, restaurantId, deliveryAdd })
            });
            const body = await response.json();
            await this.sleep(2000);
            this.props.toggleSpinner();
            if (response.status === 200) {
                this.props.setCart({});
                this.setState({ msg: "Order Placed" })
            } else {
                this.setState({ msg: body.message });
            }
        } catch (err) {
            await this.sleep(2000);
            this.props.toggleSpinner();
            this.setState({ msg: err.message || err });
        }

    }

    changeQuantity = itemId => async e => {
        const items = [...this.props.cartdata.items];
        const index = items.findIndex(e => e.itemID === itemId);
        if (index > -1) {
            items[index].quantity = Math.round(e.target.value);
            this.props.toggleSpinner("Updating...");
            await this.sleep(500);
            this._setTotal(items);
            this.props.setCart({
                restaurantId: this.props.cartdata.restaurantId,
                userId: this.props.cartdata.userId,
                items
            });
            this.props.toggleSpinner();
        }
    }

    async removeItem(itemId) {
        const items = [...this.props.cartdata.items];
        const index = items.findIndex(e => e.itemID === itemId);
        if (index > -1) {
            items.splice(index, 1);
            this.props.toggleSpinner("Removing...");
            await this.sleep(1000);
            this._setTotal(items);
            if (items.length === 0) {
                this.props.setCart({});
            } else {
                this.props.setCart({
                    restaurantId: this.props.cartdata.restaurantId,
                    userId: this.props.cartdata.userId,
                    items
                });
            }
            this.props.toggleSpinner();
        }
    }

    render() {
        const { items } = this.props.cartdata;
        return (
            <div>
                <div className="container">
                    <div className="recipes-list">
                        {Array.isArray(items) && <h1 style={{ textAlign: "center" }}><Link to={`/restaurant/${this.props.cartdata.restaurantId}`}>{items[0].name}</Link></h1>}
                        {Array.isArray(items) && items.map(item => (
                            <article className="recipe" key={item.itemID}>
                                <figure className="recipe-image"><img src={item.iImage && item.iImage !== "undefined" ? item.iImage : "/generic-item.png"} alt={item.iImage} /></figure>
                                <div className="recipe-detail">
                                    <h2 className="recipe-title"><Link to={`/item/${item.itemID}`}>{item.itemName}</Link></h2>
                                    <h4>{item.iDesc}</h4>
                                    <div className="recipe-meta" >
                                        <span className="time"><img src="/images/icon-pie-chart.png" />{Math.round(Math.random() * 200) + 120} kcal</span>
                                        <span className="time"><img src="/images/dollar.png" />{item.price}</span>
                                        <span className="time" style={{ color: "#898670", fontSize: "14px", margin: "0 auto", marginRight: "250px" }}>
                                            <img src="/images/icon-pie-chart.png" />
                                            <input style={{ width: "100px" }} type="number" onChange={this.changeQuantity(item.itemID)} min="1" defaultValue={item.quantity} />
                                        </span>
                                        <span className="contact-form" >
                                            <input type="button" onClick={() => this.removeItem(item.itemID)} value="Remove Item" style={{ marginTop: "5px" }} />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                        {Array.isArray(items) && <h1 style={{ textAlign: "center" }}>Total: {this.state.total.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</h1>}
                        <div className="contact-form" >
                            <form onSubmit={this.placeOrder.bind(this)}>
                                <input type="text" name="address" placeholder="Delivery Address" required autoFocus style={{ width: "50%" }} />
                                <input type="submit" value="Place Order" style={{ marginTop: "5px" }} />
                            </form>
                            <pre>{this.state.msg}</pre>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.userdata.isLoggedIn,
    cartdata: state.cartdata,
    // isSeller: state.userdata.isSeller,
    // userId: state.userdata.id,
    // signupEmail: state.userdata.signupEmail,
    // email: state.userdata.email
});

const mapDispatchToProps = dispatch => ({
    // login: () => dispatch(login()),
    // logout: () => dispatch(logout()),
    // getCart: () => dispatch(getCart()),
    setCart: cart => dispatch(setCart(cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);