import $ from 'jquery';
import {parseCode} from './code-analyzer';

let model = [];

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        buildModel(parsedCode);
        let table = buildTable(model);
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
    /* TODO: delete if */ if (parsedCode === undefined) return;
    switch(parsedCode.type){
    case 'Program': parseBody(parsedCode.body); break;
    case 'FunctionDeclaration': parseFunctionDeclaration(parsedCode); break;
    case 'BlockStatement': parseBody(parsedCode.body); break;
    case 'VariableDeclaration': parseVariableDeclaration(parsedCode.declarations); break;
    case 'ExpressionStatement': buildModel(parsedCode.expression); break;
    case 'AssignmentExpression':
        parseAssignmentExpression(parsedCode.left, parsedCode.right, parsedCode.loc.start.line); break;
    case 'WhileStatement': parseWhileStatement(parsedCode.test, parsedCode.body, parsedCode.loc.start.line); break;
    default: /*console.log(parsedCode.type);*/ model.push(Row('1','2','3','4','5'));break;
    }
}

function parseWhileStatement(test, body, line) {
    model.push(Row(line, 'while statement', '', test.left.name + test.operator + test.right.name, ''));
    buildModel(body);
}

function parseAssignmentExpression(left, right, line) {
    model.push(Row(line, 'assignment expression', left.name, '', find_init(right)));
}

function find_init(init) {
    if (init.type === 'Literal')
        return init.raw;
    if (init.type === 'BinaryExpression')
        // TODO: parse BinaryExpression
        return init.left.name + init.operator + init.right.raw;
}

function parseVariableDeclaration(declarations) {
    declarations.forEach((element) => {
        model.push(Row(element.loc.start.line, 'variable declaration', element.id.name, '' ,
            element.init === null? 'null (or nothing)': element.init));
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