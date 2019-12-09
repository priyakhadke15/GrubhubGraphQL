import React, { Component } from 'react';
import './Menu.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login, logout, getCart, setCart } from '../../actions';
import { compose } from 'react-apollo';
import { withApollo } from 'react-apollo';
import { getMenuQuery } from '../../graphql/';

class Menu extends Component {
    constructor(props) {
        super(props);
        const { match: { params: { restaurantID: restaurantId } } } = this.props;
        this.state = {
            msg: '',
            // items: {
            //     "dinner": [
            //         {
            //             "address": "N Street,San Jose",
            //             "cuisine": "Bakery",
            //             "iDesc": "Mint Boba Tea",
            //             "iImage": null,
            //             "image": "",
            //             "itemID": "cdf5b752-4b43-4457-adf6-81d83835bf65",
            //             "itemName": "Boba Tea",
            //             "name": "CafeCool",
            //             "ownerId": "80a38bca-e310-4f3d-a48b-48a55688108c",
            //             "price": 3.23,
            //             "restaurantId": "cdf5b752-4b43-4457-adf6-81d83835bf65",
            //             "secName": "dinner",
            //             "zipcode": 95113
            //         }
            //     ]
            // },
            items: {},
            foodImage: "/generic-item.png",
            imageTargetFile: '',
            restaurantId,
            restaurantName: ''
        }
    }

    async repaintMenu() {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            this.props.toggleSpinner("Fetching....");
            await sleep(1500);
            this.props.toggleSpinner();
            //Graphql
            this.props.client.query({
                query: getMenuQuery(`${this.state.restaurantId ? `${this.state.restaurantId}` : ''}`)
            }).then(result => {
                const body = result.data.items;
                this.setState({
                    restaurantName: Array.isArray(body) && body.length > 0 ? body[0].name : '',
                    items: body.reduce((acc, item) => {
                        acc[item.secName] = [...(acc[item.secName] ? acc[item.secName] : []), item]
                        return acc;
                    }, {})
                });
                console.log(body);
            }).catch(err => {
                this.setState({ msg: err });
            });
        } catch (e) {
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
    }

    componentDidMount() {
        this.repaintMenu();
    }

    addItem = async e => {
        e.preventDefault();
        const { itemName, iDesc, price, secName } = e.target.elements;
        try {
            const data = {
                itemName: itemName.value,
                iDesc: iDesc.value,
                price: price.value,
                secName: secName.value
            };
            const dataform = new FormData();
            for (const key in data) {
                dataform.append(key, data[key]);
            }
            this.state.imageTargetFile && dataform.append('itemImage', this.state.imageTargetFile);
            this.props.toggleSpinner("Adding...");
            const response = await fetch('/api/v1/item', {
                method: 'POST',
                mode: "cors",
                redirect: 'follow',
                body: dataform
            });
            this.props.toggleSpinner();
            if (response.status !== 200) {
                const body = await response.json();
                this.setState({ msg: body.message || body.msg });
            } else {
                this.repaintMenu();
            }
        } catch (err) {
            this.props.toggleSpinner();
            this.setState({ msg: err.message || err });
            this.repaintMenu();
        }
    }

    changeSectionName = oldname => async e => {
        e.preventDefault();
        const newname = e.target.elements.sectionName.value;
        if (oldname === newname) {
            // do nothing
            return;
        }
        // get all items for this section
        const itemIds = Array.isArray(this.state.items[oldname]) ? this.state.items[oldname].map(i => i.itemID) : [];
        const updatePromises = [];
        try {
            this.props.toggleSpinner("Updating...");
            itemIds.forEach(itemID => {
                updatePromises.push(fetch('/api/v1/item', {
                    method: 'put',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ itemID, secName: newname })
                }))
            });
            // something can be done with the responses (like check if all were 200ok)
            // but ok to leave it out for now
            await Promise.all(updatePromises);
            this.props.toggleSpinner();
            this.repaintMenu();
        } catch (err) {
            this.props.toggleSpinner();
            this.setState({ msg: err.message || err });
            this.repaintMenu();
        }
    };

    deleteSection = async sectionname => {
        // get all items for this section
        const itemIds = Array.isArray(this.state.items[sectionname]) ? this.state.items[sectionname].map(i => i.itemID) : [];
        const deletePromises = [];
        try {
            this.props.toggleSpinner("Updating...");
            itemIds.forEach(itemID => {
                deletePromises.push(fetch(`/api/v1/item?itemID=${itemID}`, {
                    method: 'delete',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json'
                    }
                }))
            });
            // something can be done with the responses (like check if all were 200ok)
            // but ok to leave it out for now
            await Promise.all(deletePromises);
            this.props.toggleSpinner();
            this.repaintMenu();
        } catch (err) {
            this.props.toggleSpinner();
            this.setState({ msg: err.message || err });
            // this.repaintMenu();
        }
    }

    onImageSelect(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                foodImage: URL.createObjectURL(event.target.files[0]),
                imageTargetFile: event.target.files[0]
            });
        }
    }

    async addToCart(restaurantId, item) {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        const cart = this.props.cartdata && Object.keys(this.props.cartdata).length > 0 ? { ...this.props.cartdata } : {};
        if (cart.userId === this.props.userId && cart.restaurantId !== restaurantId) {
            return alert('you can add items from only one restaurant to the cart!');
        }

        this.props.toggleSpinner("Adding...");
        cart.items = cart.userId === this.props.userId ? Array.isArray(cart.items) ? cart.items : [] : [];
        cart.userId = this.props.userId;
        cart.restaurantId = restaurantId;
        // push to cart only if this item does not already exist
        if (!cart.items.find(i => i.itemID === item.itemID)) {
            cart.items.push({ ...item, quantity: 1 });
            this.props.setCart(cart);
        }
        await sleep(1000);
        this.props.toggleSpinner();
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.items).length > 0 && (
                    <div className="container">
                        {!this.props.isSeller && <h1 style={{ marginTop: "30px", textAlign: "center" }}>{this.state.restaurantName}</h1>}
                        {Object.keys(this.state.items).map(section => (
                            <div key={section}>
                                {!this.state.restaurantId ?
                                    (<div className="contact-form" style={{ width: "80%", display: "flex" }}>
                                        <label>Section:</label>
                                        <form onSubmit={this.changeSectionName(section).bind(this)} style={{ width: "80%", display: "flex" }}>
                                            <input style={{ width: "150vw", marginRight: "3vw" }} name="sectionName" defaultValue={section} type="text" placeholder="Section Name" required />
                                            <input style={{ marginRight: "2vw", height: "58px" }} type="submit" value="Change Name" />
                                        </form>
                                        <input type="button" onClick={() => this.deleteSection(section)} value="Delete Section" />
                                    </div>) :
                                    (<div className="contact-form">
                                        <pre style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>{section}</pre>
                                    </div>)}
                                <div className="recipes-list">
                                    {this.state.items[section].map(item => (
                                        <article className="recipe" key={item.itemID}>
                                            <figure className="recipe-image" style={{ width: "170px", height: "170px" }}><img style={{ width: "170px", height: "170px" }} src={item.iImage && item.iImage !== "undefined" ? item.iImage : "/generic-item.png"} alt={item.itemName} /></figure>
                                            <div className="recipe-detail" style={{ display: "table" }}>
                                                <div style={{ display: "table-cell", width: "45vw" }}>
                                                    <h2 className="recipe-title"><Link to={`/item/${item.itemID}`}>{item.itemName}</Link></h2>
                                                    <p>{item.iDesc}</p>
                                                    <p>{item.secName}</p>
                                                    <div className="recipe-meta">
                                                        <span className="time"><img src="/images/icon-time.png" />{Math.round(Math.random() * 20) + 20} min</span>
                                                        <span className="time"><img src="/images/icon-pie-chart.png" />{Math.round(Math.random() * 200) + 120} kcal</span>
                                                        <span className="time"><img src="/images/dollar.png" />{item.price}</span>
                                                    </div>
                                                </div>
                                                {this.props.isLoggedIn && !this.props.isSeller &&
                                                    (<div style={{ width: "20%", marginRight: "50px", display: "table-cell", height: "auto" }}>
                                                        <input type="button" onClick={() => this.addToCart(item.restaurantId, item)} value="Add to cart" style={{ backgroundColor: "#f16a54", color: "white", position: "relative", top: "110px" }} />
                                                    </div>)}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {!this.state.restaurantId && <hr />}
                    </div>)}
                {!this.state.restaurantId && (< div className="contact-form" style={{ width: "60%" }} >
                    <form onSubmit={this.addItem.bind(this)} >
                        <div style={{ width: "20%", height: "auto", margin: "0 auto" }}>
                            <img style={{ imageOrientation: "from-image", width: "13vw", height: "auto", position: "relative" }} src={this.state.foodImage}></img>
                            <input type="file" onChange={this.onImageSelect.bind(this)} style={{ background: "none", border: "none" }} alt="Choose image" />
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "25vw", marginRight: "20px" }}>
                                <input type="text" name="itemName" placeholder="Item Name" required />
                                <input type="number" step="0.01" name="price" placeholder="Price" required />
                                <input type="text" name="secName" placeholder="Section" required />
                            </div>
                            <div style={{ flexGrow: "1" }}>
                                <textarea name="iDesc" placeholder="Item Description" required />
                                <input type="submit" value="Add New Item" />
                                <pre>{this.state.msg}</pre>
                            </div>
                        </div>
                    </form>
                </div >)}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.userdata.isLoggedIn,
    isSeller: state.userdata.isSeller,
    userId: state.userdata.id,
    cartdata: state.cartdata,
    // signupEmail: state.userdata.signupEmail,
    // email: state.userdata.email
});

const mapDispatchToProps = dispatch => ({
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    getCart: () => dispatch(getCart()),
    setCart: cart => dispatch(setCart(cart))
});

// export default connect(mapStateToProps, mapDispatchToProps)(Menu);
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withApollo,
)(Menu);