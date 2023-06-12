import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBUQOEqm_Zav7i1Zf_ZHs8_YkVTZ4t0I6w",
  authDomain: "details-122db.firebaseapp.com",
  databaseURL: "https://details-122db-default-rtdb.firebaseio.com",
  projectId: "details-122db",
  storageBucket: "details-122db.appspot.com",
  messagingSenderId: "968368225581",
  appId: "1:968368225581:web:405202d9585055ff0ee7a4",
  measurementId: "G-M9M9WX87B6"
};

const app = initializeApp(firebaseConfig);

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [submittedData, setSubmittedData] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send form data to the backend
    axios.post('/', formData) // Use the appropriate server URL
      .then((response) => {
        console.log(response.data);
        // Clear form data
        setFormData({ name: '', email: '' });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    // Fetch the submitted data from Firebase
    const fetchData = async () => {
      const db = getDatabase(app);
      const formDataRef = ref(db, 'formData');
      onValue(formDataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setSubmittedData(dataArray);
        }
      });
    };

    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Submit</button>
      {submittedData.length > 0 && (
        <div>
          <h2>Submitted Data:</h2>
          {submittedData.map((data) => (
            <div key={data.id}>
              <p>Name: {data.name}</p>
              <p>Email: {data.email}</p>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

export default App;

