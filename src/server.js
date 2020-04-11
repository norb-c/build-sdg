import path from 'path';
import { errors, isCelebrate, celebrate } from 'celebrate';
import { urlencoded, json } from 'body-parser';
import express from 'express';
import cors from 'cors';
import { validate, defaultHandler, xmlHandler, logToFile } from './utils';

require('dotenv').config();

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use((req, res, next) => {
  const start = new Date().getTime();
  res.on('finish', () => {
    const elapsed = (new Date().getTime() - start) / 1000;
    const str = `${start}\t\t${req.originalUrl}\t\tdone in ${elapsed} seconds \n`;
    logToFile(str);
  });
  next();
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  res.sendFile('logs.log', { root: path.join(__dirname, '../') });
});

app.post(
  '/api/v1/on-covid-19',
  celebrate({
    body: validate
  }),
  defaultHandler
);

app.post(
  '/api/v1/on-covid-19/json',
  celebrate({
    body: validate
  }),
  defaultHandler
);

app.post(
  '/api/v1/on-covid-19/xml',
  celebrate({
    body: validate
  }),
  xmlHandler
);

app.all('*', (req, res) => {
  res.status(404).json({
    error_code: 404,
    message: `Can not ${req.method} ${req.path}`,
    data: null
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).send({
      error_code: 400,
      success: false,
      message: 'Bad request'
    });
  }

  if (isCelebrate(err)) {
    return res.status(400).send({
      error_code: 400,
      success: false,
      message: err.joi.message
    });
  }
  return next(err);
});
app.use(errors());

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
