const config = require("./src/configs/config.json");
const process = require("node:process");
const models = require("./src/models/index.js");
const postgres = require('postgres');
const sql = postgres(config.db.connection);
const express = require('express');
const app = express();
const auth = require("./src/middleware/auth.js");
const Password = require("./src/utils/password.js");


process.on("exit", (code) => {
  sql.end();
});

app.use(express.json());
// app.use(auth);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.server.port, () => {
  console.log(`Example app listening at http://localhost:${config.server.port}`);
});

app.get("/hash/:password", async (req, res) => {
  const pass = new Password(req.params.password);

  res.send(pass.toString());
})

app.get('/sql', async (req, res) => {
      res.send(await sql`select now()`);
});

app.get('/encoders', async (req, res) => {
      res.send(await sql`select * from video.encoders`);
});

app.get("/encoders/:id", async (req, res) => {
  let encoder = new models.Encoder(sql, {id : req.params.id});

  await encoder.read();
  res.send(encoder.data);
});

app.post("/encoders", async (req, res) => {
  let encoder = new models.Encoder(sql, req.body);

  await encoder.create();
  res.send(encoder.data);
});

app.patch("/encoders", async (req, res) => {
  let encoder = new models.Encoder(sql, req.body);

  await encoder.update();
  res.send(encoder.data);
});

app.get('/genres', async (req, res) => {
      res.send(await sql`select * from video.genres`);
});

app.get("/genres/:id", async (req, res) => {
  let genre = new models.Genre(sql, {id : req.params.id});

  await genre.read();
  res.send(genre.data);
});

app.post("/genres", async (req, res) => {
  let genre = new models.Genre(sql, req.body);

  await genre.create();
  res.send(genre.data);
});

app.patch("/genres", async (req, res) => {
  let genre = new models.Genre(sql, req.body);

  await genre.update();
  res.send(genre.data);
});

app.get('/name/:id', async (req, res) => {
  let name = new models.Name(sql, {id : req.params.id});

  await name.read();
  res.send(name.data);
});

app.post('/name', async (req, res) => {
  let name = new models.Name(sql, req.body);

  await name.create();
  res.send(name.data);
});

app.patch('/name', async (req, res) => {
  let name = new models.Name(sql, req.body);

  await name.update();
  res.send(name.data);
});

app.delete('/name/:id', async (req, res) => {
  let name = new models.Name(sql, {id : req.params.id});

  await name.delete();
  res.send(name.data);
});

app.get('/person/:id', async (req, res) => {
  let person = new models.Person(sql, {person_id : req.params.id});

  await person.read();
  res.send(person.data);
})

app.post('/person', async (req, res) => {
  let person = new models.Person(sql, req.body);

  await person.create();
  res.send(person.data);
});

app.patch('/person', async (req, res) => {
  let person = new models.Person(sql, req.body);

  person.data.aggregates.person_name_id = person.aggregates.data.person_name_id;    // THIS SHOULD BE THE SAME!!!
  await person.update();
  res.send(person.data);
});

app.delete('/person/:id', async (req, res) => {
  let person = new models.Person(sql, {person_id : req.params.id});

  await person.delete();
  res.send(person.data);
});