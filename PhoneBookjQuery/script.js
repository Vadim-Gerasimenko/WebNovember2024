$(document).ready(function () {
    const addingForm = $("#contact-adding-form");
    const addingFormInputFields = $(addingForm).find("input");

    const table = $("#contacts-table");
    const tableRows = [];

    const emptyTableMessage = $("#empty-contacts-table-message");
    const allSelectionCheckboxHead = $("#all-selection-checkbox-head");

    const deleteModalElement = $("#contact-delete-modal");
    const deleteModalDialog = new bootstrap.Modal(deleteModalElement);

    const deleteModalElementLastNameLabel = $(deleteModalElement).find(".last-name");
    const deleteModalElementFirstNameLabel = $(deleteModalElement).find(".first-name");
    const deleteModalElementPhoneNumberLabel = $(deleteModalElement).find(".phone-number");

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

    class Contact {
        constructor(lastName, firstName, phoneNumber) {
            this.lastName = lastName;
            this.firstName = firstName;
            this.phoneNumber = phoneNumber;
        }
    }

    $("#all-selection-checkbox").change(function () {
        function changeAllCheckboxes(isChecked) {
            $(tableRows).each((_, row) => $(row).find(".checkbox").prop("checked", isChecked));
        }

        if (this.checked) {
            changeAllCheckboxes(true);
            return;
        }

        changeAllCheckboxes(false);
    });

    addingCollapseCloseButton.click(function () {
        addingCollapse.hide();

        setTimeout(function () {
            addingFormInputFields.each((_, field) => $(field).removeClass("is-invalid").val(""));
        }, 500);
    });

    function removeInvalidClasses(elements) {
        elements.each((_, element) => $(element).removeClass("is-invalid"));
    }

    function addContact(contact) {
        const contactIndex = tableRows.length;

        if (contactIndex === 0) {
            $("#all-selection-checkbox").prop("checked", false);
            $(allSelectionCheckboxHead).removeClass("d-none");
            emptyTableMessage.hide();
        }

        const tableRow = $("<tr>")
            .append($("<td>").append($("<input>").addClass("form-check-input checkbox").attr("type", "checkbox")))
            .append($("<td>").addClass("contact-position").text(contactIndex + 1))
            .append($("<td>").addClass("last-name").text(contact.lastName))
            .append($("<td>").addClass("first-name").text(contact.firstName))
            .append($("<td>").addClass("phone-number").text(contact.phoneNumber))
            .append($("<td>")
                .append("<button>")
                .attr("type", "button")
                .attr("data-bs-toggle", "modal")
                .attr("data-bs-target", "#contact-edit-modal")
                .text("Изменить")
                .addClass("btn btn-primary btn-sm d-inline-block border-0 ms-2")
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

                        if (updatedContact === 1) {
                            if ($(phoneNumberEditInputField).val() === detailWithPhoneNumberValue) {
                                $(detailWithLastName).text($(lastNameEditInputField).val());
                                $(detailWithFirstName).text($(firstNameEditInputField).val());

                                editModalDialog.hide();
                                return;
                            }

                            existingContactModalDialog.show(null);
                            return;
                        }

                        $(detailWithLastName).text(updatedContact.lastName);
                        $(detailWithFirstName).text(updatedContact.firstName);
                        $(detailWithPhoneNumber).text(updatedContact.phoneNumber);

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
                .addClass("btn btn-danger btn-sm d-inline-block border-0 ms-2")
                .click(function () {
                    deleteModalElementLastNameLabel.text($(tableRow).find(".last-name").text());
                    deleteModalElementFirstNameLabel.text($(tableRow).find(".first-name").text());
                    deleteModalElementPhoneNumberLabel.text($(tableRow).find(".phone-number").text());

                    $(deleteModalElement).find(".delete-button").off().click(function () {
                        const rowIndex = tableRows.indexOf(tableRow);

                        tableRows.splice(rowIndex, 1);
                        tableRow.remove();

                        for (let i = rowIndex; i < tableRows.length; ++i) {
                            $(tableRows[i]).find(".contact-position").text(i + 1);
                        }

                        if (tableRows.length === 0) {
                            allSelectionCheckboxHead.addClass("d-none");

                            emptyTableMessage.show();
                        }

                        deleteModalDialog.hide();
                    });
                })
            );

        tableRows.push(tableRow);
        $(table).find("tbody").append(tableRow);
    }

    addingForm.submit(function (e) {
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
        addingCollapseCloseButton.click();
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