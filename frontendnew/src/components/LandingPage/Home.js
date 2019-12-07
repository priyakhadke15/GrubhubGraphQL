import React, { Component } from 'react';
import SiteDescription from '../SiteDescription';
import MainContent from '../MainContent';

class Home extends Component {
    render() {
        return (
            <div>
                <SiteDescription />
                <MainContent />
            </div>
        )
    }
}
export default Home;