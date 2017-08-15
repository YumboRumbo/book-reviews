const Koa = require("koa");
const app = new Koa();
const faker = require("faker");
const tracingMiddleware = require("../middlewares/tracing");
app.use(
  tracingMiddleware({ serviceName: "book-reviews", port: process.env.PORT })
);

app.use(ctx => {
  ctx.set("Content-Type", "application/json");
  ctx.body = [
    {
      reviewer: faker.name.findName(),
      text: faker.lorem.sentence()
    },
    {
      reviewer: faker.name.findName(),
      text: faker.lorem.sentence()
    }
  ];
  ctx.status = 200;
});

app.listen(process.env.PORT, () => {
  console.log(`Koa server listening on ${process.env.PORT}`);
});
