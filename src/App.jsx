import { useState, useEffect, useMemo } from 'react'
import './App.css'
import sop from "./assets/images/sop.png"


function App() {
  const [sopFields, setSopFields] = useState({
    title: "",
    purpose: "",
    scope: "",
    owner: "",
    frequency: "",
  });
  const [steps, setSteps] = useState([""]);
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


  const markdown = useMemo(() => {
      const lines = [];
      const cleanTitle = sopFields.title.trim();
      //below, s is just a temporary variable name for “one item from the array". CleanSteps is the array trimmed but may contain empty strings//
      const cleanSteps = steps.map(s => s.trim());
      const cleanLinks = links.map(s=> s.trim());
      //below, we are filtering any empty fields so they dont show on the markdown output
      const realSteps = cleanSteps.filter(step => step !== "");
      const realLinks =cleanLinks.filter(link => link !== "");
      lines.push("# " + (cleanTitle || "Untitled SOP"));
      const p = sopFields.purpose.trim();
      const sc = sopFields.scope.trim();
      const o = sopFields.owner.trim();
      const f = sopFields.frequency.trim();
      if (p)  { lines.push("\n## Purpose\n" + p); }
      if (sc) { lines.push("\n## Scope\n" + sc); }
      if (o)  { lines.push("\n## Owner\n" + o); }
      if (f)  { lines.push("\n## Frequency\n" + f); }

      if (realSteps.length) {
        lines.push("\n---\n");        // horizontal rule + breathing room
        lines.push("## Steps");
      }

      //At this point, realSteps contains only non-empty step strings. forEach loops through each step and pushes a numbered Markdown line ("1. ...", "2. ...") into `lines`.
      //realLinks contains only non-empty link strings, and we push each as a bullet ("- ...") into `lines`.
      realSteps.forEach((step, i) => { lines.push(`${i+1}. ${step}`) });
      realLinks.forEach((link, i) => { lines.push("- " + link)});
      return lines.join("\n");
  }, [sopFields, steps, links])

  const handleCopy = () => {
    //navigator.clipboard is the browser’s Clipboard API. .writeText(...) is the method that copies text to the user’s clipboard.//
      navigator.clipboard.writeText(markdown);
  }

  const handleReset = () => {
      setSopFields({
      title: "",
      purpose: "",
      scope: "",
      owner: "",
      frequency: "",
    });
    setSteps([""]);
    setLinks([]);
    };



  return (
    <>
      <div className='outer-wrapper'>

        <div className='left-column'>
        </div>
        
        <div className="top-bar" />

        <div className='middle-column'>

          <div className="card sop-info-section">
            <h2 className='card-title'>
            <img className='card-icon' src={sop} alt="SOP"/>
            SOP Details
            </h2>          
            <div className="form">
              <label>Title</label>
              <input
                name = "title"
                value = {sopFields.title}
                onChange = {updateFields}
              />
              <label>Purpose</label>
              <textarea
                name = "purpose"
                value = {sopFields.purpose}
                onChange={updateFields}
              />
              <label>Scope</label>
              <textarea
                name = "scope"
                value = {sopFields.scope}
                onChange={updateFields}
              />
              <label>Owner</label>
              <input
                name = "owner"
                value = {sopFields.owner}
                onChange={updateFields}
              />
              <label>Frequency</label>
              <input
                name = "frequency"
                value = {sopFields.frequency}
                onChange={updateFields}
              />
            </div> 
          </div>

          <div className="card steps-section">
            <h2>Steps</h2>

            <button type="button" onClick={addStep}>Add Step</button>

            <div className='form'>
              {steps.map((step, i) => (
                <div key = {i}>
                  <label> Step {i+1} </label>

                  <textarea
                    value = {step}
                    onChange={(event) => updateSteps(i, event)}
                  />
                              
                <button type="button" onClick={() => removeStep(i)}>Remove Step</button>

                </div>
              ))}
            </div>
          </div>

          <div className="card links-section">
            <h2>Links</h2>

            <button type="button" onClick={addLink}>Add Link</button>

            <div className='form'>
              {links.map((link, i) => (
                <div key = {i}>

                  <input
                    value = {link}
                    onChange={(event) => updateLinks(i, event)}
                  />
                              
                <button type="button" onClick={() => removeLink(i)}>Remove Link</button>

                </div>
              ))}
            </div>    {/* map container */}               
        </div>        {/* links-section card */}
      </div>          {/* middle-column */}
        <div className='right-column'>
          <div className="card preview form">
          <h2>Preview  </h2>
          <button type="button" onClick={handleCopy}>Copy Markdown</button>  

          <button type="button" onClick={handleReset}>Reset</button> 

          <div>  
            <pre className="output">
              {markdown}
            </pre>
          </div>
        </div>  
      </div>
    </div>
    </>
  )
}

export default App
