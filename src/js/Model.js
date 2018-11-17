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
    'ReturnStatement': (pc) => parsedReturnStatement(pc.loc.start.line, pc.argument),
    'ForStatement': (pc) => parseForStatement(pc.loc.start.line, pc.body, pc.init, pc.test, pc.update)};

const sideType_func = {'Identifier': (s) => {return s.name;},
    'Literal': (s) => {return s.raw;},
    'BinaryExpression': (s) => {return '(' + parseBinaryExpression(s) + ')';},
    'MemberExpression': (s) => {return s.object.name + '[' + pareOneSide(s.property) + ']';},
    'UnaryExpression': (s) =>  {return s.operator + pareOneSide(s.argument);},
    'UpdateExpression': (s) => {return s.argument.name + s.operator;}};

function buildModel(parsedCode) {
    if (parsedCode.type in type_func){
        type_func[parsedCode.type](parsedCode);
    }
}

function parseBody(body) {
    body.forEach((element) => buildModel(element));
}

function parseFunctionDeclaration(line, params, name, body) {
    model.push(Row(line, 'function declaration', name, '', ''));
    parseParam(params);
    buildModel(body);
}

function parseParam(params) {
    params.forEach((param) => model.push(Row(param.loc.start.line, 'variable declaration', param.name, '', '')));
}

function parseVariableDeclaration(declarations) {
    declarations.forEach((element) => {
        model.push(Row(element.loc.start.line, 'variable declaration', element.id.name, '' ,
            element.init === null? 'null (or nothing)': pareOneSide(element.init)));
    });
}

function pareOneSide(side) {
    return sideType_func[side.type](side);
}

function parseBinaryExpression(binaryExpression) {
    return pareOneSide(binaryExpression.left) + ' ' +
        binaryExpression.operator + ' ' +
        pareOneSide(binaryExpression.right);
}

function parseWhileStatement(test, body, line) {
    model.push(Row(line, 'while statement', '', parseBinaryExpression(test), ''));
    buildModel(body);
}

function parseAssignmentExpression(left, right, line) {
    model.push(Row(line, 'assignment expression', left.name, '', find_init(right)));
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

function parsedReturnStatement(line, argument) {
    model.push(Row(line, 'return statement', '', '', pareOneSide(argument)));
}

function find_init(init) {
    if (init.type === 'Literal')
        return init.raw;
    return parseBinaryExpression(init);
}

function parseForStatement(line, body, init, test, update) {
    let Condition = init.declarations[0].id.name + ' = ' + pareOneSide(init.declarations[0].init) + '; ' +
        parseBinaryExpression(test) + '; ' + pareOneSide(update);
    model.push(Row(line, 'for statement', '', Condition, ''));
    buildModel(body);
}
function clearModel() {
    model = [];
}

export {buildModel, clearModel, model};