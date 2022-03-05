import axios from 'axios';
import React,{useState, useEffect } from 'react'

function Todo({completed,description,id,setTodos,todo,todos,completedTodos}){
    const [isEditable,setEditable]=useState(true)
    const deleteHandler=async ()=>{
        let sendId={id:todo.id}
            const deleteTask=await axios.post("deleteTask",sendId);
            setTodos(todos.filter((currElement)=>todo.id!==currElement.id));   
    }
    const inputTextHandler=(e)=>{
        setTodos(todos.map(currElement=>{
            if(todo.id===currElement.id){
                
                return {...currElement, description:e.target.value}
            }
            return currElement
        }))
    }
    const editHandler=async (e)=>{
        e.preventDefault();
        console.log(todo)
        const data={
            id:todo.id,
            description:todo.description
        }
    
        const sendData= await axios.post("updateTask",data)


    }
    const completeHandler=async() =>{
        const formattedDate = new Date().toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second:"2-digit",
            hour12:true

          });
        
        let sendData={
            id:todo.id,
            updatedDate:formattedDate
        }
        const completeTask=await axios.post("updateStatus",sendData);
        setTodos(todos.filter((currElement)=>todo.id!==currElement.id));
        console.log(completeTask.data[0].task)
        completedTodos([...completed,completeTask.data[0].task]);
        
    }
    return(
        <div className="task">
            <form onSubmit={editHandler}>
            <input type="text" value={description} id={id} onChange={inputTextHandler}/>
            </form>
            <div className="taskName">
                <input type="checkbox" onChange={completeHandler}/>
                <button id="delete" onClick={deleteHandler}>x</button>
            </div>
        </div>
    )
}
export default Todo;