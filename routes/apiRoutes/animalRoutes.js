const router = require("express").Router();

const {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal,
} = require("../../lib/animal.js");
const { animals } = require("../../data/animals");

// add the route --> in get() method 1st argument is a string that describes route the client will fetch from
// 2nd argument is callback function that will execute every time route is accessed w/ GET request
// send() method from the res parameter(response) to send string Hello to client
router.get("/api/animals", (req, res) => {
  let results = animals;
  // call filterByQuery() in the callback
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// create new GET route for animals with property req.params & add :id to end of route
router.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  // if no record exists for the animal being searched for, the client receives 404 error
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

// create POST route on server that accepts data to be used or stored server-side
router.post("/api/animals", (req, res) => {
  // req.body is where our incoming content will be - where we access data on server side & do something w/ it
  // using res.json() to send the data back to the client
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

module.exports = router;
