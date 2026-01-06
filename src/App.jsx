import { useState, useEffect, useMemo } from 'react'
import './App.css'

function App() {
  const [sopFields, setSopFields] = useState({
    title: "",
    purpose: "",
    scope: "",
    owner: "",
    frequency: "",
  });

  const [steps, setSteps] = useState([]);
  const [links, setLinks] = useState([]);

  const updateFields = (event) => {
    const { name, value} = event.target;
    setSopFields((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const updateSteps = (index, event) => {
    const newValue = event.target.value;
    setSteps((prev) => 
      prev.map((step, i) =>
        i === index ? newValue : step
      )
    );
  };

  const addStep = () => {
    setSteps((prev) =>
    [...prev,""]);
  }

  const removeStep = (index) => 
    // (index)= position we want to delete; setSteps: we are updating the steps state; prev.filter(): create a new array by keeping only some items
    // (_, i): for each item in array: _ = the value(ignored on purpose, we don't need it to delete step), i=index; i !== index: keep every item excep the one at the i we want to remove
    setSteps((prev) => prev.filter ((_, i) => i !== index));

  const updateLinks = (index, event) => {
    const newLink = event.target.value;
    setLinks((prev) => 
      prev.map((link, i) =>
        i === index ? newLink : link
      )
    );
  };  

  const addLink = () => {
    setLinks ((prev) =>
    [...prev, ""]);
  }

  const removeLink = (index) =>
    setLinks((prev) => prev.filter ((_, i) => i !== index));


  return (
    <>
      <div>
        <p className="Title">
          Title
        </p>
        <p className="Purpose">
          Purpose
        </p>
        <p className="Purpose">
          Scope
        </p>
        <p className="Title">
          Owner
        </p>
        <p className="Purpose">
          Frequency
        </p>     
      </div>
      <h1></h1>
      <div className="card">
        <input onChange>
          
        </input>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
