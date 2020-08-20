const express = require("express");
const cors = require("cors");
const { v4: uuidv4, validate } = require('uuid')

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const newRepo = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepo)

  return response.send(newRepo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const index = repositories.findIndex(repository => repository.id === id)

  if (index < 0) {
    return response.status(400).send({ error: "ID not found" })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[index].likes,
  }
  repositories[index] = repository
  return response.send(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex(repository => repository.id === id)

  if (index < 0) {
    return response.status(400).send({ error: "ID not found" })
  }

  repositories.splice(index, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex(repository => repository.id === id)

  if (index < 0) {
    return response.status(400).send({ error: "ID not found" })
  }

  repositories[index].likes += 1

  return response.send(repositories[index])
});

module.exports = app;
