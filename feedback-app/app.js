const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static HTML, CSS, JS from 'public' folder

app.post("/submit-feedback", (req, res) => {
  const { name, rating, comments } = req.body;

  // Basic validation
  if (!name || !rating) {
    return res.status(400).send("<h2>Error: Name and rating are required!</h2>");
  }

  const feedback = {
    name,
    rating,
    comments,
    date: new Date().toISOString(),
  };

  // Read old feedbacks, append new one, and save back
  fs.readFile("feedback.json", "utf8", (err, data) => {
    let feedbacks = [];
    if (!err && data) {
      try {
        feedbacks = JSON.parse(data);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
      }
    }

    feedbacks.push(feedback);

    fs.writeFile("feedback.json", JSON.stringify(feedbacks, null, 2), (err) => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).send("<h2>Error saving feedback. Try again later.</h2>");
      }

      res.send(`
        <h2>Thank you, ${name}!</h2>
        <p>Your feedback has been recorded successfully.</p>
        <a href="/">Go back</a>
      `);
    });
  });
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
