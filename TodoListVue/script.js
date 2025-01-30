const app = Vue.createApp({
    data() {
        return {
            newTodoItemId: 1,
            newTodoItemText: "",
            isNewTodoItemTextInvalid: false,
            items: [],
            deleteItemIndex: 0
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

            this.newTodoItemId++;
            this.newTodoItemText = "";
        },

        showDeleteTodoItemConfirm(itemIndex) {
            this.deleteItemIndex = itemIndex;
            this.$refs.confirmDeleteModal.show();
        },

        deleteTodoItem(itemIndex) {
            this.items.splice(this.deleteItemIndex, 1);
            this.$refs.confirmDeleteModal.hide();
        },

        saveTodoItem(itemIndex, newText) {
            this.items[itemIndex].text = newText;
        }
    }
});

app.component("TodoItem", {
    props: {
        item: {
            type: Object,
            required: true
        },

        index: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            isEditing: false,
            isEditingTextInvalid: false,
            editingText: this.item.text
        };
    },

    methods: {
        editTodoItem() {
            this.editingText = this.item.text;
            this.isEditing = true;
        },

        saveTodoItem() {
            this.isEditingTextInvalid = false;

            const editingText = this.editingText;

            if (editingText.length === 0) {
                this.isEditingTextInvalid = true;
                return;
            }

            this.$emit("save", this.index, editingText);

            this.isEditing = false;
        }
    },

    template: `
      <li class="mb-2">
        <template v-if="isEditing">
          <form @submit.prevent="saveTodoItem" class="row">
            <div class="col-8 me-2">
              <input v-model.trim="editingText"
                     :class="{'is-invalid': isEditingTextInvalid}"
                     class="form-control form-control-sm"
                     type="text">
              <div class="invalid-feedback">Необходимо задать значение</div>
            </div>
            <div class="col-auto ms-auto">
              <button class="btn btn-outline-primary btn-sm border-0 me-1" type="submit">
                Сохранить
              </button>
              <button @click="isEditing = false"
                      class="btn btn-outline-danger btn-sm border-0"
                      type="button">
                Отмена
              </button>
            </div>
          </form>
        </template>
        <template v-else>
          <div class="row">
            <div v-text="item.text" class="col-8 list-item-text"></div>
            <div class="col-auto ms-auto">
              <button @click="editTodoItem"
                      class="btn btn-outline-primary btn-sm border-0 me-1"
                      type="button">
                Редактировать
              </button>
              <button @click="$emit('delete', index)"
                      class="btn btn-outline-danger btn-sm border-0"
                      type="button">
                Удалить
              </button>
            </div>
          </div>
        </template>
      </li>
    `
});

app.component("Modal", {
    data() {
        return {
            instance: null
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.modal);
    },

    methods: {
        show() {
            this.instance.show();
        },

        hide() {
            this.instance.hide();
        }
    },

    template: `
      <div ref="modal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <slot name="header"></slot>
              </h5>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer">
              <slot name="action-button"></slot>
              <button @click="hide" type="button" class="btn btn-sm btn-secondary">Отмена</button>
            </div>
          </div>
        </div>
      </div>
    `
});

app.mount("#app");