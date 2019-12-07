import React, { Component } from 'react';

class DetailsPage extends Component {
    render() {
        return (
            <div className="fullwidth-block restaurant-section category-block">
                <div className="container" />
                <div className="col-md-4">
                    <img className='pizzalogo' src="/fries.jpg" alt="pizzalogo"></img>
                </div>
                <div className="col-md-8">
                    <div className="category-content">
                        <h1 className="category-title">Popular Cusines</h1>
                        <h3>GrubHub offers popular cusines nearby from local restaurants</h3>
                    </div>
                </div>
            </div>
        )
    }
} export default DetailsPage;