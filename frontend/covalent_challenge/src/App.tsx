import React, { useState, useEffect } from 'react';
// look up destructuring imports ^
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import axios from "axios";

interface todo {
  id: any;
  title: any;
  description: any;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<todo[]>([]);

  useEffect(() => {
    refreshList();
  }, [])

  const refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => {
        console.log(res);
        setTodos(res.data);
      })
      .catch((err) => console.log(err));


  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <div>
          {todos && todos.length && todos.map((todo) => {
            if (todo) {
              return (
                todo.title
              )
            }
          })}
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
