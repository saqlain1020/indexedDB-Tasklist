
//////////////////Database Stuf//////////////////////////////////////////////////////////////////////
function createDB(event){
    const request = indexedDB.open("TaskList By .::S.S.R::.");
    request.onupgradeneeded = (e) =>{
        db = e.target.result;
        db.createObjectStore("Tasks",{keyPath: "id"});
        alert(`Upgrade\nDBName: ${db.name}\nDBVersion: ${db.version}`);
    }
    request.onsuccess = (e) =>{
        db = e.target.result;
        alert(`Success\nDBName: ${db.name}\nDBVersion: ${db.version}`);
        console.log(db);
    }
    request.onerror = (e) =>{
        alert(`Error Called \n${e.target.error}`);
    }
    console.log(db);
    readTasks();
}
function addTasks(event){ 
    for(let i = 0 ; i<tasks.length;i++){
        const task = {
            id: tasks[i].id,
            name: tasks[i].name,
            isCompleted: tasks[i].isCompleted
        }
        console.log(task);
        const tx = db.transaction("Tasks","readwrite");
        const objStore = tx.objectStore("Tasks");
        objStore.add(task);
        tx.onerror = e =>{alert(`Error! ${e.target.error}`)};
    }
}
function readTasks(){
    // event.preventDefault();
    try{
        console.log("read");
        console.log(db);
        const tx = db.transaction("Tasks");
        const objStore = tx.objectStore("Tasks");
        const request = objStore.openCursor();
        tasks = [];
        request.onsuccess = e =>{
            const cursor = e.target.result;
            if(cursor){
                //do something with cursor
                const newTask = {
                    name: cursor.value.name,
                    isCompleted: cursor.value.isCompleted,
                    id: cursor.key
                }
                tasks.push(newTask)
                //recall above request on success event
                cursor.continue();
            }
            renderList(tasks);
        }
        
    }catch(Exception){
        console.log(Exception);
    }
    
    
}
function updateTasks(event){
    event.preventDefault();
    const tx = db.transaction("Tasks","readwrite");
    const objStore = tx.objectStore("Tasks");
    objStore.clear();
    addTasks();
}

var tasks=[]
var db;
var updateDBBtn = document.querySelector("#updateDB");
updateDBBtn.addEventListener("click", updateTasks);
var readDBBtn = document.querySelector("#readDB");
readDBBtn.addEventListener("click", readTasks);
createDB();
// readTasks();
////////////////////////////////Database Stuff////////////////////////////////////////////////////////////////////////////////////////
var input = document.getElementById("input");
var inputButton = document.querySelector("#inputForm>button")
var list = document.querySelector(".list")

var search = document.querySelector("#search")
var all = document.querySelector("#all")
var completed = document.querySelector("#completed")
var active = document.querySelector("#active")

//Add Button
inputButton.addEventListener("click",function(event){
    event.preventDefault();
    //Take Input Task
    var inputString = input.value;
    // console.log(inputString)
    var newTask = {
        name: inputString,
        isCompleted: false,
        id: tasks.length+1
    }
    tasks.push(newTask)

    //Render List
    renderList(tasks)
    input.value = ""
});

//Render List User Defined Function
function renderList(tasks){
    list.innerHTML=""
    for (var i =0 ;i< tasks.length; i++) {
        if(tasks[i].isCompleted==false)
            list.insertAdjacentHTML("beforeend",`<h3>&bull;${tasks[i].name}&nbsp;&nbsp;&nbsp;<button id="t${tasks[i].id}done">DONE</button>&nbsp;&nbsp;&nbsp;<button id="t${tasks[i].id}delete">DELETE</button></h3>`)    
        else{
            list.insertAdjacentHTML("beforeend",`<h3>&bull;${tasks[i].name}&nbsp;&nbsp;&nbsp;<button id="t${tasks[i].id}redo"style="background-color: lightgreen;">REDO</button>&nbsp;&nbsp;&nbsp;<button id="t${tasks[i].id}delete">DELETE</button></h3>`)    
        }
    }
}

//Click on list
list.addEventListener('click',function(event){

    //Event on press of Delete Button
    if(event.target.id.includes("delete")){
        var str = event.target.id.replace("delete","")
        str = str.slice(1)
        console.log(str)
        var newTasks=[]
        var j=0
        for (var i = 0; i < tasks.length; i++) {
            if(tasks[i].id!=str){
                tasks[i].id=j
                j++;
                newTasks.push(tasks[i])
            }
        }
        tasks = newTasks
        renderList(tasks)
        console.log(tasks)
    }

    //Event on press of Done Button
    if(event.target.id.includes("done")){
        var str = event.target.id.replace("done","")
        str = str.slice(1)
        for (var i = 0; i < tasks.length; i++) {
            if(tasks[i].id==str){
                tasks[i].isCompleted=true
                break
            }
        }
        renderList(tasks)

    }

    //Event on press of Redo Button
    if(event.target.id.includes("redo")){
        var str = event.target.id.replace("redo","")
        str = str.slice(1)
        for (var i = 0; i < tasks.length; i++) {
            if(tasks[i].id==str){
                tasks[i].isCompleted=false
                break
            }
        }
        renderList(tasks)
    }

})

//search event
search.addEventListener('input',function(){
    var searchInput = search.value
    var newTasks=[]
    for(var i = 0; i<tasks.length;i++){
        if(tasks[i].name.includes(searchInput)){
            newTasks.push(tasks[i])
        }
    }
    renderList(newTasks)
})

//All Event
all.addEventListener('click',function(event){
    event.preventDefault()
    renderList(tasks)
})

//Completed Event
completed.addEventListener('click',function(event){
    event.preventDefault()
    var newTasks=[]
    for(var i = 0;i<tasks.length;i++){
        if(tasks[i].isCompleted==true)
            newTasks.push(tasks[i])
    }
    renderList(newTasks)
})

//Active Event
active.addEventListener('click',function(event){
    event.preventDefault()
    var newTasks=[]
    for(var i = 0;i<tasks.length;i++){
        if(tasks[i].isCompleted==false)
            newTasks.push(tasks[i])
    }
    renderList(newTasks)
})