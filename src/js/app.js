import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearModel, buildModel, model} from './Model';
import {clearTable, buildTable} from './View';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearModel();
        clearTable();
        buildModel(parsedCode);
        buildTable();
        $('#parsedCode').val(JSON.stringify(model, null, 2));
    });
});