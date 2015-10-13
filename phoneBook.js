'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите
var MAX_NAME_LENGTH = 50;
var MAX_PHONE_LENGTH = 22;
var MAX_EMAIL_LENGTH = 40;
var PHONE_REGEXP = /^\+?\d{0,3}?\s*(?:\(\d{3}\)|\d{3})\s*\d{3}(?:-|\s+)?\d(?:-|\s+)?\d{3}$/;
var EMAIL_REGEXP = /^[^\.@]+@[^\.@]+\.[^@]+$/;
var PHONE_FIND_REGEXP = /(?:[-+0-9()])+/;

/*
 Функция добавления записи в телефонную книгу.
 На вход может прийти что угодно, будьте осторожны.
 */
function add(name, phone, email) {
    if (name === null || !PHONE_REGEXP.test(phone) || !EMAIL_REGEXP.test(email)) {
        return;
    }
    phone = normalizePhone(phone);
    name = normalizeString(name);
    email = normalizeString(email);
    phoneBook.push(createRecord(name, phone, email));
}

/*
 Функция поиска записи в телефонную книгу.
 Поиск ведется по всем полям.
 */
function find(query) {
    var recordFound = [];
    query = query || '';
    if (PHONE_FIND_REGEXP.test(query)) {
        query = normalizePhone(query);
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (findInRecord(phoneBook[i], query)) {
            recordFound.push(
                createRecord(phoneBook[i].name, phoneBook[i].phone, phoneBook[i].email)
            );
        }
    }
    return recordFound;
}

function findInRecord(record, query) {
    return (record.name.indexOf(query) !== -1 || record.phone.indexOf(query) !== -1 ||
    record.email.indexOf(query) !== -1);
}

function normalizePhone(phone) {
    return phone.replace(/\s|\(|\)|\+|-/g, '');
}

function normalizeString(string) {
    return string.replace(/\r\n|\r|\n/g, '');
}

function createRecord(name, phone, email) {
    return {name: name, phone: phone, email: email};
}

function printRecords(records) {
    for (var i = 0; i < records.length; i++) {
        console.log(records[i].name + ', ' +
            phoneToPrint(records[i].phone) + ', ' + records[i].email);
    }
}

/*
 Функция удаления записи в телефонной книге.
 */
function remove(query) {
    query = query || '';
    if (PHONE_FIND_REGEXP.test(query)) {
        query = normalizePhone(query);
    }
    var deletedRecords = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if (findInRecord(phoneBook[i], query)) {
            phoneBook.splice(i, 1);
            i--;
            deletedRecords.push(
                createRecord(phoneBook[i].name, phoneBook[i].phone, phoneBook[i].email)
            );
        }
    }
    return deletedRecords;
}

/*
 Функция импорта записей из файла (задача со звёздочкой!).
 */
function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var fileRecords = data.split('\n');
    if (fileRecords.length > 0 && fileRecords[0].split(';').length === 3) {
        var record;
        for (var i = 0; i < fileRecords.length; i++) {
            record = fileRecords[i].split(';');
            add(record[0], record[1], record[2]);
        }
    }
}

/*
 Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
 */
function showTable() {
    var records = find('');
    // 2 - пробел слева и справа, 3 - пробел-палка-пробел
    var lineLength = MAX_NAME_LENGTH + 3 + MAX_PHONE_LENGTH + 3 + MAX_EMAIL_LENGTH + 2;
    var string = '';
    string += '╒' + repeatSymbols('═', MAX_NAME_LENGTH + 2) + '╤' +
        repeatSymbols('═', MAX_PHONE_LENGTH + 2) + '╤' +
        repeatSymbols('═', MAX_EMAIL_LENGTH + 2) + '╕' + '\n';
    string += '│ Имя';
    //3, 7, 5 - длина текста шапки
    string += repeatSymbols(' ', MAX_NAME_LENGTH - 3 + 1);
    string += '│ Телефон';
    string += repeatSymbols(' ', MAX_PHONE_LENGTH - 7 + 1);
    string += '│ Email';
    string += repeatSymbols(' ', MAX_EMAIL_LENGTH - 5 + 1);
    string += '│\n├';
    string += repeatSymbols('─', lineLength);
    string += '┤\n';
    for (var i = 0; i < records.length; i++) {
        var name = records[i].name;
        var phone = phoneToPrint(records[i].phone);
        var email = records[i].email;
        string +=
            '│ ' + name + repeatSymbols(' ', MAX_NAME_LENGTH - name.length + 1) + '│ ' + phone +
            repeatSymbols(' ', MAX_PHONE_LENGTH - phone.length + 1) + '│ ' + email +
            repeatSymbols(' ', MAX_EMAIL_LENGTH - email.length + 1) + '│' + '\n';
    }
    string += '╘' + repeatSymbols('═', MAX_NAME_LENGTH + 2) + '╧' +
        repeatSymbols('═', MAX_PHONE_LENGTH + 2) + '╧' +
        repeatSymbols('═', MAX_EMAIL_LENGTH + 2) + '╛' + '\n';
    console.log(string);
}

function repeatSymbols(sym, count) {
    var string = '';
    for (var i = 0; i < count; i++) {
        string += sym;
    }
    return string;
}

function phoneToPrint(phone) {
    if (phone.length >= 11) {
        phone = '+' + phone;
    }
    phone = phone.replace(/^([+0-9]*)(\d{3})(\d{3})(\d)(\d{3})$/, '$1 ($2) $3-$4-$5');
    return phone;
}

module.exports = {
    add: add,
    find: find,
    printRecords: printRecords,
    remove: remove,
    importFromCsv: importFromCsv,
    showTable: showTable
};
