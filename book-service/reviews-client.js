const { getBookDetail } = require("./client");
const bookReviewsServiceUrl = "http://localhost:3003";
function getBookReviews() {
  return getBookDetail("book-service", "book-reviews", bookReviewsServiceUrl);
}

module.exports = {
  getBookReviews
};
