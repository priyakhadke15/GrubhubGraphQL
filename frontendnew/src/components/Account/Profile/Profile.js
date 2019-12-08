import React, { Component } from 'react';
import { getPersonsQuery } from '../../../graphql/';
import { withApollo } from 'react-apollo';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            msg: '',
            profileImage: "/pic.png",
            imageTargetFile: ''
        };
    }

    async componentDidMount() {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            this.props.toggleSpinner('Loading...');
            //Try with graphql
            this.props.client.query({
                query: getPersonsQuery
            }).then(async (result) => {
                console.log(result.data.profile);
                const response = result.data.profile
                const { email, firstName: firstname, lastName: lastname, profileImage } = response;
                this.props.toggleSpinner();
                await sleep(1000);
                this.setState({
                    profileImage: !profileImage || profileImage === 'undefined' ? '/pic.png' : profileImage,
                    email, firstname, lastname
                });
            }).catch(err => {
                console.error(err);
                this.setState({ msg: err });
            });
        } catch (e) {
            await sleep(1000);
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
    }

    async submitForm(e) {
        e.preventDefault();
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        const data = {
            email: this.state.email,
            firstName: this.state.firstname,
            lastName: this.state.lastname
        };
        this.state.password && (data.password = this.state.password);
        const dataform = new FormData();
        for (const key in data) {
            dataform.append(key, data[key]);
        }
        this.state.imageTargetFile && dataform.append('profileImage', this.state.imageTargetFile);
        this.props.toggleSpinner('Updating your info....');
        fetch('/api/v1/users/profile', {
            method: 'put',
            mode: "cors",
            redirect: 'follow',
            body: dataform
        }).then(async (response) => {
            const body = await response.json();
            await sleep(2000);
            this.props.toggleSpinner();
            if (response.status === 200) {
                await sleep(500);
                this.setState({ msg: body.message })
            } else {
                this.setState({ msg: body.message });
            }
        }).catch(async err => {
            await sleep(2000);
            this.props.toggleSpinner();
            this.setState({ msg: err.message || err })
        });
    }

    onImageSelect(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                profileImage: URL.createObjectURL(event.target.files[0]),
                imageTargetFile: event.target.files[0]
            });
        }
    }

    render() {
        return (
            <form action="#" onSubmit={this.submitForm.bind(this)}>
                <div className="fullwidth-block fruits-section category-block">
                    <div className="contact-form" style={{ width: "80%", margin: "0 auto" }}>
                        <div style={{ width: "20%", height: "auto", margin: "0 auto" }}>
                            <img style={{ imageOrientation: "from-image", width: "13vw", height: "auto", position: "relative" }} src={this.state.profileImage}></img>
                            <input type="file" onChange={this.onImageSelect.bind(this)} style={{ background: "none", border: "none" }} alt="Choose image" />
                        </div>
                        <div className="namediv">
                            <input value={this.state.firstname} onChange={e => this.setState({ firstname: e.target.value })} name="firstname" className="inputfirstname" type="text" placeholder="First Name" required />
                            <input value={this.state.lastname} onChange={e => this.setState({ lastname: e.target.value })} className="inputlastname" type="text" placeholder="Last Name" required />
                        </div>
                        <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} type="email" placeholder="Email" required />
                        <input type="password" onChange={e => this.setState({ password: e.target.value })} placeholder="-- password unchanged --" />
                        <input type="submit" value="Update" />
                        <pre>{this.state.msg}</pre>
                    </div>
                </div>
            </form>
        )
    }
} export default withApollo(Profile);