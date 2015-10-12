'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите
var MAX_NAME_LENGTH = 50;
var MAX_PHONE_LENGTH = 22;
var MAX_EMAIL_LENGTH = 40;

/*
 Функция добавления записи в телефонную книгу.
 На вход может прийти что угодно, будьте осторожны.
 */
module.exports.add = function add(name, phone, email) {
    if (name === null || !checkPhone(phone) || !checkEmail(email)) {
        return;
    }
    phone = phone.replace(/\s|\(|\)|\+|-/g, '');
    name = name.replace(/\r\n|\r|\n/g, '');
    email = email.replace(/\r\n|\r|\n/g, '');
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
    var recordFound = [];
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
            recordFound.push(
                {
                    name: phoneBook[i].name,
                    phone: phoneBook[i].phone,
                    email: phoneBook[i].email
                }
            );
        }
    }
    return recordFound;
};

module.exports.printRecords = function printRecords(records) {
    for (var i = 0; i < records.length; i++) {
        console.log(records[i].name + ', ' +
            module.exports.phoneToPrint(records[i].phone) + ', ' + records[i].email);
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
    var records = module.exports.find('');
    // 2 - пробел слева и справа, 3 - пробел-палка-пробел
    var lineLength = MAX_NAME_LENGTH + 3 + MAX_PHONE_LENGTH + 3 + MAX_EMAIL_LENGTH + 2;
    var string = '';
    string += '╒' + module.exports.repeatSymbols('═', MAX_NAME_LENGTH + 2) + '╤' +
        module.exports.repeatSymbols('═', MAX_PHONE_LENGTH + 2) + '╤' +
        module.exports.repeatSymbols('═', MAX_EMAIL_LENGTH + 2) + '╕' + '\n';
    string += '│ Имя';
    //3, 7, 5 - длина текста шапки
    string += module.exports.repeatSymbols(' ', MAX_NAME_LENGTH - 3 + 1);
    string += '│ Телефон';
    string += module.exports.repeatSymbols(' ', MAX_PHONE_LENGTH - 7 + 1);
    string += '│ Email';
    string += module.exports.repeatSymbols(' ', MAX_EMAIL_LENGTH - 5 + 1);
    string += '│\n├';
    string += module.exports.repeatSymbols('─', lineLength);
    string += '┤\n';
    var name;
    var phone;
    var email;
    for (var i = 0; i < records.length; i++) {
        name = records[i].name;
        phone = module.exports.phoneToPrint(records[i].phone);
        email = records[i].email;
        string +=
            '│ ' + name + module.exports.repeatSymbols(' ', MAX_NAME_LENGTH - name.length + 1) +
             '│ ' + phone +
            module.exports.repeatSymbols(' ', MAX_PHONE_LENGTH - phone.length + 1) +
             '│ ' + email +
            module.exports.repeatSymbols(' ', MAX_EMAIL_LENGTH - email.length + 1) +
             '│' + '\n';
    }
    string += '╘' + module.exports.repeatSymbols('═', MAX_NAME_LENGTH + 2) + '╧' +
        module.exports.repeatSymbols('═', MAX_PHONE_LENGTH + 2) + '╧' +
        module.exports.repeatSymbols('═', MAX_EMAIL_LENGTH + 2) + '╛' + '\n';
    console.log(string);
};

module.exports.repeatSymbols = function repeatSymbols(sym, count) {
    var string = '';
    for (var i = 0; i < count; i++) {
        string += sym;
    }
    return string;
};

module.exports.phoneToPrint = function phoneToPrint(phone) {
    if (phone.length >= 11) {
        phone = '+' + phone;
    }
    phone = phone.replace(/^([+0-9]*)(\d{3})(\d{3})(\d)(\d{3})$/, '$1 ($2) $3-$4-$5');
    return phone;
};
