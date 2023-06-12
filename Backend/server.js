const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const path = require('path')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("client/build"));

const serviceAccount = require("./details.json");
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://details-122db-default-rtdb.firebaseio.com"
});

app.post("/", (req, res) => {
   const formData = req.body;
   console.log(formData);
   const db = admin.database();
   const ref = db.ref('formData');
   ref.push(formData, (error) => {
      if (error) {
         console.error('Error saving form data:', error);
         res.status(500).json({ message: 'Failed to save form data' });
      } else {
         console.log('Form data saved successfully');
         res.json({ message: 'Form submitted successfully!' });
      }
   });
});

app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(process.env.URL || 8000, () => {
   console.log(`Server started on port 8000`);
});

