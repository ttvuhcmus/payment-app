const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const route = require("./routes/index");

const app = express();

const PUBLIC_PATH = path.join(__dirname, "../public");
app.use(express.static(PUBLIC_PATH));

require("dotenv").config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 6868;

require("./middleware/express-session")(app);
require("./middleware/cookie-parser")(app);
require("./middleware/express-handlebars")(app);
require("./middleware/passport")(app);

route(app);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!!!!`));
