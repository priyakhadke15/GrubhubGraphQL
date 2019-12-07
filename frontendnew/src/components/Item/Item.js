import React, { Component } from 'react';
import './Item.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { login, logout, getCart, setCart } from '../../actions';

class Item extends Component {
    constructor(props) {
        super(props);
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
            item: {},
            foodImage: "/generic-item.png",
            imageTargetFile: '',
            itemID: this.props.match.params.itemID,
            iDesc: '',
            isDeleted: false
        }
    }

    sleep = msec => new Promise(r => setTimeout(r, msec));

    async repaintMenu() {
        try {
            this.props.toggleSpinner("Fetching....");
            const response = await fetch(`/api/v1/item${this.state.itemID ? `?itemID=${this.state.itemID}` : ''}`);
            const body = await response.json();
            // console.log(body)
            await this.sleep(1500);
            this.props.toggleSpinner();
            if (response.status === 200 && Array.isArray(body) && body.length === 1) {
                const item = body[0];
                Array.isArray(body) && body.length === 1 && (this.setState({
                    item,
                    foodImage: item.iImage && item.iImage !== "undefined" ? item.iImage : "/generic-item.png",
                    iDesc: item.iDesc
                }));
            } else {
                this.setState({ msg: body.message });
            }
        } catch (e) {
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
    }

    componentDidMount() {
        this.repaintMenu();
    }

    updateItem = async e => {
        e.preventDefault();
        const { itemName, iDesc, price, secName } = e.target.elements;
        try {
            const data = {
                itemID: this.state.item.itemID,
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
            this.props.toggleSpinner("Updating...");
            const response = await fetch('/api/v1/item', {
                method: 'put',
                mode: "cors",
                redirect: 'follow',
                body: dataform
            });
            await this.sleep(500);
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

    onImageSelect(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                foodImage: URL.createObjectURL(event.target.files[0]),
                imageTargetFile: event.target.files[0]
            });
        }
    }

    oniDescChange(e) {
        this.setState({ iDesc: e.target.value })
    }

    async deleteItem() {
        try {
            this.props.toggleSpinner("Deleting...");
            const response = await fetch(`/api/v1/item?itemID=${this.state.item.itemID}`, {
                method: 'delete',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                }
            });
            await this.sleep(1500);
            this.props.toggleSpinner();
            const body = response.json();
            if (response.status === 200) {
                this.setState({ isDeleted: true });
            } else {
                this.setState({ msg: body.message || body.msg })
            }
        } catch (e) {
            await this.sleep(1000);
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
    }

    render() {
        if (this.state.isDeleted) {
            return <Redirect to="/menu" />
        }
        return (
            <div>
                {Object.keys(this.state.item).length > 0 && !this.props.isSeller && (
                    <div className="container" style={{ marginBottom: "40px" }}>
                        <div style={{ marginTop: "30px" }}>
                            <div className="col-md-4">
                                <figure><img style={{ width: "300px", height: "300px" }} src={this.state.foodImage} /></figure>
                            </div>
                            <div className="col-md-7 col-md-offset-1">
                                <h2 className="entry-title">{this.state.item.itemName}</h2>
                                <div className="recipe-meta">
                                    <span className="time"><img src="/images/icon-time.png" />{Math.round(Math.random() * 20) + 20} min</span>
                                    <span className="calorie"><img src="/images/icon-pie-chart.png" />{Math.round(Math.random() * 200) + 120} kcal</span>
                                    <span className="time"><img src="/images/dollar.png" />{this.state.item.price}</span>
                                </div>
                                <pre><Link to={`/restaurant/${this.state.item.restaurantId}`}>{this.state.item.name}</Link></pre>
                                <pre>{this.state.item.secName}</pre>
                                <p>{this.state.item.iDesc}</p>
                            </div>
                        </div>
                    </div>)}
                {this.props.isSeller && (
                    < div className="contact-form" style={{ width: "60%" }} >
                        <form onSubmit={this.updateItem.bind(this)} >
                            <div style={{ width: "20%", height: "auto", margin: "0 auto" }}>
                                <img style={{ imageOrientation: "from-image", width: "13vw", height: "auto", position: "relative" }} src={this.state.foodImage}></img>
                                <input type="file" onChange={this.onImageSelect.bind(this)} style={{ background: "none", border: "none" }} alt="Choose image" />
                            </div>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "25vw", marginRight: "20px" }}>
                                    <input type="text" defaultValue={this.state.item.itemName} name="itemName" placeholder="Item Name" required />
                                    <input type="number" defaultValue={this.state.item.price} step="0.01" name="price" placeholder="Price" required />
                                    <input type="text" defaultValue={this.state.item.secName} name="secName" placeholder="Section" required />
                                </div>
                                <div style={{ flexGrow: "1" }}>
                                    <textarea name="iDesc" onChange={this.oniDescChange.bind(this)} value={this.state.iDesc} placeholder="Item Description" required />
                                    <input type="submit" value="Update" />
                                    <input type="button" style={{ width: "150px" }} onClick={this.deleteItem.bind(this)} value="Delete" />
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

export default connect(mapStateToProps, mapDispatchToProps)(Item);