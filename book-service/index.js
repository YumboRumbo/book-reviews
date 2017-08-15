const Koa = require("koa");
const app = new Koa();
const cors = require("koa-cors");
const tracingMiddleware = require("../middlewares/tracing");
const faker = require("faker");

const { getBookReviews } = require("./reviews-client");
const { getBookRatings } = require("./ratings-client");

const options = {
  origin: "*"
};

app.use(cors(options));
app.use(
  tracingMiddleware({ serviceName: "book-service", port: process.env.PORT })
);
app.use(function*() {
  console.log("Returning bookinfo");
  const bookInfo = {
    title: faker.random.words(),
    author: faker.name.findName(),
    publisher: faker.company.companyName()
  };
  bookInfo.reviews = yield getBookReviews();
  bookInfo.ratings = yield getBookRatings();

  this.set("Content-Type", "application/json");
  this.body = bookInfo;
  this.status = 200;
});

app.listen(process.env.PORT, () => {
  console.log(`Koa server listening on ${process.env.PORT}`);
});
