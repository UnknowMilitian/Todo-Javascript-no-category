const tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    _id: "0832ueiofalwfeljf",
    title: "Title of Task 1",
    body: "Lorem ipsum dolor amet",
    createdAt: new Date().getTime(),
  },
];

(function (arrOfTasks) {
  const objectOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // Elements UI
  const contents = document.querySelector(".contents");
  const form = document.forms["addTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];

  // Functions
  form.addEventListener("submit", onFormSubmitHandler);
  contents.addEventListener("click", onDeleteHandler);

  renderAllTasks(objectOfTasks);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Pass the list of tasks");
      return;
    }

    // Sort tasks by createdAt property
    const sortedTasks = Object.values(tasksList).sort(
      (a, b) => b.createdAt - a.createdAt
    );

    const fragment = document.createDocumentFragment();

    sortedTasks.forEach((task) => {
      const content = listItemTemplate(task);
      fragment.appendChild(content);
    });

    contents.appendChild(fragment);
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const content = document.createElement("div");
    content.classList.add("content");
    content.setAttribute("data-task-id", _id);

    content.innerHTML = `
        <div class="content__text">
            <h2>${title}</h2>
            <p>${body}</p>
        </div>
        <div class="content__button">
            <button class="content__delete">delete</button>
        </div>
    `;

    return content;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Please input values for inputs !!!");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);

    const contentItem = listItemTemplate(task);
    contents.insertAdjacentElement("afterbegin", contentItem);

    form.reset();
    saveTasksToLocalStorage(objectOfTasks);
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
      createdAt: new Date().getTime(),
    };

    objectOfTasks[newTask._id] = newTask;
    saveTasksToLocalStorage(objectOfTasks);

    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objectOfTasks[id];
    let isConfirm = confirm(`Are you sure to delete this task <${title}> ?`);
    if (!isConfirm) return isConfirm;

    delete objectOfTasks[id];
    saveTasksToLocalStorage(objectOfTasks);

    return isConfirm;
  }

  function deleteTaskFromDOM(element, confirmed) {
    if (!confirmed) return;
    element.remove();
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains("content__delete")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;

      const confirmed = deleteTask(id);

      deleteTaskFromDOM(parent, confirmed);
    }
  }

  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(Object.values(tasks)));
  }
})(tasks);
