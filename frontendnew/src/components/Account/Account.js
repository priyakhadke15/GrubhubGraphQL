import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PastOrderPage from './PastOrderPage/PastOrderPage';
import UpcomingOrderPage from './UpcomingOrder/UpcomingOrderPage';
import Profile from './Profile/Profile';
import Restaurant from './Restaurant/Restaurant';
import './Account.css';
import { login, logout } from '../../actions';
import OrderDetail from './OrderDetail/OrderDetail'

class Account extends Component {
    render() {
        return (
            <Router>
                <div style={{ display: "flex" }}>
                    <div className="leftdiv" >
                        <ul className="menu" >
                            <li className="menu-item"><Link to="/account/profile">Profile</Link></li>
                            {this.props.isSeller && <li className="menu-item"><Link to="/account/restaurant">Restaurant</Link></li>}
                            <li className="menu-item"><Link to="/account/pastorders">Past Orders</Link></li>
                            <li className="menu-item"><Link to="/account/upcomingorders">Upcoming Orders</Link></li>
                        </ul>
                    </div>
                    <div className="rightdiv">
                        <Route
                            path="/account/profile"
                            render={props => <Profile {...props} toggleSpinner={this.props.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/account/restaurant"
                            render={props => <Restaurant {...props} toggleSpinner={this.props.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/account/pastorders"
                            render={props => <PastOrderPage {...props} toggleSpinner={this.props.toggleSpinner.bind(this)} />}
                        />
                        <Route path="/account/upcomingorders"
                            render={props => <UpcomingOrderPage {...props} toggleSpinner={this.props.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/order/details/:orderID"
                            render={props => <OrderDetail {...props} toggleSpinner={this.props.toggleSpinner.bind(this)} />}
                        />
                    </div>
                </div>
            </Router>

        )
    }


}

const mapStateToProps = state => ({
    isLoggedIn: state.userdata.isLoggedIn,
    isSeller: state.userdata.isSeller,
    // userId: state.userdata.id,
    // email: state.userdata.email
});

const mapDispatchToProps = dispatch => ({
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);