$(document).ready(function () {
    const contactAddingForm = $("#contact-adding-form");
    const contactAddingFormInputFields = contactAddingForm.find("input");

    const lastNameInputField = $("#last-name-input-field");
    const firstNameInputField = $("#first-name-input-field");
    const phoneNumberInputField = $("#phone-number-input-field");

    const contactsTable = $("#contacts-table");
    const noContactsInfoMessage = $("#no-contacts-info-message");

    class Contact {
        constructor(lastName, firstName, phoneNumber) {
            this.lastName = lastName;
            this.firstName = firstName;
            this.phoneNumber = phoneNumber;
        }
    }

    const contactsTableRows = [];

    function addContact(contact) {
        const contactIndex = contactsTableRows.length;

        if (contactIndex === 0) {
            noContactsInfoMessage.hide();
        }

        const tableRow = $("<tr>")
            .append($("<td>").text(contactIndex + 1))
            .append($("<td>").text(contact.lastName))
            .append($("<td>").text(contact.firstName))
            .append($("<td>").text(contact.phoneNumber))
            .append($("<td>"));

        contactsTableRows.push(tableRow);
        $(contactsTable).find("tbody").append(tableRow);
    }

    contactAddingForm.submit(function (e) {
        e.preventDefault();

        let isValidFieldsValues = true;
        contactAddingFormInputFields.each((_, inputField) => $(inputField).removeClass("is-invalid"));

        const lastName = lastNameInputField.val().trim();

        if (lastName.length === 0) {
            $(lastNameInputField).addClass("is-invalid");
            isValidFieldsValues = false;
        }

        const firstName = firstNameInputField.val().trim();

        if (firstName.length === 0) {
            $(firstNameInputField).addClass("is-invalid");
            isValidFieldsValues = false;
        }

        const phoneNumber = phoneNumberInputField.val().trim();

        if (phoneNumber.length === 0) {
            $(phoneNumberInputField).addClass("is-invalid");
            isValidFieldsValues = false;
        }

        if (!isValidFieldsValues) {
            return;
        }

        addContact(new Contact(lastName, firstName, phoneNumber));
    });
});