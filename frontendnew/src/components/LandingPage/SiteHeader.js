import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class SiteHeader extends Component {
    render() {
        return (
            <div className="site-header">
                <div className="container">
                    <h1 style={{ colour: 'azure' }} className="site-title"><Link to="/Home">GrubHub</Link></h1>
                    <div className="mobile-navigation"></div>
                </div>
            </div>
        )
    }
}
export default SiteHeader;