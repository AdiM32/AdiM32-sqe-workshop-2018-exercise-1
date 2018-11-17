import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {model, buildModel, clearModel} from '../src/js/Model';

describe('The module', () => {
    it('is parsing assignment expression statement correctly', () => {
        buildModel(parseCode('i=0;'));
        let json = [
            {
                'Line': 1,
                'Type': 'assignment expression',
                'Name': 'i',
                'Condition': '',
                'Value': '0'
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing for statement correctly', () => {
        buildModel(parseCode('for (let i=0; i<10; i++) {}'));
        let json = [
            {
                'Line': 1,
                'Type': 'for statement',
                'Name': '',
                'Condition': 'i = 0; i < 10; i++',
                'Value': ''
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing for statement with body correctly', () => {
        buildModel(parseCode('for (let i=0; i<10; i++) {\n sum = sum  + i\n}'));
        let json = [
            {
                'Line': 1,
                'Type': 'for statement',
                'Name': '',
                'Condition': 'i = 0; i < 10; i++',
                'Value': ''
            },
            {
                'Line': 2,
                'Type': 'assignment expression',
                'Name': 'sum',
                'Condition': '',
                'Value': 'sum + i'
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing if statement without else correctly', () => {
        buildModel(parseCode('if (i == 0) {};'));
        let json = [
            {
                'Line': 1,
                'Type': 'if statement',
                'Name': '',
                'Condition': 'i == 0',
                'Value': ''
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing assignment expression correctly', () => {
        buildModel(parseCode('x = 5+4;'));
        let json = [
            {
                'Line': 1,
                'Type': 'assignment expression',
                'Name': 'x',
                'Condition': '',
                'Value': '5 + 4'
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing if statement with else correctly', () => {
        buildModel(parseCode('if (i == 0) {} else {};'));
        let json = [
            {
                'Line': 1,
                'Type': 'if statement',
                'Name': '',
                'Condition': 'i == 0',
                'Value': ''
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing if statement with else if correctly', () => {
        buildModel(parseCode('if (i == 0) {} else if (i < k){};'));
        let json = [
            {
                'Line': 1,
                'Type': 'if statement',
                'Name': '',
                'Condition': 'i == 0',
                'Value': ''
            },
            {
                'Line': 1,
                'Type': 'else if statement',
                'Name': '',
                'Condition': 'i < k',
                'Value': ''
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing function declaration (with args), variable declaration and return statement correctly', () => {
        buildModel(parseCode('function foo(a){\n return a;\n}'));
        let json = [
            {
                'Line': 1,
                'Type': 'function declaration',
                'Name': 'foo',
                'Condition': '',
                'Value': ''
            },
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'a',
                'Condition': '',
                'Value': ''
            },
            {
                'Line': 2,
                'Type': 'return statement',
                'Name': '',
                'Condition': '',
                'Value': 'a'
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing function declaration (on args) correctly', () => {
        buildModel(parseCode('function foo(){}'));
        var json = [
            {
                'Line': 1,
                'Type': 'function declaration',
                'Name': 'foo',
                'Condition': '',
                'Value': ''
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing while statement correctly', () => {
        buildModel(parseCode('while (k<0){\ni++;\n}\n'));
        let json = [
            {
                'Line': 1,
                'Type': 'while statement',
                'Name': '',
                'Condition': 'k < 0',
                'Value': ''
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing variable declaration of few variables with init correctly', () => {
        buildModel(parseCode('let x=1, y=200+8;'));
        let json = [
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'x',
                'Condition': '',
                'Value': '1'
            },
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'y',
                'Condition': '',
                'Value': '(200 + 8)'
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing variable declaration with init correctly', () => {
        buildModel(parseCode('let x, y=V[m];'));
        let json = [
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'x',
                'Condition': '',
                'Value': 'null (or nothing)'
            },
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'y',
                'Condition': '',
                'Value': 'V[m]'
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });

    it('is parsing binarySearch correctly', () => {
        buildModel(parseCode('function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}'));
        let json = [
            {
                'Line': 1,
                'Type': 'function declaration',
                'Name': 'binarySearch',
                'Condition': '',
                'Value': ''
            },
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'X',
                'Condition': '',
                'Value': ''
            },
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'V',
                'Condition': '',
                'Value': ''
            },
            {
                'Line': 1,
                'Type': 'variable declaration',
                'Name': 'n',
                'Condition': '',
                'Value': ''
            },
            {
                'Line': 2,
                'Type': 'variable declaration',
                'Name': 'low',
                'Condition': '',
                'Value': 'null (or nothing)'
            },
            {
                'Line': 2,
                'Type': 'variable declaration',
                'Name': 'high',
                'Condition': '',
                'Value': 'null (or nothing)'
            },
            {
                'Line': 2,
                'Type': 'variable declaration',
                'Name': 'mid',
                'Condition': '',
                'Value': 'null (or nothing)'
            },
            {
                'Line': 3,
                'Type': 'assignment expression',
                'Name': 'low',
                'Condition': '',
                'Value': '0'
            },
            {
                'Line': 4,
                'Type': 'assignment expression',
                'Name': 'high',
                'Condition': '',
                'Value': 'n - 1'
            },
            {
                'Line': 5,
                'Type': 'while statement',
                'Name': '',
                'Condition': 'low <= high',
                'Value': ''
            },
            {
                'Line': 6,
                'Type': 'assignment expression',
                'Name': 'mid',
                'Condition': '',
                'Value': '(low + high) / 2'
            },
            {
                'Line': 7,
                'Type': 'if statement',
                'Name': '',
                'Condition': 'X < V[mid]',
                'Value': ''
            },
            {
                'Line': 8,
                'Type': 'assignment expression',
                'Name': 'high',
                'Condition': '',
                'Value': 'mid - 1'
            },
            {
                'Line': 9,
                'Type': 'else if statement',
                'Name': '',
                'Condition': 'X > V[mid]',
                'Value': ''
            },
            {
                'Line': 10,
                'Type': 'assignment expression',
                'Name': 'low',
                'Condition': '',
                'Value': 'mid + 1'
            },
            {
                'Line': 12,
                'Type': 'return statement',
                'Name': '',
                'Condition': '',
                'Value': 'mid'
            },
            {
                'Line': 14,
                'Type': 'return statement',
                'Name': '',
                'Condition': '',
                'Value': '-1'
            }
        ];
        assert.equal(
            JSON.stringify(model),
            JSON.stringify(json)
        );
        clearModel();
    });
});
