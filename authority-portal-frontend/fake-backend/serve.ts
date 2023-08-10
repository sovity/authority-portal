import express, { Request, Response } from 'express';
console.log('Hi!')

const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Typescript World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})