const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Mitt Väder",
    name: "Wigglor Group AB"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Wigglor Group AB"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Helpihelp",
    title: "Help",
    name: "Wigglor Group AB"
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us",
    name: "Wigglor Group AB",
    email: "contact@weather.com"
  });
});

app.get("/show-weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address"
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecaste: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term."
    });
  }
  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Wigglor Group AB",
    errorMessage: "Help article not found."
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "My 404",
    name: "Wigglor Group AB",
    errorMessage: "Page not found."
  });
});

//app.com
//app.com/about
//app.com/faq

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
