const express = require('express');
const compression = require('compression');
const { resolve } = require('path');

const { PORT = 8080 } = process.env;

const app = express();

app.use(compression());
app.use(express.static(resolve('dist/client')));

app.use((req, res) => {
  res.sendFile(resolve('dist/client/index.html'));
});

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}/`);
});
