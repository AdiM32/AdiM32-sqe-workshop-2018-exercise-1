import {model} from './Model';

function buildTable() {
    let table = document.getElementById('view_table');
    createTableHead(table);
    createTableBody(table);
    document.body.appendChild(table);
}

function createTableHead(table) {
    let tableHead = document.createElement('thead');
    let tr = document.createElement('tr');
    let headlines = ['Line', 'Type', 'Name', 'Condition', 'Value'];
    headlines.forEach((element) => {
        let th = document.createElement('th');
        th.innerHTML = element;
        tr.appendChild(th);});
    tableHead.appendChild(tr);
    table.appendChild(tableHead);
}

function createTableBody(table) {
    let tableBody = document.createElement('tbody');
    model.forEach((model_row) => cerateRow(model_row, tableBody));
    table.appendChild(tableBody);
}

function cerateRow(model_row, tableBody) {
    let row = document.createElement('tr');
    createCell(model_row.Line, row);
    createCell(model_row.Type, row);
    createCell(model_row.Name, row);
    createCell(model_row.Condition, row);
    createCell(model_row.Value, row);
    tableBody.appendChild(row);
}

function createCell(cell_date, row) {
    let cell = document.createElement('td');
    cell.appendChild(document.createTextNode(cell_date));
    row.appendChild(cell);
}

function clearTable() {
    let table = document.getElementById('view_table');
    // table.clean();
    table.innerHTML = '';
}

export {buildTable, clearTable};