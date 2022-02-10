        //when clicked on span strikeout text and select checkbox
        var list=document.querySelector('.todolist');
        list.addEventListener('click',function(ev){
            if(ev.target.tagName==='SPAN'){
                if(ev.target.classList.toggle('checked')){
                    ev.target.closest('div').querySelector('INPUT').checked=true;
                }
                else{
                    ev.target.closest('div').querySelector('INPUT').checked=false;
                    
                }
                //send request to change the status
                sendCompletedList(ev.target.textContent);
            }

        },false);
        //when the delete button is clicked delete the div from html and send a request to function for deleting in csv
        let taskDelete=document.querySelector('.todolist');
        taskDelete.addEventListener('click',function(ev){
            if(ev.target.tagName==='BUTTON'){
                //delete from csv
                deleteTask(ev.target.closest('div').parentElement.querySelector('span').innerText);

                ev.target.closest('div').parentElement.remove();
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
            fetch('/deleteTask',{
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
                json.forEach(item=>{
                    //for each item we get from the csv create a div and append span,button, checkbox to it.
                    divElement = document.createElement('div');
                    TaskDiv = document.createElement('div');
                    divElement.className = "task";
                    TaskDiv.className="taskName";
                    let spanElement = document.createElement('span');
                    spanElement.innerHTML = item[0]
                    let buttonElement = document.createElement('button');
                    let checkElement=document.createElement('input');
                    checkElement.type="checkbox";
                    buttonElement.innerHTML = 'x';
                    divElement.appendChild(spanElement);
                    TaskDiv.appendChild(checkElement);
                    TaskDiv.appendChild(buttonElement);
                    divElement.appendChild(TaskDiv);
                    taskDetails.appendChild(divElement);
                    
                })
            });
        }
        //add task on enter key press
        function addToDoKey(e){
            if(e.which==13||e.keyCode==13){
                addToDo();
            }
        }
        //add task when clicked on button
        function addToDo() {
            if(document.getElementById("description").value!='')
            {const data = {
                description: document.getElementById("description").value,
                status: 0
            };
            
            console.log(data);
            let divElement=document.createElement('div');
            let taskDiv=document.createElement('div');
            taskDiv.className="taskName";
            divElement.className="task";
            let spanElement=document.createElement('span');
            spanElement.innerHTML=data["description"];
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
            addDataToCsv();
        }
        //send data to csv as post request
        function addDataToCsv(){
            const data = {
                description: document.getElementById("description").value,
                status: 0
            };
            document.getElementById("description").value='';
            let send_data=JSON.stringify({description:data["description"],status:0})
            console.log(send_data)
            fetch("/add-todo",{
                method:"POST",
                body:send_data,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response=>response.json())}
        
        }
        //whenever the file is loaded send a request for getting incomplete task
        getTasks();
        