// Reemplaza la obtención de elementos con jQuery 
const taskInput = $('#taskInput'); 
const addButton = $('#addButton'); 
const taskList = $('#taskList'); 
 
// Inicialización 
function initialize() { 
  loadTasks(); 
  fetchTasksFromAPI(); 
} 
 
// Cargar tareas desde el LocalStorage 
function loadTasks() { 
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
  tasks.forEach(task => { 
    addTaskToDOM(task.text, task.completed); 
  }); 
} 
 
// Guardar tareas en el LocalStorage 
function saveTasksToLocalStorage(tasks) { 
  localStorage.setItem('tasks', JSON.stringify(tasks)); 
} 
 
// Agregar una tarea al DOM 
function addTaskToDOM(taskText, completed) { 
  const li = $('<li>'); 
  li.html(` 
    <span class="task${completed ? ' completed' : ''}">${taskText}</span> 
    <span class="delete">Eliminar</span> 
  `); 
  taskList.append(li); 
 
  const taskElement = li.find('.task'); 
  taskElement.on('click', () => toggleTaskCompletion(li, taskText, completed)); 
 
  const deleteButton = li.find('.delete'); 
  deleteButton.on('click', () => { 
    deleteTask(li, taskText); 
  }); 
} 
 
// Agregar una nueva tarea 
function addTask() { 
  const taskText = taskInput.val().trim(); 
  if (taskText !== '') { 
    addTaskToDOM(taskText, false); 
 
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
    tasks.push({ text: taskText, completed: false }); 
    saveTasksToLocalStorage(tasks); 
 
    taskInput.val(''); 
  } 
} 
 
// Alternar completitud de tarea 
function toggleTaskCompletion(li, taskText, completed) { 
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
  const taskIndex = tasks.findIndex(task => task.text === taskText); 
 
  if (taskIndex !== -1) { 
    tasks[taskIndex].completed = !completed; 
    saveTasksToLocalStorage(tasks); 
    li.find('.task').toggleClass('completed'); 
  } 
} 
 
// Eliminar una tarea 
function deleteTask(li, taskText) { 
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
  const updatedTasks = tasks.filter(task => task.text !== taskText); 
  saveTasksToLocalStorage(updatedTasks); 
  li.remove(); 
} 
 
// Event Listeners (Utiliza jQuery para los eventos) 
addButton.on('click', addTask); 
 
// Cargar tareas desde la API JSONPlaceholder 
function fetchTasksFromAPI() { 
  // Verifica si ya hay tareas en el localStorage antes de cargar desde la API 
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
  if (tasks.length === 0) { 
    fetch('https://jsonplaceholder.typicode.com/todos') 
      .then(response => { 
        if (!response.ok) { 
          throw new Error('No se pudo obtener la lista de tareas desde la API.'); 
        } 
        return response.json(); 
      }) 
      .then(data => { 
        data.forEach(task => { 
          addTaskToDOM(task.title, task.completed); 
        }); 
 
        // Actualiza el LocalStorage con las tareas obtenidas de la API 
        saveTasksToLocalStorage(data); 
      }) 
      .catch(error => { 
        console.error('Error al cargar tareas desde la API:', error); 
        // Mostrar un mensaje de error en la interfaz de usuario si es necesario 
      }); 
  } 
} 
 
// Inicializa la página 
$(document).ready(initialize);
