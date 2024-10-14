const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
const addButton = document.getElementById('add-button');

let isEditing = false;
let currentEditId = null;

let tasks = getLocalStorage();
updateTodoList();

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

addButton.addEventListener('click', () => {
    if (isEditing) {
        editTask(currentEditId);
        isEditing = false;
        currentEditId = null;
        addButton.textContent = 'ADD TASK';
    } else {
        addTask();
    }
});

clearButton.addEventListener('click', clearCompletedTasks);

function addTask() {
    const taskText = todoInput.value.trim();

    if (taskText === "") {
        alert("You must type something!");
        return;
    }

    const task = {
        id: new Date().getTime(),
        content: taskText,
        isCompleted: false
    };

    tasks.push(task);

    saveLocalStorage();
    updateTodoList();

    todoInput.value = '';
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== parseInt(id));

    saveLocalStorage();
    updateTodoList();
}

function editTask(id) {
    const editText = todoInput.value.trim();

    if (editText === "") {
        alert('You must type something!');
        return;
    }

    const task = tasks.find(task => task.id === parseInt(id));
    task.content = editText;

    saveLocalStorage();
    updateTodoList();

    todoInput.value = '';
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.isCompleted);

    saveLocalStorage();
    updateTodoList();
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    tasks.forEach(({ id, content }, index) => {
        let taskItem = createTaskItem(id, content, index);
        todoListUL.appendChild(taskItem);
    });
}

function createTaskItem(id, content, index) {
    const taskId = "task-" + id;
    const taskLI = document.createElement('li');
    taskLI.className = 'task';
    taskLI.id = id;
    taskLI.innerHTML = `
        <input type="checkbox" id="${taskId}">
        <label class="custom-checkbox" for="${taskId}">
            <i class="fa-solid fa-check"></i>
        </label>
        <label for="${taskId}" class="task-text">
            ${content}
        </label>
        <button class="button edit-button">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="button delete-button">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    // Delete task
    const deleteButton = taskLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        deleteTask(id);
    });

    // Save completed task to localStorage
    const checkbox = taskLI.querySelector('input');
    checkbox.addEventListener('change', () => {
        tasks[index].isCompleted = checkbox.checked;
        saveLocalStorage();
    })
    checkbox.checked = tasks[index].isCompleted;

    // Edit task
    const editButton = taskLI.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
        todoInput.value = content;
        addButton.textContent = 'EDIT TASK';

        isEditing = true;
        currentEditId = id;
    });

    return taskLI;
}

function saveLocalStorage() {
    const tasksJSON = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksJSON);
}

function getLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    
    return tasks ? JSON.parse(tasks) : [];
}