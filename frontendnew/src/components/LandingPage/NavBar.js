import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login, logout } from '../../actions';

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="site-header">
                <div className="container">
                    <div className="main-navigation pull-right">
                        <div>
                            <ul className="menu">
                                {!this.props.isLoggedIn && <li className="menu-item"><Link to="/home">Home</Link></li>}
                                {this.props.isLoggedIn && !this.props.isSeller && <li className="menu-item"><Link to="/search">Search</Link></li>}
                                {this.props.isLoggedIn && <li className="menu-item"><Link to="/account/profile">Account</Link></li>}
                                {this.props.isSeller && <li className="menu-item"><Link to="/menu">Menu</Link></li>}
                                {this.props.isLoggedIn && !this.props.isSeller && <li className="menu-item"><Link to="/cart">Cart</Link></li>}
                                {this.props.isLoggedIn && <li className="menu-item"><Link to="/login" onClick={this.props.logout.bind(this)}>Logout</Link></li>}
                                {!this.props.isLoggedIn && <li className="menu-item"><Link to="/login">Login</Link></li>}
                            </ul>
                        </div>
                    </div >
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.userdata.isLoggedIn,
    isSeller: state.userdata.isSeller
});

const mapDispatchToProps = dispatch => ({
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);