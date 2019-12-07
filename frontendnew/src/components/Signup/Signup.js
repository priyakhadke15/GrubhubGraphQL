import React, { Component } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../../actions';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSeller: false,
            message: ''
        }
        this.firstnameRef = React.createRef();
        this.lastnameRef = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.retypepasswordRef = React.createRef();
        this.restaurantnameRef = React.createRef();
        this.restaurantzipcodeRef = React.createRef();
    }

    toggleIsSeller = () => this.setState({ isSeller: !this.state.isSeller });

    onSubmit = async e => {
        e.preventDefault();
        if (this.passwordRef.current.value !== this.retypepasswordRef.current.value) {
            this.setState({ message: 'passwords do not match' });
            return;
        }
        const person = {
            firstName: this.firstnameRef.current.value,
            lastName: this.lastnameRef.current.value,
            email: this.emailRef.current.value,
            password: this.passwordRef.current.value,
            isSeller: this.state.isSeller,
            restName: this.restaurantnameRef.current.value,
            restZipCode: this.restaurantzipcodeRef.current.value
        };
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        this.props.toggleSpinner('Creating account...');
        try {
            const response = await fetch('/api/v1/users', {
                method: 'post',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(person)
            });
            const body = await response.json();
            console.log(body);
            await sleep(2000);
            this.props.toggleSpinner();
            if (response.status === 200) {
                console.log('calling redux signup');
                this.props.signup(person.email);
            }
            this.setState({ message: response.status === 200 ? 'account created successfully! please login to continue...' : body.message });
        } catch (e) {
            await sleep(2000);
            this.props.toggleSpinner();
            this.setState({ message: e.message || e });
        }
    };

    render() {
        return (
            <form action="#" onSubmit={this.onSubmit.bind(this)}>
                <div className="contact-form" style={{ width: "80%" }} >
                    <div style={{ display: "flex" }}>
                        <div className="left">
                            <div className="namediv">
                                <input ref={this.firstnameRef} name="firstname" className="inputfirstname" type="text" placeholder="First Name" autoFocus required />
                                <input ref={this.lastnameRef} className="inputlastname" type="text" placeholder="Last Name" required />
                            </div>
                            <input ref={this.emailRef} type="email" placeholder="Email" required />
                            <input ref={this.passwordRef} type="password" placeholder="Password" required />
                            <input ref={this.retypepasswordRef} type="password" placeholder="Confirm password" required />
                        </div>
                        <div className="right">
                            <div className="ui toggle checkbox" >
                                <input onClick={this.toggleIsSeller.bind(this)} readOnly={true} checked={this.state.isSeller} type="checkbox" />
                                <label>Business owner?</label>
                            </div>
                            <div style={{ display: this.state.isSeller ? "block" : "none" }}>
                                <input ref={this.restaurantnameRef} required={this.state.isSeller} type="text" placeholder="Restaurant Name" />
                                <input ref={this.restaurantzipcodeRef} required={this.state.isSeller} type="text" placeholder="Restaurant Zip Code" />
                            </div>
                        </div>
                    </div>
                    <div className="bottondiv" style={{ width: "50%", margin: "0 auto" }}>
                        <Link to="/login">Already have an account? login here</Link>
                        <input type="submit" value="Create Account" />
                        <pre>{this.state.message}</pre>
                    </div>
                </div>
            </form>
        );
    }

}
const mapStateToProps = () => ({
    // isLoggedIn: state.userdata.isLoggedIn,
    // isSeller: state.userdata.isSeller,
    //userId: person.email
    // email: state.userdata.email
});
const mapDispatchToProps = dispatch => ({
    signup: email => dispatch(signup(email)),
}
);

export default connect(mapStateToProps, mapDispatchToProps)(Signup);