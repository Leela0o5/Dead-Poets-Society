// src/App.js
import React from "react";
import "./App.css";

function App() {
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My App</h1>
        <button onClick={loginWithGoogle}>Login with Google</button>
      </header>
    </div>
  );
}

export default App;
