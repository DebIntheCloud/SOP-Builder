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
  const [steps, setSteps] = useState([{
    text: "",
    images: [],
    fileKey: Date.now(),
  }]);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(""); // handles all cases where img is too big or the wrong file type



  const updateFields = (event) => {
    const { name, value} = event.target;
    setSopFields((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const updateSteps = (index, event) => {
    const newValue = event.target.value;
    setSteps(prev => 
      prev.map((step, i) => // loops over every step
        i === index // indentifies which step is being edited
          ? { ...step, text: newValue} // copy everything in the step object, overwrite only the text field
          : step // returns all other steps unchanged
      )
    );
  };


  const addStep = () => {
      setSteps(prev => [
        ...prev,
      { text: "", images: [], fileKey: Date.now()}
    ]);
  };

  const removeStep = (index) => 
    // (index)= position we want to delete; setSteps: we are updating the steps state; prev.filter(): create a new array by keeping only some items
    // (_, i): for each item in array: _ = the value(ignored on purpose, we don't need it to delete step), i=index; i !== index: keep every item excep the one at the i we want to remove
    setSteps((prev) => prev.filter ((_, i) => i !== index));

  // IMG: Allowed file types
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxFileSizeMB = 5; // Max 5MB
    
    const handleStepImageChange = (index, e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, GIF, and WEBP formats are allowed.");
        setSteps(prev =>
          prev.map((s, i) =>
            i === index ? { ...s, images: [], fileKey: Date.now() } : s
          ));
        return;
      }

      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`Each file must be less than ${maxFileSizeMB}MB.`);
        setSteps(prev =>
          prev.map((s, i) =>
            i === index ? { ...s, images: [], fileKey: Date.now() } : s
          ));
        return;
      }

    }

      setError("");
      const urls = files.map((f) => URL.createObjectURL(f))

      setSteps(prev =>
        prev.map((step, i) =>
          i === index ? { ...step, images: [...(step.images || []), ...urls], fileKey: Date.now() } : step
        )
      );
    };


   
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
      const cleanSteps = steps.map(step => ({
        text: step.text.trim(),
        images: Array.isArray(step.images) ? step.images : [],
      }));
      const cleanLinks = links.map(s=> s.trim());
      //below, we are filtering any empty fields so they dont show on the markdown output
      const realSteps = cleanSteps.filter(step => step.text !== "" || step.images.length > 0);
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
      realSteps.forEach((step, i) => {
          if (step.text) lines.push(`${i + 1}. ${step.text}`);
          step.images.forEach((imgUrl, j) => {
            lines.push(`  ![Step ${i + 1} image ${j + 1}](${imgUrl})`);
          });
        }); // If this step has an image, add a Markdown image line for it.
      realLinks.forEach((link) => lines.push("- " + link));
      return lines.join("\n");
    }, [sopFields, steps, links])


      // Code below builds a chunk of HTML that contains the steps + real <img> tags, so when you copy it, apps like Google Docs paste the actual images, not Markdown text (bc
      // markdown cannot cary image bits, but HTML can)
      const html = useMemo(() => {
        const esc = (s = "") => // Escapes user text so it can’t break HTML
          s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

        const title = sopFields.title?.trim() || "Untitled SOP";

        
        // ${esc(title)}: Builds a string of real HTML for clipboard copy (images included). Then it Keep steps that have text OR an image. Then every step becomes a <li> and text
        // goes inside a <div>. ${s.image ? `<div><img src="${s.image}" -> this embeds image. .join("") combines all <li> blocks into one string and returns an array (required bc
        // .map() returns an array)
        return `
          <h1>${esc(title)}</h1> 
          <ol>
            ${steps
              .filter((s) => s.text.trim() || (s.images && s.images.length))
              .map(
                (s) => `
                <li>
                  <div>${esc(s.text)}</div>
                      ${(s.images || [])
                      .map((src) => `<div><img src="${src}" style="max-width:420px;height:auto;" /></div>`)
                      .join("")}
                </li>`
              )
              .join("")}
          </ol>
        `;
      }, [sopFields.title, steps]);


    // Copy HTML = plain text fallback (if the code above fails)
      const handleCopy = async () => {
    // must be HTTPS / localhost (secure context)
        const item = new ClipboardItem ({
          "text/html" : new Blob([html], { type: "text/html" }), //text/html is MIME type syntax
          "text/plain": new Blob([markdown], { type: "text/plain" }), // fallback
        });

    // Write the ClipboardItem to the system clipboard.
    // `await` is used because clipboard writes are asynchronous
    // and may take time due to browser security checks.
        await navigator.clipboard.write([item]);
  };


      const handleReset = () => {
          setSopFields({
          title: "",
          purpose: "",
          scope: "",
          owner: "",
          frequency: "",
        });
        setSteps([
          { text: "", images: [], fileKey: Date.now()}
        ]);
        setLinks([]);
        };

      const handleExport = () => {
        const w = window.open("", "_blank");
        if (!w) {
          alert ("Popup blocked. Allow popups to export PDF.");
          return;
        }

        w.document.open();
        w.document.write(`
              <!doctype html>
                <html>
                  <head>
                    <meta charset="utf-8" />
                    <title>SOP Export</title>
                    <style>
                      body { font-family: Red Rose, DM Sans; padding: 24px; }
                      img { max-width: 600px; height: auto; display: block; margin: 8px 0; }
                      h1 { margin-bottom: 12px; }
                      ol { padding-left: 20px; }
                      li { margin-bottom: 14px; }
                    </style>
                  </head>
                  <body>
                    ${html}
                  </body>
                </html>
              `);
        w.document.close();
      

        // wait for images to load, then print
        const imgs = Array.from(w.document.images);
        if (imgs.length === 0) {
          w.focus();
          w.print();
          return;
        }

        let loaded = 0;
        const done = () => {
          loaded++;
          if (loaded === imgs.length) {
            w.focus();
            w.print();
          }
        };

        imgs.forEach((img) => {
          if (img.complete) done();
          else {
            img.onload = done;
            img.onerror = done;
          }
        });
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
                    value = {step.text}
                    onChange={(event) => updateSteps(i, event)}
                  />

                  {/*Img button*/}
                  <div className='step-image-upload'>
                  <input
                    key= {step.fileKey}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleStepImageChange(i, e)}
                  />
                  
                  {/*Img preview */}  
                  {step.images?.length > 0 && (
                    <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                      {step.images.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Step ${i + 1} image ${idx + 1}`}
                          style={{ maxWidth: "200px" }}
                        />
                      ))}
                    </div>
                  )}
                </div>                            
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

          <button type="button" onClick={handleExport}>Export PDF</button>

            {/*target: tells the browser: open the link in a new tab (or new window)*/}
            {/*rel:nonreferrer: tells the browser: open the link in a new tab (or new window)*/}
          <a
            href= "https://docs.new"
            target="_blank"
            rel="noreferrer" 
            className="btn"
          >
            Open Google Docs
          </a>

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
