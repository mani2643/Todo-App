const todoForm = document.querySelector("form");
const todoInput = document.querySelector("#todo-input");
const todoListUl = document.querySelector('#todo-list');
const addBtn = document.querySelector("#add-button");

let allTodos = getTodos();
let editingIndex = null;

// Animation;

const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }else{
            entry.target.classList.remove('show');
        }
    })
},{
    threshold:.3,
    rootMargin:"0px 0px 0px 400px"
})

updateTodoListUI();

todoForm.addEventListener('submit',function(e){
    e.preventDefault();
    addTodo();
})

function addTodo(){
    const todoText = todoInput.value.trim();

    if(todoText.length == 0){
        alert("There's nothing to add");
        return;
    }
    if(editingIndex != null){
        allTodos[editingIndex].text = todoText;
        editingIndex = null;
        addBtn.innerText = 'ADD';
    }else{
        allTodos.unshift({
            text:todoText,
            completed:false
        });
    }

    todoInput.value = '';
    updateTodoListUI();
    saveTodos();
}

function updateTodoListUI(){
    todoListUl.innerHTML = "";
    allTodos.forEach((todo,todoIndex)=>{
        const todoItem = createTodoItem(todo,todoIndex);
        todoListUl.append(todoItem);
    })
}
function createTodoItem(todo,todoIndex){
    const todoText = todo.text;
    const todoLi = document.createElement("li");
    todoLi.className = "todo";

    todoLi.innerHTML = `
                <input type="checkbox" id="todo-${todoIndex}">
                <label for="todo-${todoIndex}" class="custom-checkbox">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                </label>
                <label for="todo-${todoIndex}" class="todo-text">
                    ${todoText}
                </label>
                <button class="edit-btn" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </button>
                <button class="delete-button" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            `
    let deleteButton = todoLi.querySelector(".delete-button");
    deleteButton.addEventListener("click",function(){
        deleteTodoItem(todoIndex);
    })

    const editBtns = todoLi.querySelectorAll('.edit-btn');

    editBtns.forEach((btn)=>{
        btn.addEventListener("click",function(){
            alert("Edit todo by typing in the input box");
            editingIndex = todoIndex;
            todoInput.focus();
            todoInput.value = allTodos[todoIndex].text;
            addBtn.innerText = 'UPDATE';
        })
    })

    let checkbox = todoLi.querySelector("input");
    checkbox.addEventListener("change",function(){
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    })
    checkbox.checked = todo.completed;

    // observing

    observer.observe(todoLi);
    
    return todoLi;
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_,i)=>i!==todoIndex);
    saveTodos();
    updateTodoListUI();
}
function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos",todosJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}