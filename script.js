
let input = document.getElementById("taskInput");
const btn = document.getElementById("addTaskBtn");
const todoListContainer = document.getElementById("todoListContainer");
const taskCount = document.getElementById("tasks");
const todoApp = document.querySelector(".todo-app");
const footer_note = document.querySelector(".footer-note");
const customAlertModal = document.getElementById("customAlertModal");
const closeAlertBtn = document.getElementById("closeAlertBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterCompleted = document.getElementById("filterCompleted");
const deleteAll = document.getElementById("deleteAll");
let currentFilter = "All";

function TaskCounter() {
    let NumOftasks = todoListContainer.querySelectorAll(".todo-item").length;
    taskCount.textContent = NumOftasks;
}
function AddPopUP() {
    customAlertModal.classList.remove("alert-modal-hidden");
}

function EmptyStateMessage() {

    let existingMsg = todoListContainer.querySelector(".default-message");

    let visibalTasks = Array.from(todoListContainer.querySelectorAll(".todo-item")).filter(li => li.style.display !== "none").length;

    if (visibalTasks === 0) {
        if (!existingMsg) {
            todoListContainer.classList.add("empty-state-message");
            let message = document.createElement("p");
            message.textContent = "The list is blank, but your potential isn't. Add a task above! 📝";
            message.classList.add("default-message");
            todoListContainer.append(message);
            existingMsg = message;
        }
        if (currentFilter === "Active") {
            existingMsg.textContent = "No pending tasks! Time to relax? ☕";
        } else if (currentFilter === "Completed") {
            existingMsg.textContent = "No completed tasks yet. You've got this! 💪";
        } else {
            existingMsg.textContent = "The list is blank, but your potential isn't. Add a task above! 📝";
        }
    } else {
        if (existingMsg) {
            existingMsg.remove();
            todoListContainer.classList.remove("empty-state-message");
        }
    }

}

function FilterTasks(filtertype) {
    let AllTasks = todoListContainer.querySelectorAll(".todo-item");

    AllTasks.forEach(li => {
        let Checkbox = li.querySelector(".task-check");

        if (!Checkbox) return;

        switch (filtertype) {
            case "All":
                li.style.display = ""
                break;
            case "Active":
                li.style.display = Checkbox.checked ? "none" : ""
                break;
            case "Completed":
                li.style.display = Checkbox.checked ? "" : "none"
                break;
        }

    });
    EmptyStateMessage();
    FooterUpdate()

}

const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';


themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  let newTheme = 'light';

  if (currentTheme === 'light') {
    newTheme = 'dark';
    themeToggleBtn.textContent = '☀️'; 
    themeToggleBtn.title = "Toggle Light Mode"
  } else {
    themeToggleBtn.textContent = '🌙'; 
    themeToggleBtn.title = "Toggle Dark Mode"
  }

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); 
});

deleteAll.addEventListener("click",()=>{

 if(confirm("Are you sure want to delete all ?")){
      let AllTasks = todoListContainer.querySelectorAll(".todo-item");

    AllTasks.forEach((Task)=>{
                Task.remove();
    })
        TaskCounter();
        localStorageData();
        FilterTasks(currentFilter); 
 }
  
})

function createTask(taskText, isChecked, isInitialization = false,TaskTime = "") {


    // Creating elements

    let li = document.createElement("li");
    let div = document.createElement("div");
    let inp = document.createElement("input");
    inp.type = "checkbox";
    let span = document.createElement("span");
    let span_completed = document.createElement("span");

    let timeSpan = document.createElement("small")
    timeSpan.classList.add("time_span");

    let divtwo = document.createElement("div");
    let btn_edit = document.createElement("button");
    btn_edit.title = "Edit"
    let btn_delete = document.createElement("button");
    btn_delete.title = "Delete"

    // Classes 
    li.classList.add("todo-item");
    div.classList.add("task-info");
    inp.classList.add("task-check");
    span.classList.add("task-text");
    span_completed.classList.add("completed");
    btn_edit.classList.add("edit-btn");
    btn_delete.classList.add("delete-btn");

    // Content adding
    span.textContent = taskText;
    span_completed.textContent = " (Completed)";
    btn_edit.textContent = "✎";
    btn_delete.textContent = "✕";
    inp.checked = isChecked;

    if(TaskTime){
             timeSpan.textContent = TaskTime;
    }else{
     const time = new Date()
     timeSpan.textContent = time.toLocaleDateString("en-PK",{
        month : "short",
        day : "numeric"
     }) + `,${time.toLocaleTimeString("en-PK",{ hour :"2-digit", minute : "2-digit"})}`

    }



    // delete functionality
    btn_delete.addEventListener("click", () => {
        li.remove();
        TaskCounter();
        localStorageData();
        FilterTasks(currentFilter);
    });
    // edit functionality 
    btn_edit.addEventListener("click", () => {
        if (btn_edit.textContent === "✎") {

            btn_edit.textContent = "💾"

            let editInput = document.createElement("input")
            editInput.type = "Text"
            editInput.classList.add("edit-input-class");
            editInput.value = span.textContent;
            span.style.display = "none";
            div.insertBefore(editInput, span);
            editInput.focus();
        } else {
            let editInput = div.querySelector(".edit-input-class");
            if (editInput) {
                if (editInput.value.trim() !== "") {
                    span.textContent = editInput.value;
                }
                editInput.remove();
            }
            span.style.display = "";
            btn_edit.textContent = "✎";
            localStorageData();
        }
    });
    // checkbox
    inp.addEventListener("change", () => {
        if (inp.checked) {
            div.append(span_completed);
        } else {
            span_completed.remove();
        }
        FooterUpdate()
        localStorageData()
        FilterTasks(currentFilter);
    });

    div.append(inp, span,timeSpan);
    divtwo.append(btn_edit, btn_delete);
    li.append(div, divtwo);
    todoListContainer.append(li);


    if (isChecked) {
        div.append(span_completed);
    }


    if (!isInitialization) {
        localStorageData();
        TaskCounter();
        FilterTasks(currentFilter);
    }
}

function updateFilterUI(activeBtn) {
    const filters = [filterAll, filterActive, filterCompleted];
    filters.forEach(btn => {
        if (btn === activeBtn) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}


filterActive.addEventListener("click", () => {
    currentFilter = "Active"
    updateFilterUI(filterActive)
    FilterTasks(currentFilter);
})
filterAll.addEventListener("click", () => {
    currentFilter = "All";
    updateFilterUI(filterAll)
    FilterTasks(currentFilter);
})
filterCompleted.addEventListener("click", () => {
    currentFilter = "Completed"
    updateFilterUI(filterCompleted);
    FilterTasks(currentFilter);
})

function localStorageData() {
    let TasksArr = [];
    const item = todoListContainer.querySelectorAll(".todo-item");
    item.forEach((li) => {
        const Text = li.querySelector(".task-text");
        const isChecked = li.querySelector(".task-check")
        const Tasktime = li.querySelector(".time_span")

        if (Text && isChecked) {
            TasksArr.push(
                { Task: Text.textContent,
                 checked: isChecked.checked,
                 time : Tasktime ? Tasktime.textContent : ""
                 })
        }
    })
    localStorage.setItem("Tasks", JSON.stringify(TasksArr));
}

function FooterUpdate() {
    let totalTasks = todoListContainer.querySelectorAll(".todo-item").length;
    let completedTasks = todoListContainer.querySelectorAll(".task-check:checked").length;
    let pendingtasks = totalTasks - completedTasks;

    if (totalTasks === 0) {
        footer_note.textContent = "Adding 'Nap' to this list immediately. 😴💤";
        return;
    }

    switch (currentFilter) {
        case "Active":
            if (pendingtasks === 0) {
                footer_note.textContent = "Zero pending tasks. You wiped the slate clean! 🧼";
            } else {
                footer_note.textContent = `Showing ${pendingtasks} pending matters...`;
            }
            break;

        case "Completed":
            if (completedTasks === 0) {
                footer_note.textContent = "Get to work! Nothing completed yet. 📈";
            } else {
                footer_note.textContent = `Look at you! ${completedTasks} achievements unlocked. 🎉`;
            }
            break;

        case "All":
        default:
            if (pendingtasks === 0) {
                footer_note.textContent = "All tasks completed! You're officially free. 🍾✨";
            } else {
                footer_note.textContent = `You have ${pendingtasks} tasks pending...`;
            }
            break;
    }
}

btn.addEventListener("click", () => {
    let text = input.value;
    if (text.trim() === "") {
        AddPopUP();
        return;
    };

    createTask(text, false);
    input.value = "";
});

closeAlertBtn.addEventListener("click", () => {
    customAlertModal.classList.add("alert-modal-hidden");
})

clearCompletedBtn.addEventListener("click", () => {
    let allTasks = todoListContainer.querySelectorAll(".todo-item")

    allTasks.forEach((li) => {
        let TaskCheckBox = li.querySelector(".task-check");

        if (TaskCheckBox && TaskCheckBox.checked) {
            li.remove()
        }
    });
    TaskCounter()
    localStorageData()
    FilterTasks(currentFilter);
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        btn.click();
    }
});


function LoadTask() {
    const SaveTasks = JSON.parse(localStorage.getItem("Tasks")) || [];

    SaveTasks.forEach((item) => {
        createTask(item.Task, item.checked, true,item.time);
    })
}


LoadTask();
TaskCounter();
FilterTasks(currentFilter)