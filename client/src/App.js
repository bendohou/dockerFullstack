import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState();

  useEffect(() => {
    async function fetchCount() {
      try {
        const reponse = await fetch("/api/count");
        if (reponse.ok) {
          setCount(await reponse.json());
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchCount();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>Count : {count}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React youva
        </a>
      </header>
    </div>
  );
}

export default App;
