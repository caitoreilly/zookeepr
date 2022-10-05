// require express.js
const express = require("express");

// tell our app to use that port if it has been set, and if not, default to port 3001
const PORT = process.env.PORT || 3001;

// instantiate the server & assign "express" so we can chain methods to express.js server
const app = express();

// require statements will read the index.js files in each of the directories indicated
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

// // parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// //parse incoming JSON data
app.use(express.json());

/* add middleware to instruct server to make frontend code files in public folder available/accessible (make the 
  files static resources) without having to create specific server endpoints for the frontend code  */
app.use(express.static("public"));

/* tell server that any time a client navigates to <ourhost>/api, the app will use the router set up in 
apiRoutes. if / is the endpoint, the router will serve back our HTML routes*/
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// // require data from animals.json
// const { animals } = require("./data/animals");

// // import and use fs library to write data to animals.json
// const fs = require("fs");

// // import path library (module in Node.js API) that provides utilities for working w/ file and directory paths - makes working w/ file sys more predictable
// const path = require("path");
// const { get } = require("http");

// chain the listen() method to make the server listen
// 3001 is the port (the exact destination on the host)
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
