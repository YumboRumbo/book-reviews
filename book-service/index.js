const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body-parser')

const app = new Koa()
const router = new Router()

router
  .post('/books', function (ctx, next) {
    // ctx.router available
    console.log(ctx.request)
    const requestBody = JSON.stringify(ctx.request.body)

    ctx.body = `Posting book ${requestBody}`
    ctx.status = 200
  })
  .put('/books/:id', function (ctx, next) {
    console.log('putting')
    const bookId = ctx.params.id
    ctx.body = `Putting book ${bookId}`
    ctx.status = 200
  })
  .get('/books/:id', function (ctx, next) {
    const bookId = ctx.params.id
    ctx.body = `Getting book ${bookId}`
    ctx.status = 200
  })
  .del('/books/:id', function (ctx, next) {
    console.log('deleting')
    const bookId = ctx.params.id
    ctx.body = `Deleting book ${bookId}`
    ctx.status = 200
  })

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
