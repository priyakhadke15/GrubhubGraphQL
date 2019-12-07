import React, { Component } from 'react';
import SearchPage from './SearchPage';
import DetailsPage from './DetailsPage';

class MainContent extends Component {
    render() {
        return (
            <main className="main-content">
                <SearchPage />
                <DetailsPage />
            </main>
        )
    }
}
export default MainContent;