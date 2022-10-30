const express = require("express");
const app = express();

let comments = [];

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const Comments = sequelize.define(
  "Comments",
  {
    // Model attributes are defined here
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  }
);

(async () => {
  await Comments.sync();
})();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// index page
app.get("/", async function (req, res) {
  const comments = await Comments.findAll();
  res.render("index", { comments: comments });
});

app.post("/create", async function (req, res) {
  console.log(req.body);

  const { content } = req.body;

  await Comments.create({ content: content });

  res.redirect("/");
});

app.post("/update/:id", async function (req, res) {
  console.log(req.params);
  console.log(req.body);

  const { id } = req.params;
  const { content } = req.body;

  // Change everyone without a last name to "Doe"
  await Comments.update(
    { content: content },
    {
      where: {
        id: id,
      },
    }
  );

  res.redirect("/");
});

app.post("/delete/:id", async function (req, res) {
  console.log(req.params);
  console.log(req.body);

  const { id } = req.params;

  // Delete everyone named "Jane"
  await Comments.destroy({
    where: {
      id: id
    },
  });

  res.redirect("/");
});

app.listen(3000);
console.log("Server is listening on port 8080");
