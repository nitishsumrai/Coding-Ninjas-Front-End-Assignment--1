input = document.getElementById("todo-input");

ulOfTodos = document.getElementById("ul-of-todos");
let todoListJSON = JSON.parse(localStorage.getItem("todoList"));
if (todoListJSON === null) {
    todoListJSON = {
        list: []
    }
    localStorage.setItem("todoList", JSON.stringify(todoListJSON));
}
addNumOfJobLeft();
// to change the color of a tag which is slected
changeColorOfListType();
(function showJobs() {

    // default type of jobs to show is all
    if (localStorage.getItem("typeOfJobsToShow") === null) {
        localStorage.setItem("typeOfJobsToShow", "all");
    }

    let typeOfJobsToShow = localStorage.getItem("typeOfJobsToShow");
    console.log(typeOfJobsToShow);
    for (let job of todoListJSON["list"]) {


        if (typeOfJobsToShow == "completed" && job.status == "1") {
            // adding all completed jobs in UL           
            console.log(job.status + " " + typeOfJobsToShow)
            addTodoInHTML(job);
        }
        if (typeOfJobsToShow == "uncompleted" && job.status == "0") {
            // adding all uncompleted jobs in UL
            addTodoInHTML(job);
        }
        if (typeOfJobsToShow == "all") {
            // adding all jobs in UL
            console.log(job.status + " " + typeOfJobsToShow)
            addTodoInHTML(job);
        }



    }
})();


document.addEventListener("keyup", addTodo);

document.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
        e.preventDefault();
    });
})

document.addEventListener('click', function (e) {

    if (e.target.classList.contains("remove-icon")) {
        removeTodo(e.target.id);
    }
    console.log(e.target.id);
    if (e.target.id == "enter-todo") {
        addTodo("addJob");
    }
    if (e.target.id === "mark-completed") {
        let x = document.querySelectorAll('input:checked').forEach(function (li) {
            let jobId = li.parentElement.parentElement.parentElement.id.split('-')[1];
            markCompleted(jobId);
        });
        location.reload();
    }
    if (e.target.id === "clear-completed") {
        removeCompleted();
        location.reload();
    }

    if (e.target.id === "all-completed-job") {
        localStorage.setItem("typeOfJobsToShow", "completed");
        localStorage.setItem("change-color", e.target.id);
        location.reload();
    }
    if (e.target.id === "all-uncompleted-job") {
        localStorage.setItem("typeOfJobsToShow", "uncompleted");
        localStorage.setItem("change-color", e.target.id);
        location.reload();
    }
    if (e.target.id === "all-job") {
        localStorage.setItem("typeOfJobsToShow", "all");
        localStorage.setItem("change-color", e.target.id);
        location.reload();
    }
});
function removeTodo(id) {
    // deleting job from localStorage
    for (let i = 0; i < todoListJSON["list"].length; i++) {
        console.log(id + " " + todoListJSON["list"][i].id);

        if (todoListJSON["list"][i].id === id) {
            todoListJSON["list"].splice(i, 1);
            localStorage.setItem("todoList", JSON.stringify(todoListJSON));
            break;
        }
    }
    document.getElementById('item-' + id).remove();
    todoListJSON = JSON.parse(localStorage.getItem("todoList"));
    addNumOfJobLeft();
}
// adding job to UL
function addTodoInHTML(job) {

    li = document.createElement("li");
    li.classList.add("todo-list-item");
    li.setAttribute('id', "item-" + job.id);
    li.innerHTML =
        "<div class='list-item'><span><input type='checkbox' name='' id=''><span><h4 class='name-of-todo'>" + job.job +
        "</h4></span></span><span class='remove-todo-icon'><i id=" + job.id +
        " class='fa fa-times remove-icon' aria-hidden='true'></i></span></div>";
    if (job.status == "1") {
        li.classList.add("job-completed");
    }
    ulOfTodos.appendChild(li);
}
// adding job to LocalStorage and also in UL
function addTodo(ev) {

    // add job when enter key is pressed or when add icon is clicked 
    if (ev.key === "Enter" || ev == "addJob") {
        let newTodo = input.value;
        newTodo = newTodo.trimEnd().trimStart();
        let todoList = localStorage.getItem("todoList");
        let jsonTodoList;
        if (todoList !== "") {
            jsonTodoList = JSON.parse(todoList);
        }

        // if new todo is not empty ,add new todo in todo list
        if (newTodo !== "") {
            // set Job ID for each Job   
            if (localStorage.getItem("ID") === null) {
                localStorage.setItem("ID", "0");
            }
            let jsonNewTodo = { id: `${parseInt(localStorage.getItem("ID"))}`, job: newTodo, status: "0" };
            localStorage.setItem("ID", `${parseInt(localStorage.getItem("ID")) + 1}`);

            if (todoList === "") {
                jsonTodoList = { list: [] };
            }
            jsonTodoList["list"].push(jsonNewTodo);
            addTodoInHTML(jsonNewTodo);
            localStorage.setItem("todoList", JSON.stringify(jsonTodoList));
        }
        input.value = "";
    }
    todoListJSON = JSON.parse(localStorage.getItem("todoList"));
    addNumOfJobLeft();
}
// mark job is completed
function markCompleted(jobId) {
    todoListJSON = JSON.parse(localStorage.getItem("todoList"));
    for (let i = 0; i < todoListJSON["list"].length; i++) {
        if (todoListJSON["list"][i].id === jobId) {
            todoListJSON["list"][i].status = "1";
            localStorage.setItem("todoList", JSON.stringify(todoListJSON));
            break;
        }
    }
    addNumOfJobLeft();
}
// remove jobs which are completed
function removeCompleted() {
    todoListJSON = JSON.parse(localStorage.getItem("todoList"));
    let newTodoList = {
        list: []
    };
    for (var i = 0; i < todoListJSON["list"].length; i++) {

        if (todoListJSON["list"][i].status === "1") {

        } else {
            newTodoList["list"].push(todoListJSON["list"][i]);
        }
    }
    console.log(newTodoList, todoListJSON);

    localStorage.setItem("todoList", JSON.stringify(newTodoList));
    addNumOfJobLeft();
}
// add a elem to show numbers of job left
function addNumOfJobLeft() {
    let numOfJobLeft = 0;
    todoListJSON = JSON.parse(localStorage.getItem("todoList"));

    for (var job of todoListJSON["list"]) {
        if (job.status == "0") {
            numOfJobLeft++;
        }
    }
    let jobLeftElem = document.getElementById("job-todo");
    jobLeftElem.innerText = numOfJobLeft + " tasks left";
}
// change color of type of list
function changeColorOfListType() {

    let newElem = localStorage.getItem("change-color");
    // no elem is assigned,assign all
    if (!newElem) {
        localStorage.setItem("change-color", "all-job");
        newElem = "all-job"
    }

    // add change color class in new elem

    newElem = document.getElementById(newElem);
    newElem.classList.add("change-color");
}