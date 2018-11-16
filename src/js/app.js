import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearModel, buildModel} from './Model';
import {clearTable, buildTable} from './View';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearModel();
        clearTable();
        buildModel(parsedCode);
        buildTable();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});