import React, { Component } from 'react';

class Restaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            cuisine: '',
            zipcode: '',
            msg: '',
            profileImage: "/generic-item.png",
            imageTargetFile: ''
        };
    }

    sleep = msec => new Promise(r => setTimeout(r, msec));

    async submitForm(e) {
        e.preventDefault();
        const data = {
            name: this.state.name,
            address: this.state.address,
            cuisine: this.state.cuisine,
            zipcode: this.state.zipcode
        };
        const dataform = new FormData();
        for (const key in data) {
            dataform.append(key, data[key]);
        }
        this.state.imageTargetFile && dataform.append('image', this.state.imageTargetFile);
        this.props.toggleSpinner('Updating your info....');
        try {
            const response = await fetch('/api/v1/restaurant', {
                method: 'put',
                mode: "cors",
                redirect: 'follow',
                body: dataform
            });
            const body = await response.json();
            await this.sleep(2000);
            this.props.toggleSpinner();
            this.setState({ msg: body.message });
        } catch (e) {
            await this.sleep(1500);
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
    }

    async componentDidMount() {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            this.props.toggleSpinner('Loading...');
            const response = await fetch('/api/v1/users/profile');
            const { name, address, cuisine, zipcode, image: profileImage } = await response.json();
            await sleep(1000);
            this.props.toggleSpinner();
            if (response.status === 200) {
                this.setState({
                    name, address, cuisine, zipcode,
                    profileImage: profileImage && profileImage !== 'undefined' ? profileImage : '/generic-item.png'
                });
            } else if (response.status === 401) {
                this.setState({ msg: 'please login to continue...' });
            }
        } catch (e) {
            await sleep(1000);
            this.props.toggleSpinner();
            this.setState({ msg: e.message || e });
        }
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
                            <input value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className="inputfirstname" type="text" placeholder=" Restaurant Name" />
                            <input value={this.state.address} onChange={e => this.setState({ address: e.target.value })} className="inputlastname" type="text" placeholder="address" />
                        </div>
                        <input value={this.state.cuisine} onChange={e => this.setState({ cuisine: e.target.value })} type="text" placeholder="cuisine" />
                        <input value={this.state.zipcode} onChange={e => this.setState({ zipcode: e.target.value })} type="text" placeholder="zipcode" />
                        <input type="submit" value="Update" />
                        <pre>{this.state.msg}</pre>
                    </div>
                </div>
            </form>
        )
    }
} export default Restaurant;