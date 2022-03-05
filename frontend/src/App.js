import React,{ useState } from "react";
import './App.css';
import Form from "./components/Form"
import TodoList from "./components/TodoList"
function App() {
  const [inputText, setInputText]= useState("");
  const [todos,setTodos]= useState([]); 
  // const [completed,completedTodos]=useState([]);
  return (
    <div className="main-container">
      <div className="heading">
      <h1>ToDo App</h1>
      </div>
      <Form todos={todos} setTodos={setTodos} setInputText={setInputText} inputText={inputText}/>
      <TodoList todos={todos} setTodos={setTodos} / >
    </div>
  );
}

export default App;
