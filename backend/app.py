# from asyncio.windows_events import NULL
from flask import Flask,request,render_template,jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
# from sqlalchemy import aesc
from datetime import datetime

app=Flask(__name__,static_folder='../frontend/build',static_url_path='')
app.config['SECRET_KEY']='mysupersecretkey'
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://nnwhxofswdonpp:5fcdee82cc541c3cdbbdce26371c883a630600754bf82d0583faf1f57c76b289@ec2-54-164-22-242.compute-1.amazonaws.com:5432/d2phg86024slai'
db=SQLAlchemy(app)

from models import Task

# the index route show the home/index page
@app.route('/')
def home():
    return send_from_directory(app.static_folder,'index.html')


#route to add tasks to csv
@app.route('/add-todo',methods=['POST'])
def addTask():
    #get request data from post request[description, status]
    request_task=request.json   
    # print(request_task)
    #convert date into correct format
    print(request_task["date"])
    

    task_creation_datetime=datetime.strptime(request_task["date"],"%d %b %Y, %I:%M:%S %p")
    print(task_creation_datetime)
    task_details={"id":request_task.get("id"),"description":request_task.get("description"),"complete":request_task.get("taskStatus"),"date_created":task_creation_datetime}
    #check if the Task is already present
    
    # alreadyPresent=Task.query.filter_by(description=task_details["description"]).all()
    alreadyPresent=Task.query.filter(func.lower(Task.description)==task_details["description"].lower(),func.date(Task.date_created)==task_creation_datetime.date()).all()
    if len(alreadyPresent)==0:
        #create entry in database for given task
        entry=Task(id=task_details["id"],description=task_details["description"],status=True if task_details["complete"]==1 else False,date_created=task_creation_datetime)
        db.session.add(entry)
        db.session.commit()
        #return status and True
        return jsonify([{"status":"OK","inserted":"True","task":request_task}])
    else:
        #return status Ok and False
        return jsonify([{"status":"OK","inserted":"False","task":request_task}])


#route to get tasks which are not completed
@app.route('/getCompleteTasks',methods=['GET'])
def getCompleteTasks():
    complete_task=Task.query.filter_by(status=True).order_by("date_completed").all()
    if len(complete_task)>0:
        task_completed=[]
        for i in complete_task:
            temp={}
            temp["id"]=i.id
            temp["description"]=i.description
            temp["date_updated"]=i.date_completed
            temp["date_created"]=i.date_created
            task_completed.append(temp)
        print(task_completed)
        return jsonify([{"status":"OK","completed":"True","completeTask":task_completed}])
    else:
        return jsonify([{"status":"OK","completed":"False","completeTask":None}])
    #if incompleteTask are zero and complete task are more

@app.route('/getIncompleteTasks',methods=['GET'])
def getIncompleteTasks():
    incomplete_task=Task.query.filter_by(status=False).order_by("date_created").all()
    if len(incomplete_task)>0:
        task_completed=[]
        task_incomplete=[]
        for i in incomplete_task:
            temp={}
            temp["id"]=i.id
            temp["description"]=i.description
            task_incomplete.append(temp)
        return jsonify([{"status":"OK","completed":"False","incompleteTasks":task_incomplete}])
    else:
        return jsonify([{"status":"OK","completed":"True","incompleteTasks":None}])
@app.route('/getTasks',methods=['GET'])
def getTasks():
    #query database by status, where incomplete tasks are fetched
    incomplete_task=Task.query.filter_by(status=False).order_by("date_created").all()

    complete_task=Task.query.filter_by(status=True).order_by("date_completed").all()

    # print(len(complete_task))
    # print(len(incomplete_task))
    #send both the list of complete and incomplete task
    if len(incomplete_task)>0 and len(complete_task)>0:
        task_completed=[]
        task_incomplete=[]
        for i in incomplete_task:
            temp={}
            temp["id"]=i.id
            temp["description"]=i.description
            task_incomplete.append(temp)
        for i in complete_task:
            temp={}
            temp["id"]=i.id
            temp["description"]=i.description
            temp["date_updated"]=i.date_completed
            temp["date_created"]=i.date_created
            task_completed.append(temp)
        # print(task_completed)
        return jsonify([{"status":"OK","completed":"False","incompleteTasks":task_incomplete,"completeTask":task_completed}])
    #if incompleteTask are zero and complete task are more
    elif len(incomplete_task)<=0 and len(complete_task)>0:
        # print("HEre")
        task_completed=[]
        for i in complete_task:
            temp={}
            temp["id"]=i.id
            temp["description"]=i.description
            temp["date_created"]=i.date_created
            temp["date_updated"]=i.date_completed
            task_completed.append(temp)
        return jsonify([{"status":"OK","completed":"True","incompleteTasks":None,"completeTask":task_completed}])
    # if completeTask are not zero and incomplete task are zero
    elif len(incomplete_task)>0 and len(complete_task)<=0:
        task_incomplete=[]
        for i in incomplete_task:
            temp={}
            temp["id"]=i.id
            temp["description"]=i.description
            task_incomplete.append(temp)
        return jsonify([{"status":"OK","completed":"False","incompleteTasks":task_incomplete,"completeTask":None}])
    #if no complete and incomplete task left
    else:
        return jsonify([{"status":"OK","completed":"True","incompleteTasks":None,"completeTask":None}])
    


@app.route("/updateStatus",methods=["POST"])
def updateStatus():
    #get description whose status needs to be changed
    request_params=request.json;
    print(request_params)
    # print(request_params)
    #get task by id
    data=Task.query.filter_by(id=request_params.get("id")).first()
    # print(data)
    date_completed=""
    print(data)
    # check if the task is completed or not and set accordingly the completed date
    if data.status==True:
        data.status=False
        data.date_completed=None
    else:
        data.status=True
        data.date_completed=datetime.strptime(request_params["updatedDate"],"%d %b %Y, %I:%M:%S %p")
    # print(data)
    db.session.commit()
    send_data={"id":data.id,"description":data.description,"date_updated":data.date_completed,"date_created":data.date_created}
    return jsonify([{"status":"OK","completed":data.status,"task":send_data}])



@app.route("/deleteTask",methods=["POST"])
def deleteTasks():
    #delete unwanted tasks
    request_params=request.json;
    # print("------------")
    # print(request_params,"#W523523232")
    #delete tasks with specific id
    data_delete=Task.query.filter_by(id=request_params["id"]).first()
    db.session.delete(data_delete)
    #commit changes
    db.session.commit()

    return jsonify({"status":"OK","deleted":True})

@app.route("/updateTask",methods=["POST"])
def updateTask():
    #edit task
    request_params=request.json;
    #get task by id which need to be updated
    row_update=Task.query.filter_by(id=request_params.get("id")).first()
    #if any change in description then update else return False
    if request_params.get("description")!=row_update.description:
        row_update.description=request_params.get("description")
        updated_description=row_update.description
        db.session.commit()
        return jsonify({"status":"OK","updated":"True","tasks":updated_description})
    else:
        return jsonify({"status":"OK","updated":"False","tasks":request_params.get("description")})

if __name__=="__main__":
    app.run(debug=True)