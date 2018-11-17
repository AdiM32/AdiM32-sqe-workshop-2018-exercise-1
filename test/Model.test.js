import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {model, buildModel, clearModel} from '../src/js/Model';

function test_Struct(test, result){
    buildModel(parseCode(test));
    assert.equal(JSON.stringify(model), JSON.stringify(result));
    clearModel();
}
describe('loop statement', () =>{
    it('should parse for statement correctly', () => {
        test_Struct('for (let i=0; i<10; i++) {}',
            [{'Line': 1, 'Type': 'for statement', 'Name': '', 'Condition': 'i = 0; i < 10; i++', 'Value': ''}]);
    });

    it('should parse for statement with body correctly', () => {
        test_Struct('for (let i=0; i<10; i++) {\n sum = sum  + i\n}',
            [{'Line': 1, 'Type': 'for statement', 'Name': '', 'Condition': 'i = 0; i < 10; i++', 'Value': ''},
                {'Line': 2, 'Type': 'assignment expression', 'Name': 'sum', 'Condition': '', 'Value': 'sum + i'}]);
    });

    it('should parse while statement correctly', () => {
        test_Struct('while (k<0){\ni++;\n}\n',
            [{'Line': 1, 'Type': 'while statement', 'Name': '', 'Condition': 'k < 0', 'Value': ''}]);
    });
});

describe('if statement', () =>{
    it('should parse if statement without else correctly', () => {
        test_Struct('if (i == 0) {};',
            [{'Line': 1, 'Type': 'if statement', 'Name': '', 'Condition': 'i == 0', 'Value': ''}]);
    });

    it('should parse if statement with else correctly', () => {
        test_Struct('if (i == 0) {} else {};',
            [{'Line': 1, 'Type': 'if statement', 'Name': '', 'Condition': 'i == 0', 'Value': ''}]);
    });

    it('should parse if statement with else if correctly', () => {
        test_Struct('if (i == 0) {} else if (i < k){};',
            [{'Line': 1, 'Type': 'if statement', 'Name': '', 'Condition': 'i == 0', 'Value': ''},
                {'Line': 1, 'Type': 'else if statement', 'Name': '', 'Condition': 'i < k', 'Value': ''}]);
    });
});

describe('assignment expression', () =>{
    it('should parse assignment expression statement correctly', () => {
        test_Struct('i=0;', [{'Line': 1, 'Type': 'assignment expression', 'Name': 'i', 'Condition': '', 'Value': '0'}]);
    });

    it('should parse assignment expression correctly', () => {
        test_Struct('x = 5+4;',
            [{'Line': 1, 'Type': 'assignment expression', 'Name': 'x', 'Condition': '', 'Value': '5 + 4'}]);
    });
});

describe('function declaration', () =>{
    it('should parse function declaration (with args), variable declaration and return statement correctly', () => {
        test_Struct('function foo(a){\n return a;\n}',
            [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': ''},
                {'Line': 1, 'Type': 'variable declaration', 'Name': 'a', 'Condition': '', 'Value': ''},
                {'Line': 2, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'a'}]);
    });

    it('should parse function declaration (on args) correctly', () => {
        test_Struct('function foo(){}',
            [{'Line': 1, 'Type': 'function declaration', 'Name': 'foo', 'Condition': '', 'Value': ''}]);
    });
});

describe('variable declaration ', () =>{
    it('should parse variable declaration of few variables with init correctly', () => {
        test_Struct('let x=1, y=200+8;',
            [{'Line': 1, 'Type': 'variable declaration', 'Name': 'x', 'Condition': '', 'Value': '1'},
                {'Line': 1, 'Type': 'variable declaration', 'Name': 'y', 'Condition': '', 'Value': '(200 + 8)'}]);
    });

    it('should parse variable declaration with init correctly', () => {
        test_Struct('let x, y=V[m];',
            [{'Line': 1, 'Type': 'variable declaration', 'Name': 'x', 'Condition': '', 'Value': 'null (or nothing)'},
                {'Line': 1, 'Type': 'variable declaration', 'Name': 'y', 'Condition': '', 'Value': 'V[m]'}]);
    });
});

describe('binarySearch function ', () => {
    it('should parse binarySearch function correctly', () => {
        test_Struct('function binarySearch(X, V, n){\nlet low, high, mid;\nlow = 0;\nhigh = n - 1;\n' +
            'while (low <= high) {\nmid = (low + high)/2;\nif (X < V[mid])\nhigh = mid - 1;\nelse if (X > V[mid])\n' +
            'low = mid + 1;\nelse\nreturn mid;\n}\nreturn -1;\n}',
        [{'Line': 1, 'Type': 'function declaration', 'Name': 'binarySearch', 'Condition': '', 'Value': ''}, {'Line': 1, 'Type': 'variable declaration', 'Name': 'X', 'Condition': '', 'Value': ''},
            {'Line': 1, 'Type': 'variable declaration', 'Name': 'V', 'Condition': '', 'Value': ''}, {'Line': 1, 'Type': 'variable declaration', 'Name': 'n', 'Condition': '', 'Value': ''},
            {'Line': 2, 'Type': 'variable declaration', 'Name': 'low', 'Condition': '', 'Value': 'null (or nothing)'}, {'Line': 2, 'Type': 'variable declaration', 'Name': 'high', 'Condition': '', 'Value': 'null (or nothing)'},
            {'Line': 2, 'Type': 'variable declaration', 'Name': 'mid', 'Condition': '', 'Value': 'null (or nothing)'},
            {'Line': 3, 'Type': 'assignment expression', 'Name': 'low', 'Condition': '', 'Value': '0'},
            {'Line': 4, 'Type': 'assignment expression', 'Name': 'high', 'Condition': '', 'Value': 'n - 1'},
            {'Line': 5, 'Type': 'while statement', 'Name': '', 'Condition': 'low <= high', 'Value': ''},
            {'Line': 6, 'Type': 'assignment expression', 'Name': 'mid', 'Condition': '', 'Value': '(low + high) / 2'},
            {'Line': 7, 'Type': 'if statement', 'Name': '', 'Condition': 'X < V[mid]', 'Value': ''},
            {'Line': 8, 'Type': 'assignment expression', 'Name': 'high', 'Condition': '', 'Value': 'mid - 1'},
            {'Line': 9, 'Type': 'else if statement', 'Name': '', 'Condition': 'X > V[mid]', 'Value': ''},
            {'Line': 10, 'Type': 'assignment expression', 'Name': 'low', 'Condition': '', 'Value': 'mid + 1'},
            {'Line': 12, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': 'mid'},
            {'Line': 14, 'Type': 'return statement', 'Name': '', 'Condition': '', 'Value': '-1'}]);});
});
