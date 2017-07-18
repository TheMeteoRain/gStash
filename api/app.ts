import 'dotenv/config'
import * as express from 'express'
import MyError from 'lib/MyError'

const app: express.Application = express()

const port = (process.env.PORT || '3000')
app.set('port', port)
console.log(process.env.NODE_ENV, "env")

app.use(require('morgan')('dev'))
app.use(require('./poe_stash'))


// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const err: MyError = new MyError('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err: MyError, req: express.Request, res: express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // response with error
  res.json(err.status || 500)
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})