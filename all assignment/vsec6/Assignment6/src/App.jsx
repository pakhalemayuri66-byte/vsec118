import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      `Student Name: ${name}, Roll Number: ${rollNo}, Branch: ${branch}`
    );
  }

  return (
    <div className="container">
      <h1>Student Registration Form</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <input
            type="number"
            placeholder="Enter Roll Number"
            value={rollNo}
            onChange={(event) => setRollNo(event.target.value)}
            required
            min="1"
          />
        </div>

        <br />

        <div>
          <input
            type="text"
            placeholder="Enter Branch"
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Register Student</button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;