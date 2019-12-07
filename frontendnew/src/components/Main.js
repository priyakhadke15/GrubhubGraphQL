import React, { Component } from 'react';
import SiteHeader from './LandingPage/SiteHeader';
import SiteFooter from './LandingPage/SiteFooter';
import NavBar from './LandingPage/NavBar'
import Home from './LandingPage/Home';
import Signup from './Signup/Signup';
import Login from './Login/Login';
import Menu from './Menu/Menu';
import Item from './Item/Item';
import Account from './Account/Account';
import Cart from './Cart/Cart';
import Search from './Search/Search';
import { Route } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false,
            spinnerText: 'Loading...'
        };
    }

    toggleSpinner = spinnerText => this.setState({
        showSpinner: !this.state.showSpinner,
        spinnerText: spinnerText || this.state.spinnerText
    })

    render() {
        return (
            <LoadingOverlay
                active={this.state.showSpinner}
                spinner
                text={this.state.spinnerText}
            >
                <div className="homepage">
                    <div id="site-content">
                        <Route path="/" component={NavBar} />
                        <Route
                            path="/signup"
                            render={props => <Signup {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/login"
                            render={props => <Login {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/menu"
                            render={props => <Menu {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/restaurant/:restaurantID"
                            render={props => <Menu {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/item/:itemID"
                            render={props => <Item {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/account"
                            render={props => <Account {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/order/"
                            render={props => <Account {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/search"
                            render={props => <Search {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />
                        <Route
                            path="/cart"
                            render={props => <Cart {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        />

                        <Route path="/home" component={Home} />
                    </div>
                    <SiteFooter />
                    <script src="js/jquery-1.11.1.min.js"></script>
                    <script src="js/plugins.js"></script>
                    <script src="js/app.js"></script>
                </div>
            </LoadingOverlay>
        )
    }
}
export default Main;