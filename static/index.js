        //when clicked on span strikeout text and select checkbox
        var list=document.querySelector('.todolist');
        let lastId=0;
        list.addEventListener('click',function(ev){
            if(ev.target.tagName==='SPAN'){
                if(ev.target.classList.toggle('checked')){
                    ev.target.closest('div').querySelector('INPUT').checked=true;
                }
                else{
                    ev.target.closest('div').querySelector('INPUT').checked=false;
                    
                }
                //send request to change the status
                sendCompletedList(ev.target.id);
            }
            if(ev.target.tagName==='INPUT'){

                if(ev.target.checked==true){
                    ev.target.closest('div').parentElement.querySelector('SPAN').classList.toggle('checked');
                }
                else{
                    ev.target.closest('div').parentElement.querySelector('SPAN').classList.toggle('checked');
                    
                }
                //send request to change the status
                sendCompletedList(ev.target.closest('div').parentElement.querySelector('SPAN').id);
            }

        },false);
        //when the delete button is clicked delete the div from html and send a request to function for deleting in csv
        let taskDelete=document.querySelector('.todolist');
        taskDelete.addEventListener('click',async function(ev){
            if(ev.target.tagName==='BUTTON'){
                //delete from csv wait for confirmation from database
                let status=await deleteTask(ev.target.closest('div').parentElement.querySelector('span').id);
                if(status["status"]=="OK"){
                    ev.target.closest('div').parentElement.remove();
                }
                
            }

        },false);
    
        //post request for updating status in csv
        function sendCompletedList(val){
           fetch('/updateStatus',{
                method:'POST',
                body:JSON.stringify(val),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }

           })
           .then(response=>response.json())
        
        }
        //post request for deleting task from csv
        function deleteTask(val){
            console.log(val);
           return fetch('/deleteTask',{
                method:'POST',
                body:JSON.stringify(val),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }

           })
           .then(response=>response.json())
        }



        //function to get incomplete task from csv
        function getTasks(){
                    var divElement;
                    var TaskDiv;
            fetch("/getTasks")
            .then(response=>response.json())
            .then(json=>{
                const taskDetails = document.getElementById("todolist");   
                console.log(json);
                if(json[0]["status"]==="OK"){ 
                let data_tasks=json[0]["tasks"];
                data_tasks.forEach(item=>{
                
                    //for each item we get from the csv create a div and append span,button, checkbox to it.
                    divElement = document.createElement('div');
                    TaskDiv = document.createElement('div');
                    divElement.className = "task";
                    TaskDiv.className="taskName";
                    let spanElement = document.createElement('span');
                    spanElement.innerHTML = item["description"]
                    spanElement.id=item["id"]
                    let buttonElement = document.createElement('button');
                    let checkElement=document.createElement('input');
                    checkElement.type="checkbox";
                    buttonElement.innerHTML = 'x';
                    divElement.appendChild(spanElement);
                    TaskDiv.appendChild(checkElement);
                    TaskDiv.appendChild(buttonElement);
                    divElement.appendChild(TaskDiv);
                    taskDetails.appendChild(divElement);
                    lastId=item["id"];
                    // console.log(lastId)
                    
                })
            }
            })
            .catch((error)=>{
                console.error('Error:'.error)
            });
        }
        //add task on enter key press
        function addToDoKey(e){
            if(e.which==13||e.keyCode==13){
                addToDo();
            }
        }
        //add task when clicked on button
        async function addToDo() {
            if(document.getElementById("description").value!='')
            {const data = {
                description: document.getElementById("description").value,
                id:lastId+1,
                status: 0
            };
            lastId=lastId+1;
            // console.log(data["id"]);
            let checkResponse=await addDataToCsv(data);
            if(checkResponse[0]["status"]==="OK"){
            // console.log(data);
            let divElement=document.createElement('div');
            let taskDiv=document.createElement('div');
            taskDiv.className="taskName";
            divElement.className="task";
            let spanElement=document.createElement('span');
            spanElement.innerHTML=data["description"];
            spanElement.id=lastId;
            let buttonElement=document.createElement('button');
            let checkElement=document.createElement('input');
            checkElement.type="checkbox";
            // checkElement.id="taskComplete"
            buttonElement.innerHTML='x';
            const taskDetails = document.getElementById("todolist");
            
            divElement.appendChild(spanElement);
            taskDiv.appendChild(checkElement);
            taskDiv.appendChild(buttonElement);
            divElement.appendChild(taskDiv);
            taskDetails.appendChild(divElement);
            }
            
        }
        //send data to csv as post request
        function addDataToCsv(data){
            // const data = {
            //     description: document.getElementById("description").value,
            //     id:lastId+1,
            //     status: 0
            // };
            // let responseSend={};
            document.getElementById("description").value='';
            let send_data=JSON.stringify({id:data["id"],description:data["description"],status:0})
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
        