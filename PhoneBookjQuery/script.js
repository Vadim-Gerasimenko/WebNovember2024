$(document).ready(function () {
    const addingForm = $("#contact-adding-form");
    const addingFormInputFields = $(addingForm).find("input");

    const table = $("#contacts-table");
    const tableRows = [];
    let visibleTableRows = tableRows.slice();

    const emptyTableMessage = $("#empty-contacts-table-message");

    const filter = $("#filter");
    const filterInputField = $(filter).find("#filter-input-field");
    const filterCheckbox = $(filter).find("#filter-application-checkbox");

    const allSelectionCheckboxHead = $("#all-selection-checkbox-head");
    const allSelectionCheckbox = $("#all-selection-checkbox");
    let checkedTableRows = [];

    const deleteSelectedButton = $("#delete-selected-button");

    const deleteModalElement = $("#contact-delete-modal");
    let deleteModalElementBody = $("");

    const deleteModalDialog = new bootstrap.Modal(deleteModalElement);

    const editModalElement = $("#contact-edit-modal");
    const editModalDialog = new bootstrap.Modal(editModalElement);
    const editModalElementInputFields = $(editModalElement).find("input");

    const lastNameEditInputField = $(editModalElement).find("#last-name-edit-input-field");
    const firstNameEditInputField = $(editModalElement).find("#first-name-edit-input-field");
    const phoneNumberEditInputField = $(editModalElement).find("#phone-number-edit-input-field");

    const existingContactModalElement = $("#existing-contact-modal");
    const existingContactModalDialog = new bootstrap.Modal(existingContactModalElement);

    const addingCollapse = new bootstrap.Collapse(addingForm, {
        toggle: false
    });

    const addingCollapseCloseButton = $("#contact-adding-collapse-close-button");

    $(filterInputField).keypress(function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            $(filterCheckbox).click();
            $(filterCheckbox).focus();
        }
    });

    $(filterCheckbox).keypress(function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            $(filterCheckbox).click();
        }
    });

    $(filterCheckbox).change(function () {
        if (this.checked) {
            filterInputField.attr("disabled", true);
            const prompt = filterInputField.val().toLowerCase().trim();

            function isMatchedPrompt(row) {
                return $(row).find(".last-name").text().toLowerCase().includes(prompt)
                    || $(row).find(".first-name").text().toLowerCase().includes(prompt)
                    || $(row).find(".phone-number").text().toLowerCase().includes(prompt);
            }

            visibleTableRows = tableRows.filter(row => isMatchedPrompt(row));

            visibleTableRows.forEach((row, index) => {
                $(row).find(".number").text(index + 1);
            });

            tableRows
                .filter(row => !isMatchedPrompt(row))
                .forEach(row => hide(row));

            if (visibleTableRows.length === 0) {
                $(emptyTableMessage).show();
                hide(allSelectionCheckboxHead);
            }

            return;
        }

        $(emptyTableMessage).hide();
        show(allSelectionCheckboxHead);

        tableRows.forEach((row, index) => {
            $(row).find(".number").text(index + 1);
            visibleTableRows.push(row);

            show(row);
        });

        filterInputField.attr("disabled", false);
    });

    function updateFilter() {
        if ($(filterCheckbox).prop("checked")) {
            filterCheckbox.change();
            filterCheckbox.change();
        }
    }

    $(deleteModalElement).on("hidden.bs.modal", function () {
        deleteModalElementBody.remove();
    });

    class Contact {
        constructor(lastName, firstName, phoneNumber) {
            this.lastName = lastName;
            this.firstName = firstName;
            this.phoneNumber = phoneNumber;
        }
    }

    function updateCheckedRows(row) {
        removeSoft(checkedTableRows, row);

        if (checkedTableRows.length === 0) {
            hide(deleteSelectedButton);
        }
    }

    function updateAllSelectionCheckbox() {
        if (checkedTableRows.length === tableRows.length) {
            setCheckedProperty(allSelectionCheckbox, true);
        }
    }

    function checkContactsExistence() {
        if (tableRows.length === 0) {
            hide(allSelectionCheckboxHead);
            hide(filter);

            $(emptyTableMessage).show();
        }
    }

    function hide(element) {
        $(element).addClass("d-none");
    }

    function show(element) {
        $(element).removeClass("d-none");
    }

    $(deleteSelectedButton).click(function () {
        deleteModalElementBody = $(`
            <div>
                <div>
                    <span>Количество выбранных контактов:</span>
                    <span class="fw-semibold">${checkedTableRows.length}</span>
                    <span>из</span>
                    <span class="fw-semibold">${tableRows.length}</span>
                </div>
                <div>
                    Вы уверены, что хотите удалить их?
                </div>
            </div>
        `);

        configureDeleteModalDialog(checkedTableRows);
    });

    function configureDeleteModalDialog(removedRows) {
        $(deleteModalElement).find(".modal-body").append(deleteModalElementBody);
        deleteModalDialog.show(null);

        $(deleteModalElement).find(".delete-button").off().click(function () {
            $(removedRows).each((_, row) => {
                updateCheckedRows(row);
                updateIndexes(tableRows, removeHard(tableRows, row));
            });

            updateAllSelectionCheckbox();
            checkContactsExistence();

            if (this === deleteSelectedButton) {
                hide(deleteSelectedButton);
            }

            deleteModalDialog.hide();
        });
    }

    $(allSelectionCheckbox).keypress(function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            $(allSelectionCheckbox).click();
        }
    });

    $(allSelectionCheckbox).change(function () {
        function changeAllCheckboxes(isChecked) {
            $(tableRows).each((_, row) => setCheckedProperty($(row).find(".checkbox"), isChecked));
        }

        if (this.checked) {
            changeAllCheckboxes(true);

            checkedTableRows = tableRows.slice();
            show(deleteSelectedButton);

            return;
        }

        changeAllCheckboxes(false);

        checkedTableRows = [];
        hide(deleteSelectedButton);
    });

    $(addingCollapseCloseButton).click(function () {
        addingCollapse.hide();

        setTimeout(function () {
            addingFormInputFields.each((_, field) => $(field).removeClass("is-invalid").val(""));
        }, 500);
    });

    function removeInvalidClasses(elements) {
        elements.each((_, element) => $(element).removeClass("is-invalid"));
    }

    function removeHard(elements, removedElement) {
        const index = removeSoft(elements, removedElement);
        removedElement.remove();

        return index;
    }

    function removeSoft(elements, removedElement) {
        const index = elements.indexOf(removedElement);

        if (index !== -1) {
            elements.splice(index, 1);
        }

        return index;
    }

    function updateIndexes(rows, removedRowIndex) {
        if (removedRowIndex < 0) {
            return;
        }

        for (let i = removedRowIndex; i < rows.length; ++i) {
            $(rows[i]).find(".number").text(i + 1);
        }
    }

    function setCheckedProperty(element, isChecked) {
        $(element).prop("checked", isChecked);
    }

    function addContact(contact) {
        const contactIndex = tableRows.length;

        if (contactIndex === 0) {
            setCheckedProperty(allSelectionCheckbox, false);

            $(emptyTableMessage).hide();

            show(allSelectionCheckboxHead);
            show(filter);
        }


        const tableRow = $("<tr>")
            .append($("<td>").append($("<input>")
                .addClass("form-check-input checkbox")
                .attr("type", "checkbox")
                .change(function () {
                    if (this.checked) {
                        checkedTableRows.push(tableRow);

                        show(deleteSelectedButton);
                        updateAllSelectionCheckbox();

                        return;
                    }

                    updateCheckedRows(tableRow);
                    setCheckedProperty(allSelectionCheckbox, false);
                })
                .keypress(function (e) {
                    if (e.which === 13 || e.keyCode === 13) {
                        $(this).click();
                    }
                })
            ))
            .append($("<td>").addClass("number").text(contactIndex + 1))
            .append($("<td>").addClass("last-name").text(contact.lastName))
            .append($("<td>").addClass("first-name").text(contact.firstName))
            .append($("<td>").addClass("phone-number").text(contact.phoneNumber))
            .append($("<td>")
                .append("<button>")
                .attr("type", "button")
                .attr("data-bs-toggle", "modal")
                .attr("data-bs-target", "#contact-edit-modal")
                .text("Изменить")
                .addClass("btn btn-primary btn-sm d-inline-block border-0 ms-3 mt-1")
                .click(function () {
                    removeInvalidClasses(editModalElementInputFields);

                    const detailWithLastName = $(tableRow).find(".last-name");
                    const detailWithFirstName = $(tableRow).find(".first-name");
                    const detailWithPhoneNumber = $(tableRow).find(".phone-number");

                    const detailWithPhoneNumberValue = $(detailWithPhoneNumber).text();

                    $(lastNameEditInputField).val($(detailWithLastName).text());
                    $(firstNameEditInputField).val($(detailWithFirstName).text());
                    $(phoneNumberEditInputField).val(detailWithPhoneNumberValue);

                    $(editModalElement).find(".save-changes-button").off().click(function () {
                        const updatedContact = addContactDetails(editModalElementInputFields);

                        if (updatedContact === -1) {
                            return;
                        }

                        let lastName;
                        let firstName;
                        let phoneNumber;

                        if (updatedContact === 1) {
                            if ($(phoneNumberEditInputField).val().trim() !== detailWithPhoneNumberValue) {
                                existingContactModalDialog.show(null);
                                return;
                            } else {
                                lastName = $(lastNameEditInputField).val();
                                firstName = $(firstNameEditInputField).val();
                                phoneNumber = detailWithPhoneNumberValue;
                            }
                        } else {
                            lastName = updatedContact.lastName;
                            firstName = updatedContact.firstName;
                            phoneNumber = updatedContact.phoneNumber;
                        }

                        $(detailWithLastName).text(lastName);
                        $(detailWithFirstName).text(firstName);
                        $(detailWithPhoneNumber).text(phoneNumber);

                        updateFilter();
                        editModalDialog.hide();
                    });
                })
            )
            .append($("<td>")
                .append("<button>")
                .attr("type", "button")
                .attr("data-bs-toggle", "modal")
                .attr("data-bs-target", "#contact-delete-modal")
                .text("Удалить")
                .addClass("btn btn-danger btn-sm d-inline-block border-0 ms-3 mt-1")
                .click(function () {
                    deleteModalElementBody = $(`
                        <div>
                            <p>
                                Вы уверены, что хотите удалить следующий контакт?
                            </p>
                            <div>
                                <span class="fw-semibold">Данные контакта:</span>
                                <span class="last-name"></span>
                                <span class="first-name"></span>
                            </div>
                            <div>
                                <span class="fw-semibold">Номер телефона:</span>
                                <span class="phone-number"></span>
                            </div>
                        </div>
                    `);

                    $(deleteModalElementBody).find(".last-name").text($(tableRow).find(".last-name").text());
                    $(deleteModalElementBody).find(".first-name").text($(tableRow).find(".first-name").text());
                    $(deleteModalElementBody).find(".phone-number").text($(tableRow).find(".phone-number").text());

                    configureDeleteModalDialog([tableRow]);
                })
            );

        setCheckedProperty(allSelectionCheckbox, false);
        $(table).find("tbody").append(tableRow);

        tableRows.push(tableRow);
        updateFilter();
    }

    $(addingForm).submit(function (e) {
        e.preventDefault();

        const contact = addContactDetails(addingFormInputFields);

        if (contact === -1) {
            return;
        }

        if (contact === 1) {
            existingContactModalDialog.show(null);
            return;
        }

        addContact(contact);
        $(addingCollapseCloseButton).click();
    });

    function addContactDetails(inputFields) {
        removeInvalidClasses(inputFields);

        function getInputFieldValue(inputField) {
            const value = $(inputField).val().trim();

            if (value.length === 0) {
                $(inputField).addClass("is-invalid");
                isValidFieldsValues = false;
            }

            return value;
        }

        let isValidFieldsValues = true;

        const lastName = getInputFieldValue(inputFields[0]);
        const firstName = getInputFieldValue(inputFields[1]);
        const phoneNumber = getInputFieldValue(inputFields[2]);

        if (!isValidFieldsValues) {
            return -1;
        }

        if ($(tableRows).filter((_, row) => $(row).find(".phone-number").text() === phoneNumber).length > 0) {
            $(existingContactModalElement).find(".phone-number").text(phoneNumber);
            return 1;
        }

        return new Contact(lastName, firstName, phoneNumber);
    }
});