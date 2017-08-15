const { getBookDetail } = require("./client");
const bookRatingsServiceUrl = "http://localhost:3002";
function getBookRatings() {
  return getBookDetail("book-service", "book-ratings", bookRatingsServiceUrl);
}

module.exports = {
  getBookRatings
};
