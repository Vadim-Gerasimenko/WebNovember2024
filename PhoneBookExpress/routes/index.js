var express = require("express");
const {response} = require("express");
var router = express.Router();

const contacts = [];
let currentContactId = 1;

function isCorrectContact(response, contact) {
    if (contact.surname.trim().length === 0) {
        response.send({
            success: false,
            message: "Необходимо указать фамилию"
        });

        return false;
    }

    if (contact.name.trim().length === 0) {
        response.send({
            success: false,
            message: "Необходимо указать имя"
        });

        return false;
    }

    const phone = contact.phone.trim().toLowerCase();

    if (phone.length === 0) {
        response.send({
            success: false,
            message: "Необходимо указать номер телефона"
        });

        return false;
    }

    if (contacts.some(c => c.id !== contact.id && c.phone.toLowerCase() === phone)) {
        response.send({
            success: false,
            message: "Контакт с таким номером уже существует"
        });

        return false;
    }

    return true;
}

router.get("/api/contacts", function (req, res) {
    const term = (req.query.term || "").toLowerCase();

    if (term.length === 0) {
        res.send(contacts);
    } else {
        res.send(contacts.filter(c => c.name.toLowerCase().includes(term)
            || c.surname.toLowerCase().includes(term)
            || c.phone.toLowerCase().includes(term))
        );
    }
});

router.post("/api/contacts", function (req, res) {
    const contact = req.body;

    if (!isCorrectContact(res, contact)) {
        return;
    }

    contact.id = currentContactId;
    contacts.push(contact);
    ++currentContactId;

    res.send({
        success: true,
        message: null
    });
});

router.put("/api/contacts/:id", function (req, res) {
    const contact = req.body;

    if (!isCorrectContact(res, contact)) {
        return;
    }

    const contactIndex = contacts.findIndex(c => c.id === contact.id);

    if (contactIndex < 0) {
        res.send({
            success: false,
            message: "Контакт не найден"
        });

        return;
    }

    contacts[contactIndex] = contact;

    res.send({
        success: true,
        message: null
    });
});

router.delete("/api/contacts/:id", function (req, res) {
    const contactId = Number(req.params.id);

    const contactIndex = contacts.findIndex(c => c.id === contactId);

    if (contactIndex >= 0) {
        contacts.splice(contactIndex, 1);
    }

    res.send({
        success: true,
        message: null
    });
});

module.exports = router;