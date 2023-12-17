const process = require("node:process");
const models = require("./src/models/index.js");
const postgres = require('postgres');
const express = require('express');
const app = express();
const port = 3000;

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'video',
  username: 'postgres',
  password: 'Tbatst01!'
});

process.on("exit", (code) => {
  sql.end();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/sql', async (req, res) => {
      res.send(await sql`select now()`);
      await sql.end();
});

app.get('/genres', async (req, res) => {
      res.send(await sql`select * from video.genres`);
      await sql.end();
});

app.get('/name/:id', async (req, res) => {
  let name = new models.Name(sql, req.params.id);

  await name.read();
  res.send(name.data);
})

app.post('/name', async (req, res) => {
  let name = new models.Name(sql);

  name.first = req.body.firstName;
  name.middle = req.body.middleName;
  name.last = req.body.lastName;
  await name.create();
  res.send(name.data);
});

app.patch('/name/:id', async (req, res) => {
  let name = new models.Name(sql, req.params.id);

  name.first = req.body.firstName;
  name.middle = req.body.middleName;
  name.last = req.body.lastName;
  await name.update();
  res.send(name.data);
});

app.delete('/name/:id', async (req, res) => {
  let name = new models.Name(sql, req.params.id);

  await name.delete();
  res.send(name.data);
});

app.get('/person/:id', async (req, res) => {
  let person = new models.Person(sql, req.params.id);

  await person.read();
  res.send(person);
})

app.post('/person', async (req, res) => {
  let person = new models.Person(sql);

  if (req.body.person_name_id) {
    await person.Name.read(req.body.person_name_id);
  }
  person.birthday = req.body.birthday;
  await person.create();
  res.send(person);
});

app.patch('/person/:id', async (req, res) => {
  let person = new models.Person(sql, req.params.id);

  if (req.body.person_name_id) {
    await person.Name.read(req.body.person_name_id);
  }
  person.birthday = req.body.birthday;
  await person.update();
  res.send(person);
});

app.delete('/person/:id', async (req, res) => {
  let name = new models.Person(sql, req.params.id);

  await name.delete();
  res.send(name.data);
});