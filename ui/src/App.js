import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { map } from "ramda";

class App extends Component {
  render() {
    console.log("props", this.props);
    const { bookInfo } = this.props;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          <p>
            Title: {bookInfo.title}
          </p>
          <p>
            Author: {bookInfo.author}
          </p>
          <p>
            Publisher: {bookInfo.publisher}
          </p>
        </div>
        <div>
          {this.renderReviews(bookInfo.reviews)}
        </div>
        <div>
          {this.renderRatings(bookInfo.ratings)}
        </div>
      </div>
    );
  }

  renderReviews(reviews) {
    return map(review => {
      return (
        <p>
          {review.reviewer}: {review.text}
        </p>
      );
    }, reviews);
  }

  renderRatings(ratings) {
    return <p>****</p>;
  }
}

export default App;
