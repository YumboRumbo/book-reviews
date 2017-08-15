import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

window.fetch("http://localhost:3001").then(res => {
  res.json().then(bookInfo => {
    console.log("bookInfo", bookInfo);
    ReactDOM.render(
      <App bookInfo={bookInfo} />,
      document.getElementById("root")
    );
    registerServiceWorker();
  });
});
