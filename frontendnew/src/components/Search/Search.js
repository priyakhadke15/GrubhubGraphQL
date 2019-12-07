import React, { Component } from 'react';
import { Route } from "react-router-dom";
import SiteDescription from '../SiteDescription';

class Home extends Component {
    render() {
        return (
            <div>
                <Route
                    path="/search"
                    render={props => <SiteDescription {...props} toggleSpinner={this.props.toggleSpinner.bind(this)} />}
                />
            </div>
        )
    }
}
export default Home;