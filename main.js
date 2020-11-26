/*                    초기화 값                    */

// result, again을 제외한 변수의 값은 문자열이다.

let screen = '0';

let numbers = [];
let signs = [];

let result = null;

let again = false;


/*                    화면 출력                    */


// 수식 작성(memory 화면 값)
function GetFormula() {
    let formula = [];
    const dict = {
        '+': '+',
        '-': '-',
        '*': '&times;',
        '/': '&divide;',
        '=': '='
    }
    for (let i = 0; i < numbers.length; i++) {
        formula.push(numbers[i]);
        formula.push(dict[signs[i]]);
    }
    str = formula.join(' ');
    return $('<textarea />').html(str).text();
}

// 화면에 숫자 출력
function PrintOut(screen_is_result = true) {
    if (screen_is_result == false) {
        document.getElementById('screen').innerHTML = screen;
        document.getElementById('formula').innerHTML = GetFormula();
    } else {
        document.getElementById('screen').innerHTML = result;
        document.getElementById('formula').innerHTML = GetFormula();
    }
}


/*                    수식 입력                    */

// 숫자 입력(0~9)
function PrintNumber(value) {
    if (again == true) {
        numbers.pop();
        screen = value;
    } else if (screen == '0') {
        screen = value;
    } else {
        screen += value;
    }
    PrintOut(false);
    AgainOrNot(false);
}

// 숫자 부호 바꾸기(+/-)
function Plusminus() {
    screen = document.getElementById('screen').innerHTML;
    if (screen == '0') {
        screen = '0';
    } else if (screen.includes('-') == false) {
        screen = '-'.concat(screen);
    } else {
        screen = screen.replace('-', '');
    }
    PrintOut(false);
}

// 소수점 입력(.)
function Point() {
    screen = document.getElementById('screen').innerHTML;
    if (screen == '0') {
        screen = '0.';
    } else if (screen.includes('.') == false) {
        screen += '.';
    }
    PrintOut(false);
}

// 현재 값 지우기(CE)
function CleanEntry() {
    screen = '0';
    result = 0;
    PrintOut(false);
    AgainOrNot(false);
}

// 메모리까지 전체 지우기(C)
function Clear() {
    numbers = [];
    signs = [];
    CleanEntry();
}

// 한 글자 지우기(Delete)
function Del() {
    screen = document.getElementById('screen').innerHTML
    if (screen.length <= 1) {
        screen = '0';
    } else if (screen.length == 2 && screen[0] == '-') {
        screen = '0';
    } else {
        screen = screen.substr(0, screen.length - 1);
    }
    PrintOut(false);
    AgainOrNot(false);
}


/*                    특수 계산                    */

// 특수 계산 중복 처리
function AgainOrNot(_again) {
    again = _again;
}

// 퍼센트(%)
function Percent() {
    if (numbers.length > 0 && again == false) {
        let n = Number(screen);
        screen = String(numbers[0] * (n * 0.01));
        numbers.push(screen);
    } else if (numbers.length > 0 && again == true) {
        let n = Number(numbers[numbers.length - 1]);
        numbers[numbers.length - 1] = String(n * 0.01);
        screen = numbers[numbers.length - 1];
    } else {
        screen = '0';
    }
    PrintOut(false);
    AgainOrNot(true);
}

// 분수로 변환(1/x)
function Fraction() {
    if (again == false) {
        let n = Number(screen);
        screen = String(1 / n);
        numbers.push(screen);
    } else {
        let n = Number(numbers[numbers.length - 1]);
        numbers[numbers.length - 1] = String(1 / n);
        screen = numbers[numbers.length - 1];
    }
    PrintOut(false);
    AgainOrNot(true);
}

// 제곱(x * x)
function Square() {
    if (again == false) {
        let n = Number(screen);
        screen = String(n * n);
        numbers.push(screen);
    } else {
        let n = Number(numbers[numbers.length - 1]);
        numbers[numbers.length - 1] = String(n * n);
        screen = numbers[numbers.length - 1];
    }
    PrintOut(false);
    AgainOrNot(true);
}

// 제곱근(root x)
function SquareRoot() {
    function Root(n) {
        if (n < 0) {
            s = (Math.sqrt(n * -1) * -1);
        } else {
            s = Math.sqrt(n);
        }
        return s;
    }

    if (again == false) {
        let n = Number(screen);
        screen = String(Root(n));
        numbers.push(screen);
    } else {
        let n = Number(numbers[numbers.length - 1]);
        numbers[numbers.length - 1] = String(Root(n));
        screen = numbers[numbers.length - 1];
    }
    PrintOut(false);
    AgainOrNot(true);
}


/*                    사칙 연산                    */

function ArithmeticCalc() {
    if (numbers.length == 1) {
        result = Number(numbers[0]);
    } else {
        switch (signs[signs.length - 2]) {
            case ('+'):
                result = result + Number(numbers[numbers.length - 1]);
                break
            case ('-'):
                result = result - Number(numbers[numbers.length - 1]);
                break
            case ('*'):
                result = result * Number(numbers[numbers.length - 1]);
                break
            case ('/'):
                result = result / Number(numbers[numbers.length - 1]);
        }
    }
    return result;
}


function Arithmetic(sign) {
    if (screen && again == false) {
        signs.push(sign);
        numbers.push(screen);
        screen = '0';
    } else if (screen && again == true) {
        signs.push(sign);
        screen = '0';
    }
    result = ArithmeticCalc();
    PrintOut(true);
    AgainOrNot(false);
}

function Equals(sign) {
    if (screen != null && again == false) {
        signs.push(sign);
        numbers.push(screen);
        result = ArithmeticCalc();
        screen = result;
    } else if (screen != null && again == true) {
        signs.push(sign);
        result = ArithmeticCalc();
        screen = result;
    }
    PrintOut(false);
    AgainOrNot(false);
    CreateHistory();

    result = 0;
    numbers = [];
    signs = [];
}


/*              history, memory 화면             */
function CreateHistory() {
    let mbox = document.getElementsByClassName("memorybox")
    let button = document.createElement("button");
    button.innerHTML = GetFormula() + " " + result;
    mbox[0].appendChild(button);
}

function Remove() {
    let mbox = document.getElementsByClassName("memorybox");
    let l = mbox[0].children.length;
    for (i=0; i<=l; i++) {
        mbox[0].removeChild(mbox[0].firstChild);
    }
}