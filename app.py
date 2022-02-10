from flask import Flask,request,render_template,jsonify
import pandas
app=Flask(__name__)

# the index route show the home/index page
@app.route('/')
def home():
    return render_template('index.html')

#route to add tasks to csv
@app.route('/add-todo',methods=['POST'])
def addTask():
    #get request data from post request[description, status]
    request_task=request.json   
    #create a dictionary to store the data for storing it in dataframe
    task_details={"description":request_task.get("description"),"complete":request_task.get("status")}
    #enter data into dataframe through dictionary
    dataframe_taskdetails=pandas.DataFrame(task_details,columns=['description','complete'],index=['description']);
    #error checking if the csv is not empty don't append headers
    try:
        if len(pandas.read_csv("toDo.csv"))>0:
            
            dataframe_taskdetails.to_csv("toDo.csv",mode="a",index=False,header=None)
    #if csv is empty append with headers
    except:
        dataframe_taskdetails.to_csv("toDo.csv",mode="a",index=False)
    
    return jsonify(request_task)

#route to get tasks which are not completed
@app.route('/getTasks',methods=['GET'])
def getTask():
    try:
        #get all the tasks from the csv and store in dataframe
        task_details=pandas.read_csv("toDo.csv",index_col=False)
        send_data=[]
        #go through every row in csv
        for i in range(0,len(task_details)):
            
            temp=[]
            #if status is incomplete append it to temp and send to back
            if task_details.loc[i,"complete"]==0:
                temp.append(task_details.loc[i,"description"])
                temp.append(str(task_details.loc[i,"complete"]))
                send_data.append(temp)

        return jsonify(send_data)
    except:
        #if csv is empty send empty data
        return jsonify([])

#change update status for tasks
@app.route("/updateStatus",methods=["POST"])
def updateTasks():
    #get description whose status needs to be changed
    request_params=request.json;
    #read from csv and store in dataframe
    task_details=pandas.read_csv("toDo.csv")

    #go through rows in csv and set status to complete/incomplete
    for i in range(len(task_details)):
        
        if task_details.loc[i,"description"]==request_params:
            if task_details.loc[i,"complete"]==1:
                task_details.loc[i,"complete"]=0
            else:
                task_details.loc[i,"complete"]=1

    task_details.to_csv("toDo.csv",index=False)
    return jsonify([True])

#delete task from csv
@app.route("/deleteTask",methods=["POST"])
def deleteTasks():
    request_params=request.json;
    task_details=pandas.read_csv("toDo.csv")
    # go through rows which you need to delete
    for i in range(len(task_details)):
        if task_details.loc[i,"description"]==request_params:
            task_details.drop(i,inplace=True)
    #if the csv becomes empty after removing task delete the headers
    if(len(task_details)==0):
        task_details=pandas.DataFrame(list())
    # save to csv changed tasks
    task_details.to_csv("toDo.csv",index=False)
    return jsonify([True])

if __name__=="__main__":
    app.run(debug=True)