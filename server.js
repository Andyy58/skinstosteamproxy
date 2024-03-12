const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

// import middleware
const errorHandler = require("./middleware/errorHandler");
const itemRoutes = require("./routes/items");
const fetchRoutes = require("./routes/fetch");
const updateData = require("./services/updateData");

app.use(cors());

app.use("/api", itemRoutes);
app.use("/api", fetchRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
