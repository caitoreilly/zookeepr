// require express.js
const express = require("express");

// tell our app to use that port if it has been set, and if not, default to port 3001
const PORT = process.env.PORT || 3001;

// instantiate the server & assign "express" so we can chain methods to express.js server
const app = express();

// require data from animals.json
const { animals } = require("./data/animals");

// create function & take in req.query as argument and filter thru the animals
// return new filtered array
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  // return the filtered results:
  return filteredResults;
}

// findById() function that takes in the id and array of the animals & returns a single animal object
function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

// add the route --> in get() method 1st argument is a string that describes route the client will fetch from
// 2nd argument is callback function that will execute every time route is accessed w/ GET request
// send() method from the res parameter(response) to send string Hello to client
app.get("/api/animals", (req, res) => {
  let results = animals;
  // call filterByQuery() in the callback
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// create new GET route for animals with property req.params & add :id to end of route
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  // if no record exists for the animal being searched for, the client receives 404 error
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

// chain the listen() method to make the server listen
// 3001 is the port (the exact destination on the host)
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
