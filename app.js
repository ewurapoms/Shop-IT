const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const categoryRoute = require("./routes/cateRoute");
const productRoute = require("./routes/prodRoute");
const cartRoute = require("./routes/cartRoute");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const swaggerDocument = require("./swagger.json");

// Parses incoming requests
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes for handling requests
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/cart", cartRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send('API IS NOW WORKING, append "/docs" to the current url to access API documentation');
});

// Error Handler
app.use((req, res, next) => {
  const error = new Error();
  error.message = "Not Found";
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error });
});

module.exports = app;
