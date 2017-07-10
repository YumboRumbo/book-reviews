const Koa = require('koa');
const app = new Koa();

app.use(ctx => {
  ctx.set('Content-Type', 'application/json')
  ctx.body = {
    title: 'A Good Book',
    author: 'Sang Yum',
    publisher: 'Yummy Publishing Co.'
  };
  ctx.status = 200
});

app.listen(process.env.PORT, () => {
  console.log(`Koa server listening on ${process.env.PORT}`)
});
