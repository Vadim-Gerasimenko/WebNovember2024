document.addEventListener("DOMContentLoaded", function () {
    const todoList = document.getElementById("todo-list");
    const newTodoForm = document.getElementById("new-todo-form");
    const newTodoTextField = document.getElementById("new-todo-text-field");

    newTodoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        newTodoTextField.classList.remove("invalid");

        let newTodoText = newTodoTextField.value.trim();

        if (newTodoText.length === 0) {
            newTodoTextField.classList.add("invalid");
            return;
        }

        const newTodoItem = document.createElement("li");

        function setViewMode() {
            newTodoItem.innerHTML = `
                <div>
                    <div class="todo-text"></div>
                    <button class="base-button edit-button" type="button">Редактировать</button>
                    <button class="base-button delete-button" type="button">Удалить </button>
                </div>
            `;

            newTodoItem.querySelector(".todo-text").textContent = newTodoText;

            newTodoItem.querySelector(".edit-button").addEventListener("click", function () {
                newTodoItem.innerHTML = `
                    <div>
                        <textarea class="base-text-field edit-todo-text-area"></textarea>
                        <button class="base-button save-button" type="button">Сохранить</button>
                        <button class="base-button cancel-button" type="button">Отмена</button>
                        <div class="error-message">Необходимо задать значение</div>
                    </div>
                `;

                const editTodoTextField = newTodoItem.querySelector(".edit-todo-text-area");
                editTodoTextField.value = newTodoText;

                editTodoTextField.addEventListener("keypress", function (e) {
                    if (e.key === "Enter") {
                        saveButton.click();
                    }
                });

                const saveButton = newTodoItem.querySelector(".save-button");

                saveButton.addEventListener("click", function () {
                    editTodoTextField.classList.remove("invalid");

                    const editedTodoText = editTodoTextField.value.trim();

                    if (editedTodoText.length === 0) {
                        editTodoTextField.classList.add("invalid");
                        return;
                    }

                    newTodoText = editedTodoText;
                    setViewMode();
                });

                newTodoItem.querySelector(".cancel-button").addEventListener("click", function () {
                    setViewMode();
                });
            });

            newTodoItem.querySelector(".delete-button").addEventListener("click", function () {
                newTodoItem.remove();
            });
        }

        setViewMode();
        todoList.appendChild(newTodoItem);
        newTodoTextField.value = "";
    });
});