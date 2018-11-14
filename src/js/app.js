import $ from 'jquery';
import {parseCode} from './code-analyzer';

let model = [];

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        buildModel(parsedCode);
        let table = buildTable(model);
        createTable([['row 1, cell 1', 'row 1, cell 2'], ['row 2, cell 1', 'row 2, cell 2']]);
        model = [];
        $('#parsedCode').val(JSON.stringify(table, null, 2));
    });
});

const buildStruct = (...keys) => ((...values) => keys.reduce((obj, key, i) => {obj[key] = values[i]; return obj;} , {}));
const Row = buildStruct('Line', 'Type', 'Name', 'Condition', 'Value');

function parseFunctionDeclaration(parsedCode) {
    model.push(Row(parsedCode.loc.start.line, 'function declaration', parsedCode.id.name, '', ''));
    parseParam(parsedCode.params);
    model.push(buildModel(parsedCode.body));
}

function buildModel(parsedCode) {
    /* TODO: delete if  if (parsedCode === undefined) return;*/
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
    default: console.log(parsedCode.type); model.push(Row('1','2','3','4','5'));break;
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

function buildTable(model) {
    // TODO: implement
    let table = model;
    return table;
}

function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.body.appendChild(table);
}
