const Koa = require("koa");
const app = new Koa();
const tracingMiddleware = require("../middlewares/tracing");

app.use(
  tracingMiddleware({ serviceName: "book-ratings", port: process.env.PORT })
);

app.use(ctx => {
  ctx.set("Content-Type", "application/json");
  ctx.body = {
    rating: 4
  };
  ctx.status = 200;
});

app.listen(process.env.PORT, () => {
  console.log(`Koa server listening on ${process.env.PORT}`);
});
