import express from 'express';
import cors from 'cors';
import routes from './routes/index';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routes);

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

export default app;
