// require express.js
const express = require("express");

// tell our app to use that port if it has been set, and if not, default to port 3001
const PORT = process.env.PORT || 3001;

// instantiate the server & assign "express" so we can chain methods to express.js server
const app = express();

// // parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// //parse incoming JSON data
app.use(express.json());

// require data from animals.json
const { animals } = require("./data/animals");

// import and use fs library to write data to animals.json
const fs = require("fs");

// import path library (module in Node.js API) that provides utilities for working w/ file and directory paths - makes working w/ file sys more predictable
const path = require("path");

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

// createNewAnimal function that accepts the POST route's req.body value & array we want to add the data to (aniamalsArray)
function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // need to save js array data as JSON so use JSON.stringify() to convert it
  // null argument = means we don't want to edit any existing data
  // 2 argument = means we want to create white space betw our values to make it more readable
  // these make the animals.json file easier to read!

  // return finished code to post route for response
  return animal;
}

// validation function
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
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

// create POST route on server that accepts data to be used or stored server-side
app.post("/api/animals", (req, res) => {
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

// chain the listen() method to make the server listen
// 3001 is the port (the exact destination on the host)
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
