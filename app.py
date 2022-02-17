from flask import Flask,request,render_template,jsonify
from flask_sqlalchemy import SQLAlchemy



from sqlalchemy import desc
app=Flask(__name__)
app.config['SECRET_KEY']='mysupersecretkey'
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://nnwhxofswdonpp:5fcdee82cc541c3cdbbdce26371c883a630600754bf82d0583faf1f57c76b289@ec2-54-164-22-242.compute-1.amazonaws.com:5432/d2phg86024slai'
db=SQLAlchemy(app)
from models import Task

# the index route show the home/index page
@app.route('/')
def home():
    return render_template('index.html')


#route to add tasks to csv
@app.route('/add-todo',methods=['POST'])
def addTask():
    #get request data from post request[description, status]
    request_task=request.json   
    
    task_details={"id":int(request_task.get("id")),"description":request_task.get("description"),"complete":request_task.get("status")}
    #create entry in database for given task
    entry=Task(id=task_details["id"],description=task_details["description"],status=True if task_details["complete"]==1 else False)
    db.session.add(entry)
    db.session.commit()

    
    #return status
    return jsonify([{"status":"OK"},{"task":request_task}])


#route to get tasks which are not completed
@app.route('/getTasks',methods=['GET'])
def getTask():
    #query database by status, where incomplete tasks are fetched
    incomplete_task=Task.query.filter_by(status=False).order_by("id").all()

    send_data=[]
    for i in incomplete_task:
        temp={}
        temp["id"]=i.id
        temp["description"]=i.description
        send_data.append(temp)
    # print(send_data)
    #return list of task which are incomplete
    return jsonify([{"status":"OK","tasks":send_data}])
    


@app.route("/updateStatus",methods=["POST"])
def updateTasks():
    #get description whose status needs to be changed
    request_params=request.json;
    print(request_params)
    #get task by id
    data=Task.query.filter_by(id=request_params).first()

    # check if the task is completed or not and set accordingly
    if data.status==True:
        data.status=False
    else:
        data.status=True

    #commit the changes
    db.session.commit()
    return jsonify([{"status":"OK"}])



@app.route("/deleteTask",methods=["POST"])
def deleteTasks():
    #delete unwanted tasks
    request_params=request.json;
    #delete tasks with specific id
    data_delete=Task.query.filter_by(id=int(request_params)).first()
    db.session.delete(data_delete)
    #commit changes
    db.session.commit()

    return jsonify({"status":"OK"})

if __name__=="__main__":
    app.run(debug=True)