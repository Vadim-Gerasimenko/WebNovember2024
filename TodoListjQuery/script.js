$(document).ready(function () {
    const todoList = $("#todo-list");
    const newTodoForm = $("#new-todo-form");
    const newTodoTextField = $("#new-todo-text-field");

    $(newTodoForm).submit(function (e) {
        e.preventDefault();
        $(newTodoTextField).removeClass("invalid");

        let newTodoText = $(newTodoTextField).val().trim();

        if (newTodoText.length === 0) {
            $(newTodoTextField).addClass("invalid");
            return;
        }

        const newTodoItem = $("<li>");

        function setViewMode() {
            $(newTodoItem).html(`
                <div class="todo-content">
                    <div class="todo-text"></div>
                    <div class="todo-buttons">
                        <button class="base-button edit-button" type="button">Редактировать</button>
                        <button class="base-button delete-button" type="button">Удалить </button>
                    </div>
                </div>
            `);

            $(newTodoItem).find(".todo-text").text(newTodoText);

            $(newTodoItem).find(".edit-button").click(function () {
                $(newTodoItem).html(`
                    <div>
                        <label for="edit-todo-input-field"></label>
                        <input id="edit-todo-input-field" type="text" class="base-text-field edit-todo-input-field">
                        
                        <div class="todo-buttons">
                            <button class="base-button save-button" type="button">Сохранить</button>
                            <button class="base-button cancel-button" type="button">Отмена</button>                     
                        </div>
                        <div class="error-message">Необходимо задать значение</div>
                    </div>
                `);

                const editTodoTextField = $(newTodoItem).find(".edit-todo-input-field");
                $(editTodoTextField).val(newTodoText);

                $(editTodoTextField).keypress(function (e) {
                    if (e.key === "Enter") {
                        $(saveButton).click();
                    }
                });

                const saveButton = $(newTodoItem).find(".save-button");

                $(saveButton).click(function () {
                    $(editTodoTextField).removeClass("invalid");

                    const editedTodoText = $(editTodoTextField).val().trim();

                    if (editedTodoText.length === 0) {
                        $(editTodoTextField).addClass("invalid");
                        return;
                    }

                    newTodoText = editedTodoText;
                    setViewMode();
                });

                $(newTodoItem).find(".cancel-button").click(function () {
                    setViewMode();
                });
            });

            $(newTodoItem).find(".delete-button").click(function () {
                newTodoItem.remove();
            });
        }

        setViewMode();

        $(todoList).append(newTodoItem);
        $(newTodoTextField).val("");
    });
});