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
    // TODO: delete if
    if (parsedCode === undefined)
        return;
    switch(parsedCode.type){
    case 'Program': buildModel(parseBody(parsedCode.body)); break;
    case 'FunctionDeclaration': parseFunctionDeclaration(parsedCode); break;
    case 'BlockStatement': parseBody(parsedCode.body); break;
    default:
        //TODO: change
        model.push(Row('1','2','3','4','5'));
        break;
    // TODO: more cases
    }
}

function parseBody(body) {
    body.forEach((element) => buildModel(element));
}

function buildTable(model) {
    // TODO: implement
    let table = model;
    return table;
}

function parseParam(params) {
    params.forEach((param) => model.push(Row(param.loc.start.line, 'variable declaration', param.name, '', '')));
}