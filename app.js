const STORAGE_KEY = "rapid_prototype_todos_v1";

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const totalCountEl = document.getElementById("totalCount");
const doneCountEl = document.getElementById("doneCount");
const clearDoneBtn = document.getElementById("clearDoneBtn");

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();

function render() {
  todoList.innerHTML = "";

  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  totalCountEl.textContent = String(total);
  doneCountEl.textContent = String(done);

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "item" + (todo.done ? " done" : "");
    li.dataset.id = todo.id;

    const left = document.createElement("div");
    left.className = "left";
    left.title = "点击切换完成/未完成";

    const check = document.createElement("div");
    check.className = "check";
    check.textContent = todo.done ? "✓" : "";

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = todo.text;

    left.appendChild(check);
    left.appendChild(text);

    left.addEventListener("click", () => {
      todos = todos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t);
      saveTodos(todos);
      render();
    });

    const right = document.createElement("div");

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "secondary small";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos(todos);
      render();
    });

    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    text,
    done: false,
    createdAt: Date.now(),
  };

  todos = [newTodo, ...todos];
  saveTodos(todos);
  todoInput.value = "";
  render();
});

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  saveTodos(todos);
  render();
});

render();
