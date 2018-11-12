import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let model = buildModel(parsedCode);
        let table = buildTable(model);
        table;
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

const buildStruct = (...keys) => ((...values) => keys.reduce((obj, key, i) => {obj[key] = values[i]; return obj;} , {}));
const Row = buildStruct('Line', 'Type', 'Name', 'Condition', 'Value');

function buildModel(parsedCode) {
    var model = [];
    switch(parsedCode.type){
    case 'Program':
        model = buildModel(parseBody(parsedCode));
        break;
    case 'FunctionDeclaration':
        model.push(parseParam(parsedCode.params));
        model.push(parseBody(parsedCode.body));
        model.push(Row(parsedCode.loc.line, 'FunctionDeclaration', parsedCode.id.name, '', ''));
        break;
    // TODO: more cases
    }
    return model;
}

function parseBody(body) {
    return body.reduce((acc, cur) => acc.concat(buildModel(cur)), []);
}

function buildTable(model) {
    // TODO: implement
    var table = model;
    return table;
}

function parseParam(params) {
    // TODO: implement
    return [params];
}