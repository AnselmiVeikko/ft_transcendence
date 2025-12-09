import express, { type Request, type Response } from 'express';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});


export default app;