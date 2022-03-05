// import './App.css';
import React,{ useEffect } from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
// import TodoList from './TodoList';
function Form({setInputText,inputText,todos,setTodos}){
    let inputTextHandler=(e)=>{
            setInputText(e.target.value);
    }  
    // useEffect(async ()=>{
        
    //     const resp=await axios
    //     .get("getIncompleteTasks")
    //     // console.log(resp)
    //     if(resp.data[0].incompleteTasks!=null)
    //     {setTodos([...todos,...resp.data[0].incompleteTasks])}
    //     // console.log(todos)
    // }
    // ,[]);
    let submitToDo=(e)=>{

        e.preventDefault();
        const formattedDate = new Date().toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second:"2-digit",
            hour12:true
          }); 
        const sendData={
            description:inputText,
            taskStatus: 0,
            id: uuidv4(),
            date:formattedDate
        }
            axios
            .post("add-todo",sendData   
            )
            .then((response)=>{
                if(response.data[0].inserted==="False"){
                    alert("task already present")
                }
                else{
                    // console.log(setTodos([]))
                    setTodos([...todos,{description:inputText,id:sendData["id"]}]);
                    setInputText("");
                    // console.log(todos)
                }
            })
           
    
    }
    return(
        <div className="enter-task">
            
            <form className="list-form">
            <input  value={inputText} type="text" name="task" id="description" onChange={inputTextHandler} autoComplete="off"/>
            <button  id="addTask" name="button" value="Add" onClick={submitToDo}>Add</button>
            </form>
        </div>
    );
};
export default Form;