        //when clicked on span strikeout text and select checkbox
        var list=document.querySelector('.todolist');
        let lastId=0;
        list.addEventListener('click',async function(ev){
            //if checkbox is selected then strikeout text and send request
            if(ev.target.tagName==='INPUT'&&ev.target.type==="checkbox"){
                let status=await sendCompletedList(ev.target.closest('div').parentElement.querySelector('INPUT').id);
                console.log(status[0]);
                if(status[0]["status"]=="OK"){
                if(status[0]["completed"]==true){
                    ev.target.closest('div').parentElement.remove();
                    let taskDetails=document.getElementById("completed-list");
                    
                    insertTaskComplete(status[0]['task'],taskDetails,true)
                }
                else{
                    ev.target.closest('div').parentElement.querySelector('INPUT').classList.toggle('checked');
                    
                }
            }
                //send request to change the status
                
            }
            //if button is clicked let user change the description of task
            if(ev.target.tagName==='BUTTON'&&ev.target.id=='edit'){
                if(ev.target.closest('div').querySelector('INPUT').checked==true){
                    window.alert("Cannot Edit completed task, Uncheck Task first");
                }
                else{
                    // window.alert("here");
                    // console.log(ev.target.closest('div').querySelector('INPUT'));
                    ev.target.closest('div').parentElement.querySelector('INPUT[type="text"]').readOnly=false;
                    ev.target.closest('div').parentElement.querySelector('INPUT[type="text"]').focus();
                }
            }
        },false);
        //when the delete button is clicked delete the div from html and send a request to function for deleting in database
        let taskDelete=document.querySelector('.todolist');
        taskDelete.addEventListener('click',async function(ev){
            if(ev.target.tagName==='BUTTON'&&ev.target.id==='delete'){
                //delete from site wait for confirmation from database
                let status=await deleteTask(ev.target.closest('div').parentElement.querySelector('input').id);
                if(status["status"]=="OK"){
                    ev.target.closest('div').parentElement.remove();
                }
            }

        },false);
        //delete completed list task
        let deleteCompletedTask=document.querySelector('.completed-list');
        deleteCompletedTask.addEventListener('click',async function(ev){
            if(ev.target.tagName==='BUTTON'&&ev.target.className=='deleteCompletedTask'){
                //delete from csv wait for confirmation from database
                let status=await deleteTask(ev.target.closest('div').querySelector('SPAN').id);
                if(status["status"]=="OK"){
                    ev.target.closest('div').remove();
                }
            }

        },false);
    
        //post request for updating status in database
        function sendCompletedList(val){
            let date= new Date();
            const formattedDate = date.toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second:"2-digit"
              });
            console.log(formattedDate);
            const send_data={
                value:val,
                updatedDate:formattedDate

            }
           return fetch('/updateStatus',{
                method:'POST',
                body:JSON.stringify(send_data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }

           })
           .then(response=>response.json())
        
        }
        //post request for deleting task from database
        function deleteTask(val){
            // console.log(val);
           return fetch('/deleteTask',{
                method:'POST',
                body:JSON.stringify(val),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }

           })
           .then(response=>response.json())
        }
        //insert the task after getting confirmation from database
        function insertTaskComplete(item,taskDetails,pageLoad){
            // let parentDiv=document.getElementById('completed-list');
            console.log(taskDetails.childNodes)
            if(taskDetails.childNodes.length===3){
                
                    let headerCompleted=document.createElement('h3');
                    headerCompleted.innerHTML="Completed tasks";
                    taskDetails.appendChild(headerCompleted)
            }
            let divElement=document.createElement('div');
            divElement.className="task-list"

            let spanElement=document.createElement('span');
            spanElement.id=item['id'];
            spanElement.innerHTML=item['description']
            let buttonElement=document.createElement('button');
            
            buttonElement.innerHTML='x';
            buttonElement.className="deleteCompletedTask"
            // buttonElement.onclick

            // buttonElement.onclick=deleteTask(item['id']);
            divElement.appendChild(spanElement);
            
            divElement.appendChild(buttonElement);
            let undoElement;
            let currTime=new Date()
            let completedate=new Date(item["date_updated"]+"+0530")
            console.log(item)
            console.log(completedate)
            console.log(currTime)
            console.log(currTime.getTime()-completedate.getTime());

            if(pageLoad==true&&currTime.getTime()-completedate.getTime()<=25000){

                undoElement=document.createElement('button')
                undoElement.innerHTML='UNDO';
                // console.log("here")
                // console.log(item)
                undoElement.onclick=()=>{undoTask(item);}
                // if(currTime.getTime()-completedate.getTime()<=25){
                    setTimeout(()=>{undoElement.disabled=true;},25000-(currTime.getTime()-completedate.getTime()))
                
                // else{
                // setTimeout(()=>{undoElement.disabled=true;},25000)
                // }

                divElement.appendChild(undoElement);
            }
            
            taskDetails.appendChild(divElement);
            
            
        }
        //insert to completed task list
        async function undoTask(item){
            // if(item["date_completed"])
            // let currDate=new Date();
            // console.log(currDate.getTime())
            // let completedate=new Date(item["date_completed"]+"+0530")

            // console.log(completedate.getTime())
            // console.log(item["date_created"])
            let incomList=document.getElementById("todolist");
            
            let status=await sendCompletedList(item["id"]);
            console.log(status);

            if(status[0]["status"]==="OK"){
                document.getElementById(item["id"]).closest("div").remove()
            insertTaskIncomplete(item,incomList);
            }
           
            // document.getElementById(item["id"]).closest("div").remove()

        }
        //insert the completed task aftergetting confirmation from database
        function insertTaskIncomplete(item, taskDetails){
            // if(item["incompleteTasks"]!="None"){
                    //for each item we get from the database create a div and append span,button, checkbox to it.
                    divElement = document.createElement('div');
                    TaskDiv = document.createElement('div');
                    divElement.className = "task";
                    TaskDiv.className="taskName";

                    let inputTask=document.createElement('input');
                    inputTask.type="text";
                    inputTask.id=item["id"];
                    inputTask.onkeyup=updateTask;
                    inputTask.readOnly=true;
                    inputTask.value=item["description"];
                    let buttonElement = document.createElement('button');
                    let EditElement=document.createElement('button');
                    let checkElement=document.createElement('input');
                    checkElement.type="checkbox";
                    buttonElement.innerHTML = 'x';
                    EditElement.id='edit';
                    EditElement.innerHTML="EDIT";
                    buttonElement.id='delete';
                    divElement.appendChild(inputTask);
                    
                    TaskDiv.appendChild(checkElement);
                    TaskDiv.appendChild(EditElement);
                    TaskDiv.appendChild(buttonElement);
                    
                    divElement.appendChild(TaskDiv);
                    taskDetails.appendChild(divElement);
        // }
    }


        //function to get incomplete task from database
        function getTasks(){
                    let divElement;
                    let TaskDiv;
            fetch("/getTasks")
            .then(response=>response.json())
            .then(json=>{
                   
                // console.log(json);
                //if status is ok and no incomplete task left
                if(json[0]["status"]==="OK"&&json[0]["completed"]=="True"){
                    
                    //if no task is added
                    if(json[0]["completeTask"]==null&&json[0]["incompleteTasks"]==null){
                        window.alert("No task added");
                    }
                    //if every task is completed
                    if(json[0]["completeTask"]!=null){

                        let taskDetails=document.getElementById("completed-list")
                        let data_tasks=json[0]["completeTask"];
                        let headerCompleted=document.createElement('h3');
                        headerCompleted.innerHTML="Completed tasks";
                        taskDetails.appendChild(headerCompleted)
                        data_tasks.forEach(item=>{
                        insertTaskComplete(item,taskDetails,true)
                        })
                        // window.alert("You completed every task");
                        
                    } 
                }
                //if there are incomplete task left
                if(json[0]["status"]==="OK" && json[0]["completed"]=="False"){

                    const taskDetails = document.getElementById("todolist");
                    let data_tasks=json[0]["incompleteTasks"];
                    data_tasks.forEach(item=>{
                    if(item["incompleteTasks"]!="None"){
                    insertTaskIncomplete(item,taskDetails)
                    }
                    
                }
                )
                //if some task are completed
                if(json[0]["completeTask"]!=null){
                    let taskDetails=document.getElementById("completed-list")
                    let data_tasks=json[0]["completeTask"];
                    let headerCompleted=document.createElement('h3');
                    headerCompleted.innerHTML="Completed tasks";
                    taskDetails.appendChild(headerCompleted)
                    data_tasks.forEach(item=>{
                    insertTaskComplete(item,taskDetails,true)
                    })

                    
                }
            }
            })
            .catch((error)=>{
                window.alert("error while getting task please refresh")
            });
        }
        //add task on enter key press
        function addToDoKey(e){
            if(e.which==13||e.keyCode==13){
                addToDo();
            }
        }
        //post request to send the updated task description
        function updateTask(e){
            if(e.which==13||e.keyCode==13){
                const data={
                    id:e.target.id,
                    description:e.target.value
                };
            fetch("/updateTask",{
                method:"POST",
                body:JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response=>response.json())
            .then(json=>{
                e.target.readOnly=true;
                e.target.blur();
                // console.log(json);
            })
                
            }
        }
        //add task when clicked on button
        async function addToDo() {
            if(document.getElementById("description").value!='')
            {   
                let date=new Date();
                const formattedDate = date.toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    second:"2-digit"
                  });
                const data = {
                description: document.getElementById("description").value,
                id:uuidv4(),
                status: 0,
                date:formattedDate,
            };
            // console.log(data);
            // console.log(data["id"]);
            let checkResponse=await addDataToDatabase(data);
            if(checkResponse[0]["status"]==="OK"&&checkResponse[1]["inserted"]==="True"){
            console.log(checkResponse);
            let divElement=document.createElement('div');
            let taskDiv=document.createElement('div');
            taskDiv.className="taskName";
            divElement.className="task";
            let inputTask=document.createElement('input');
            inputTask.type="text";
            inputTask.id=data["id"];
            inputTask.onkeyup=updateTask;
            inputTask.readOnly=true;
            inputTask.value=data["description"];
            let buttonElement=document.createElement('button');
            let EditElement=document.createElement('button');
            let checkElement=document.createElement('input');
            checkElement.type="checkbox";
            EditElement.innerHTML="EDIT";
            EditElement.id="edit";
            buttonElement.id='delete';
            buttonElement.innerHTML='x';
            const taskDetails = document.getElementById("todolist");
            divElement.appendChild(inputTask);
            taskDiv.appendChild(checkElement);
            taskDiv.appendChild(EditElement);

            taskDiv.appendChild(buttonElement);
            divElement.appendChild(taskDiv);
            taskDetails.appendChild(divElement);
            }
            else{
                window.alert("Task already present");
            }
            
        }
        //send data to database as post request
        function addDataToDatabase(data){
            document.getElementById("description").value='';
            let send_data=JSON.stringify(data)
            // console.log(send_data)
           return fetch("/add-todo",{
                method:"POST",
                body:send_data,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response=> response.json())
        
        }
            
            // console.log(responseSend);
            
            
        }
        //whenever the file is loaded send a request for getting incomplete task
        getTasks();
        