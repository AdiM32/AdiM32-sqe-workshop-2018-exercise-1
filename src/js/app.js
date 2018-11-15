import $ from 'jquery';
import {parseCode} from './code-analyzer';

let model = [];
const buildStruct = (...keys) => ((...values) => keys.reduce((obj, key, i) => {obj[key] = values[i]; return obj;} , {}));
const Row = buildStruct('Line', 'Type', 'Name', 'Condition', 'Value');


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        buildModel(parsedCode);
        createTable();
        $('#parsedCode').val(JSON.stringify(model, null, 2));
        model = [];
    });
});


function parseFunctionDeclaration(parsedCode) {
    model.push(Row(parsedCode.loc.start.line, 'function declaration', parsedCode.id.name, '', ''));
    parseParam(parsedCode.params);
    model.push(buildModel(parsedCode.body));
}

function buildModel(parsedCode) {
    switch(parsedCode.type){
    case 'Program': parseBody(parsedCode.body); break;
    case 'FunctionDeclaration': parseFunctionDeclaration(parsedCode); break;
    case 'BlockStatement': parseBody(parsedCode.body); break;
    case 'VariableDeclaration': parseVariableDeclaration(parsedCode.declarations); break;
    case 'ExpressionStatement': buildModel(parsedCode.expression); break;
    case 'AssignmentExpression':
        parseAssignmentExpression(parsedCode.left, parsedCode.right, parsedCode.loc.start.line); break;
    case 'WhileStatement': parseWhileStatement(parsedCode.test, parsedCode.body, parsedCode.loc.start.line); break;
    case 'IfStatement':
    case 'ElseIfStatement':
        parsedIfStatement(parsedCode.loc.start.line, parsedCode.type, parsedCode.test, parsedCode.consequent, parsedCode.alternate); break;
    case 'ReturnStatement': parsedReturnStatement(parsedCode.loc.start.line, parsedCode.argument); break;
    }
}

function parsedReturnStatement(line, argument) {
    model.push(Row(line, 'return statement', '', '', pareOneSide(argument)));
}

function parsedIfStatement(line, type, test, consequent, alternate) {
    model.push(Row(line, type[0] === 'E'? 'else if statement': 'if statement', '', parseBinaryExpression(test), ''));
    buildModel(consequent);
    if (alternate !== null)
        if(alternate.type === 'IfStatement') {
            alternate.type = 'ElseIfStatement';
            buildModel(alternate);
        }
}

function parseBinaryExpression(binaryExpression) {
    return pareOneSide(binaryExpression.left) + ' ' +
           binaryExpression.operator + ' ' +
           pareOneSide(binaryExpression.right);
}

function pareOneSide(side) {
    switch (side.type) {
    case 'Identifier': return side.name;
    case 'Literal': return side.raw;
    case 'BinaryExpression': return '(' + parseBinaryExpression(side) + ')';
    case 'MemberExpression': return side.object.name + '[' + pareOneSide(side.property) + ']';
    case 'UnaryExpression': return side.operator + pareOneSide(side.argument);
    }
}

function parseWhileStatement(test, body, line) {
    model.push(Row(line, 'while statement', '', parseBinaryExpression(test), ''));
    buildModel(body);
}

function parseAssignmentExpression(left, right, line) {
    model.push(Row(line, 'assignment expression', left.name, '', find_init(right)));
}

function find_init(init) {
    if (init.type === 'Literal')
        return init.raw;
    if (init.type === 'BinaryExpression')
        return parseBinaryExpression(init);
}

function parseVariableDeclaration(declarations) {
    declarations.forEach((element) => {
        model.push(Row(element.loc.start.line, 'variable declaration', element.id.name, '' ,
            element.init === null? 'null (or nothing)': pareOneSide(element.init)));
    });
}

function parseBody(body) {
    body.forEach((element) => buildModel(element));
}

function parseParam(params) {
    params.forEach((param) => model.push(Row(param.loc.start.line, 'variable declaration', param.name, '', '')));
}

function createTable() {
    let table = document.getElementById('my_table');
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
