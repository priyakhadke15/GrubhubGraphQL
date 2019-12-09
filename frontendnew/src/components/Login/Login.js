import React, { Component } from 'react';
import './Login.css';
import { compose, withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { login, logout } from '../../actions';
import { loginQuery } from '../../graphql';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.signupEmail || "",
            password: "",
            msg: ''
        }

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    submitLogin = (e) => {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        e.preventDefault();
        const data = {
            email: this.state.username,
            password: this.state.password
        }
        this.props.toggleSpinner("Logging you in....");
        this.props.client.query({
            query: loginQuery(data)
        }).then(async response => {
            await sleep(2000);
            this.props.toggleSpinner();
            if (response.data.login.email === "fake") {
                this.setState({ msg: "invalid credentials" });
            } else {
                this.props.login();
            }
        }).catch(async err => {
            await sleep(2000);
            this.props.toggleSpinner();
            console.log(err)
        });
    }

    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    render() {
        return (
            <div>
                {this.props.isLoggedIn ? (this.props.isSeller ? <Redirect to="/account/upcomingorders" /> : <Redirect to="/search" />) : null}
                < div className="contact-form"  >
                    <form onSubmit={this.submitLogin}>
                        <input type="email" placeholder="Email" onChange={this.usernameChangeHandler} name="username" required autoFocus />
                        <input type="password" placeholder="Password" onChange={this.passwordChangeHandler} name="password" required />
                        <input type="submit" value="Login" />
                        <Link to="/signup">Create Account</Link>
                    </form>
                    <pre>{this.state.msg}</pre>
                </div >
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.userdata.isLoggedIn,
    signupEmail: state.userdata.signupEmail,
    isSeller: state.userdata.isSeller,
    // userId: state.userdata.id,
    // email: state.userdata.email
});

const mapDispatchToProps = dispatch => ({
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withApollo
)(Login);