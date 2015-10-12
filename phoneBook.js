'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите

/*
 Функция добавления записи в телефонную книгу.
 На вход может прийти что угодно, будьте осторожны.
 */
module.exports.add = function add(name, phone, email) {
    if (name === null || !checkPhone(phone) || !checkEmail(email)) {
        return;
    }
    phone = phone.replace(/\s|\(|\)|\+|-/g, '');
    phoneBook.push(
        {
            name: name,
            phone: phone,
            email: email
        }
    );
};

function checkPhone(phone) {
    var phoneRegexp = /^\+?\d{0,3}?\s*(?:\(\d{3}\)|\d{3})\s*\d{3}(?:-|\s+)?\d(?:-|\s+)?\d{3}$/;
    return phoneRegexp.test(phone);
}

function checkEmail(email) {
    var emailRegexp = /^[^\.@]+@[^\.@]+\.[^@]+$/;
    return emailRegexp.test(email);
}

/*
 Функция поиска записи в телефонную книгу.
 Поиск ведется по всем полям.
 */
module.exports.find = function find(query) {
    if (typeof (query) === 'undefined') {
        query = '';
    }
    var phoneReg = /(?:[-+0-9()])+/;
    if (phoneReg.test(query)) {
        query = query.replace(/\s|\(|\)|\+|-/g, '');
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].name.indexOf(query) > -1 || phoneBook[i].phone.indexOf(query) > -1 ||
            phoneBook[i].email.indexOf(query) > -1) {
            console.log(phoneBook[i].name + ', ' + phoneBook[i].phone + ', ' + phoneBook[i].email);
        }
    }
};

/*
 Функция удаления записи в телефонной книге.
 */
module.exports.remove = function remove(query) {
    var deletedRecords = 0;
    if (query) {
        for (var i = 0; i < phoneBook.length; i++) {
            if (phoneBook[i].name.indexOf(query) > -1 || phoneBook[i].phone.indexOf(query) > -1 ||
                phoneBook[i].email.indexOf(query) > -1) {
                phoneBook.splice(i, 1);
                deletedRecords++;
            }
        }
    }
    console.log('Удалено записей: ' + deletedRecords);
};

/*
 Функция импорта записей из файла (задача со звёздочкой!).
 */
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var fileRecords = data.split(/\n/);
    var record;
    for (var i = 0; i < fileRecords.length; i++) {
        record = fileRecords[i].split(';');
        module.exports.add(record[0], record[1], record[2]);
    }
};

/*
 Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
 */
module.exports.showTable = function showTable() {

    // Ваша чёрная магия здесь

};
