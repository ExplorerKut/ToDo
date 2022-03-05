import React,{useEffect, useState} from 'react'
import axios from 'axios'
import TodoList from './TodoList';
function CompletedList({todos,setTodos,task,completed,id,completedTodos}){

    const [isUndoable,checkUndo]=useState(false)
    // console.log(task)
    useEffect(()=>{
        const currentTime= new Date().getTime()
        const updateTime=new Date(task.date_updated+"+0530").getTime()
        if(currentTime-updateTime<=25000){

            checkUndo(true)
            const timer= setTimeout(()=>{
                checkUndo(false)
            },25000-(currentTime-updateTime))
        }
        else{
            checkUndo(false)
        }

        // const date_updated=new Date(date_created)
    },[]);
    const editHandler= async()=>{
        let sendData={
            id:task.id,
            updatedDate:""
        }
        const shiftTask=await axios.post("updateStatus",sendData);
        setTodos([...todos,task])
        completedTodos(completed.filter((currElement)=>task.id!==currElement.id));
        
    }
    const deleteHandler=async ()=>{
        let sendId={id:task.id}
            const deleteTask=await axios.post("deleteTask",sendId);
            completedTodos(completed.filter((currElement)=>task.id!==currElement.id));   
    }
    return(
        <div className="task-list">
            <div className="task-description">
            <h4 className="time-completed"><span>{task.date_updated}</span></h4>
            <span>{task.description}</span>
            </div>
            <div className="change-task">
            <button className={`${isUndoable ?"undoTask":"undoableTask"}`} onClick={editHandler} >UNDO</button>
            <button className="deleteCompletedTask" onClick={deleteHandler}>x</button>
            </div>
        </div>
    )
}
export default CompletedList;