const path = require("path");
const router = require("express").Router();

// add a route to server.js that serves index.html
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// add route that serves & takes us to animals.html
router.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

// add route that serves up the zookeepers.html file
router.get("/zookeeprs", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

// add wildcard route for endpoints that do not exist - bring user back to homepage
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;
