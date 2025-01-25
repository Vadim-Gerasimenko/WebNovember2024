Vue.createApp({
    data() {
        return {
            newTodoItemId: 1,
            newTodoItemText: "",
            isNewTodoItemTextInvalid: false,
            items: []
        };
    },

    methods: {
        addTodoItem() {
            this.isNewTodoItemTextInvalid = false;

            const newTodoItemText = this.newTodoItemText;

            if (newTodoItemText.length === 0) {
                this.isNewTodoItemTextInvalid = true;
                return;
            }

            this.items.push({
                id: this.newTodoItemId,
                text: newTodoItemText
            });

            ++this.newTodoItemId;
            this.newTodoItemText = "";
        },

        deleteTodoItem(itemIndex) {
            this.items = this.items.splice(itemIndex, 1);
        }
    }
}).mount("app");