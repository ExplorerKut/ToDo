import React,{useEffect,useState} from 'react';
import Todo from './Todo';
import CompletedList from './CompletedList.js'
import axios from 'axios';
function TodoList({todos,setTodos}){
    // console.log(todos)
    useEffect(async ()=>{
        
        const resp=await axios
        .get("getIncompleteTasks")
        // console.log(resp)
        if(resp.data[0].incompleteTasks!=null)
        {setTodos([...todos,...resp.data[0].incompleteTasks])}
        // console.log(todos)
    }
    ,[]);
    const [completed,completedTodos]=useState([]);
    useEffect(()=>{
        const fetchData= async()=>{
        console.log("here")
        const resp=await axios.get("getCompleteTasks");
        if(resp.data[0].completeTask!=null){
            completedTodos([...completed,...resp.data[0].completeTask]);
        }
    
        
    }
    fetchData();
    console.log(completed);
    },[]);
    return(
            <div>
            <div className="todolist" id="todolist">
            {
                todos.map((todo)=>(
                <Todo completed={completed} completedTodos={completedTodos} todo={todo} todos={todos} setTodos={setTodos } key={todo.id} description={todo.description} id={todo.id}/>
                    ))
            }
            </div>
            <div className="completed-list">
            <div className="list-form"></div>
            <h3>Completed Tasks</h3>
            {   
                completed.map((item)=>(
                <CompletedList todos={todos} setTodos={setTodos} task={item} completed={completed} completedTodos={completedTodos} key={item.id} id={item.id}/>
            ))
            }
            </div>
            
            </div>
    )
};

export default TodoList;