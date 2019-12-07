import React, { Component } from 'react';

class SearchPage extends Component {
    render() {
        return (
            <div className="fullwidth-block cooking-section category-block" >
                <div className="container" >
                    <div className="col-md-4">
                        <img className='pizzalogo' src="/pizza.jpg" alt="pizzalogo"></img>
                    </div>
                    <div className="col-md-8">
                        <div className="category-content" ></div>
                        <h1 className="category-title">PickUp or Delivery from nearby restaurants</h1>
                        <p>Find meals easily with variety of local menus near to you.Explore great food with ease.</p>
                    </div>
                </div >
            </div >


        )
    }
} export default SearchPage;
