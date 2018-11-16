import $ from 'jquery';
import {parseCode} from './code-analyzer';

let model = [];
const buildStruct = (...keys) => ((...values) => keys.reduce((obj, key, i) => {obj[key] = values[i]; return obj;} , {}));
const Row = buildStruct('Line', 'Type', 'Name', 'Condition', 'Value');
const type_func = {'Program': (pc) => parseBody(pc.body),
    'FunctionDeclaration': (pc) => parseFunctionDeclaration(pc.loc.start.line, pc.params, pc.id.name, pc.body),
    'BlockStatement': (pc) => parseBody(pc.body),
    'VariableDeclaration': (pc) => parseVariableDeclaration(pc.declarations),
    'ExpressionStatement': (pc) => buildModel(pc.expression),
    'AssignmentExpression': (pc) => parseAssignmentExpression(pc.left, pc.right, pc.loc.start.line),
    'WhileStatement': (pc) => parseWhileStatement(pc.test, pc.body, pc.loc.start.line),
    'IfStatement': (pc) => parsedIfStatement(pc.loc.start.line, pc.type, pc.test, pc.consequent, pc.alternate),
    'ElseIfStatement': (pc) => parsedIfStatement(pc.loc.start.line, pc.type, pc.test, pc.consequent, pc.alternate),
    'ReturnStatement': (pc) => parsedReturnStatement(pc.loc.start.line, pc.argument)};

const sideType_func = {'Identifier': (s) => {return s.name;},
    'Literal': (s) => {return s.raw;},
    'BinaryExpression': (s) => {return'(' + parseBinaryExpression(s) + ')';},
    'MemberExpression': (s) => {return s.object.name + '[' + pareOneSide(s.property) + ']';},
    'UnaryExpression': (s) =>  {return s.operator + pareOneSide(s.argument);}};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearModel();
        clearTbale();
        buildModel(parsedCode);
        buildTable();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function buildModel(parsedCode) {
    type_func[parsedCode.type](parsedCode);
}

function parseFunctionDeclaration(line, params, name, body) {
    model.push(Row(line, 'function declaration', name, '', ''));
    parseParam(params);
    buildModel(body);
}

function parsedReturnStatement(line, argument) {
    model.push(Row(line, 'return statement', '', '', pareOneSide(argument)));
}

function parsedIfStatement(line, type, test, consequent, alternate) {
    model.push(Row(line, type[0] === 'E'? 'else if statement': 'if statement', '', parseBinaryExpression(test), ''));
    buildModel(consequent);
    if (alternate !== null) {
        if (alternate.type === 'IfStatement') {
            alternate.type = 'ElseIfStatement';
        }
        buildModel(alternate);
    }
}

function parseBinaryExpression(binaryExpression) {
    return pareOneSide(binaryExpression.left) + ' ' +
           binaryExpression.operator + ' ' +
           pareOneSide(binaryExpression.right);
}

function pareOneSide(side) {
    return sideType_func[side.type](side);
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

function clearTbale() {
    // TODO: fix this is not working
    let table = document.getElementById('view_table');
    // table.clean();
    table.innerHTML = '';
}

function clearModel() {
    model = [];
}