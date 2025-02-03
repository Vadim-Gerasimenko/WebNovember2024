class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/contacts";
    }

    get(url, params) {
        return axios.get(url, {
            params
        }).then(response => response.data);
    }

    post(url, data) {
        return axios.post(url, data).then(response => response.data);
    }

    put(url, data) {
        return axios.put(url, data).then(response => response.data);
    }

    delete(url, data) {
        return axios.delete(url, data).then(response => response.data);
    }

    getContacts(term) {
        return this.get(this.baseUrl, {term});
    }

    createContact(contactInfo) {
        return this.post(this.baseUrl, contactInfo);
    }

    editContact(contact) {
        return this.put(`${this.baseUrl}/${contact.id}`, contact);
    }

    deleteContact(id) {
        return this.delete(`${this.baseUrl}/${id}`);
    }
}

function clearValidatingFields(component) {
    component.isSurnameInvalid = false;
    component.isNameInvalid = false;
    component.isPhoneInvalid = false;
}

function clearFormInputFields(component) {
    component.surname = "";
    component.name = "";
    component.phone = "";
}

function isContactInvalid(component, contact) {
    clearValidatingFields(component);

    if (contact.surname.length === 0) {
        component.isSurnameInvalid = true;
    }

    if (contact.name.length === 0) {
        component.isNameInvalid = true;
    }

    if (contact.phone.length === 0) {
        component.isPhoneInvalid = true;
    }

    return component.isSurnameInvalid || component.isNameInvalid || component.isPhoneInvalid;
}

const app = Vue.createApp({
    data() {
        return {
            contacts: [],
            selectedContacts: [],
            surname: "",
            name: "",
            phone: "",
            isSurnameInvalid: false,
            isNameInvalid: false,
            isPhoneInvalid: false,
            term: "",
            appliedTerm: "",
            service: new PhoneBookService()
        };
    },

    created() {
        this.getContacts();
    },

    computed: {
        isContactsExists() {
            return this.contacts.length !== 0;
        },

        isSelectedContactsMissing() {
            return this.selectedContacts.length === 0;
        },

        isFormCompleted() {
            return this.surname !== "" || this.name !== "" || this.phone !== ""
                || this.isSurnameInvalid || this.isNameInvalid || this.isPhoneInvalid;
        },

        isFilterClean() {
            return this.appliedTerm.length === 0 && this.term.length === 0;
        }
    },

    methods: {
        getContacts() {
            this.selectedContacts = [];

            this.service.getContacts(this.term)
                .then(contacts => this.contacts = contacts)
                .catch(() => alert("Не удалось загрузить контакты"));

            this.appliedTerm = this.term;
        },

        clearForm() {
            clearFormInputFields(this);
            clearValidatingFields(this);
        },

        clearFilter() {
            this.term = "";
            this.getContacts();
        },

        createContact() {
            const contactInfo = {
                surname: this.surname,
                name: this.name,
                phone: this.phone
            };

            if (isContactInvalid(this, contactInfo)) {
                return;
            }

            this.service.createContact(contactInfo)
                .then(response => {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    clearFormInputFields(this)
                    this.getContacts();
                })
                .catch(() => alert("Не удалось создать контакт"));
        },

        showEditContactModal(contact) {
            this.$refs.editContactModal.show(contact);
        },

        showDeleteContactModal(contact) {
            this.$refs.deleteContactModal.show(contact);
        },

        showDeleteSelectedContactsModal() {
            this.$refs.deleteSelectedContactsModal.show(this.selectedContacts.length);
        },

        editContact(contact) {
            this.service.editContact(contact)
                .then(response => {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    this.$refs.editContactModal.hide();
                    this.getContacts();
                })
                .catch(response => response.message);
        },

        deleteContact(contact) {
            this.service.deleteContact(contact.id)
                .then(response => {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    this.getContacts();
                })
                .catch(() => alert(`
                        Не удалось удалить контакт: ${contact.surname} ${contact.name}
                        Номер: ${contact.phone}
                    `));
        },

        deleteSelectedContacts() {
            this.selectedContacts.forEach(contact => this.deleteContact(contact));
            this.selectedContacts = [];
        }
    }
});

app.component("EditContactModal", {
    data() {
        return {
            instance: null,
            id: 0,
            surname: "",
            name: "",
            phone: "",
            isSurnameInvalid: false,
            isNameInvalid: false,
            isPhoneInvalid: false
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.modal);
    },

    methods: {
        show(contact) {
            this.id = contact.id;

            this.surname = contact.surname;
            this.name = contact.name;
            this.phone = contact.phone;

            this.instance.show();
        },

        hide() {
            clearValidatingFields(this);
            this.instance.hide();
        },

        editContact() {
            const contact = {
                id: this.id,
                surname: this.surname,
                name: this.name,
                phone: this.phone
            }

            if (isContactInvalid(this, contact)) {
                return;
            }

            this.$emit("save", contact);
        }
    },

    template: `
      <div ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false"
           tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Изменение контактных данных</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form @submit.prevent="editContact">
              <div class="modal-body">
                <div class="input-block-min-height mb-2">
                  <label for="name-edit-input-field">Фамилия</label>
                  <input v-model.trim="surname"
                         :class="{'is-invalid': isSurnameInvalid}"
                         id="name-edit-input-field"
                         type="text"
                         class="form-control">
                  <div class="invalid-feedback">Введите фамилию</div>
                </div>

                <div class="input-block-min-height mb-2">
                  <label for="surname-edit-input-field">Имя</label>
                  <input v-model.trim="name"
                         :class="{'is-invalid': isNameInvalid}"
                         id="surname-edit-input-field"
                         type="text"
                         class="form-control">
                  <div class="invalid-feedback">Введите имя</div>
                </div>

                <div class="input-block-min-height mb-2">
                  <label for="phone-edit-input-field">Номер телефона</label>
                  <input v-model.trim="phone"
                         :class="{'is-invalid': isPhoneInvalid}"
                         id="phone-edit-input-field"
                         type="text"
                         class="form-control text-truncate">
                  <div class="invalid-feedback">Введите номер телефона</div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-primary btn-sm">
                  Сохранить
                </button>

                <button @click="hide"
                        type="button"
                        class="btn btn-secondary btn-sm">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `
});

app.component("DeleteContactModal", {
    data() {
        return {
            instance: null,
            id: 0,
            surname: "",
            name: "",
            phone: ""
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.modal);
    },

    methods: {
        show(contact) {
            this.id = contact.id;

            this.surname = contact.surname;
            this.name = contact.name;
            this.phone = contact.phone;

            this.instance.show();
        },

        hide() {
            this.instance.hide();
        },

        deleteContact() {
            const contact = {
                id: this.id,
                surname: this.surname,
                name: this.name,
                phone: this.phone
            }

            this.$emit("delete", contact);
            this.hide();
        }
    },

    template: `
      <div ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false"
           tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Подтвердите удаление</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div>
                <p>
                  Вы уверены, что хотите удалить следующий контакт?
                </p>

                <div>
                  <span class="fw-semibold me-2 mb-2">Данные контакта:</span>
                  <span class="me-1">{{ surname }}</span>
                  <span>{{ name }}</span>
                </div>

                <div>
                  <span class="fw-semibold me-2">Номер телефона:</span>
                  <span>{{ phone }}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button @click="deleteContact"
                      type="button"
                      class="btn btn-danger btn-sm">
                Удалить
              </button>

              <button @click="hide"
                      type="button"
                      class="btn btn-secondary btn-sm">
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    `
});

app.component("DeleteSelectedContactsModal", {
    data() {
        return {
            instance: null,
            selectedContactsCount: 0
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.modal);
    },

    methods: {
        show(selectedContactsCount) {
            this.selectedContactsCount = selectedContactsCount;
            this.instance.show();
        },

        hide() {
            this.instance.hide();
        },

        deleteSelectedContacts() {
            this.$emit("delete");
            this.hide();
        }
    },

    template: `
      <div ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false"
           tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Подтвердите удаление</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div>
                <span>Количество выбранных контактов: </span>
                <span class="fw-semibold">{{ selectedContactsCount }}</span>
                <p>
                  Вы уверены, что хотите их удалить?
                </p>
              </div>

              <div class="modal-footer">
                <button @click="deleteSelectedContacts"
                        type="button"
                        class="btn btn-danger btn-sm">
                  Удалить
                </button>

                <button @click="hide"
                        type="button"
                        class="btn btn-secondary btn-sm">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
});

app.mount("#app");