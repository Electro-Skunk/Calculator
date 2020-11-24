/*                    초기화 값                    */

// result, again을 제외한 변수의 값은 문자열이다.

let screen = '0';

let numbers = [];
let signs = [];
let result = null;

let PercentAgain = false
let FractionAgain = false

/*                    수식 입력                    */

// 숫자 입력(0~9)
function PrintNumber(value) {
    if (screen == '0') {
        screen = value;
    } else {
        screen += value;
    }
    PrintOut(false, false, false)
}

// 숫자 부호 바꾸기(+/-)
function plusminus() {
    if (screen == '0') {
        screen = '0'
    } else if (screen.includes('-') == false) {
        screen = '-'.concat(screen)
    } else {
        screen = screen.replace('-', '')
    }
    PrintOut(false, false, false)
}

// 소수점 입력(.)
function point() {
    if (screen == '0') {
        screen = '0.';
    } else if (screen.includes('.') == false) {
        screen += '.';
    }
    PrintOut(false, false, false)
}

// 현재 값 지우기(CE)
function CleanEntry() {
    screen = '0';
    result = 0;
    PrintOut(false, false, false)
}

// 메모리까지 전체 지우기(C)
function Clear() {
    numbers = [];
    signs = [];
    CleanEntry();
}

// 한 글자 지우기(Delete)
function Del() {
    PercentAgain = false
    if (screen.length <= 1) {
        screen = '0';
    } else {
        screen = screen.substr(0, screen.length - 1);
    }
    PrintOut(false, false, false)
}


/*                    화면 출력                    */


// 수식 작성(memory 화면 값)
function GetFormula() {
    let memory = [];
    const dict = {'+': '+', '-': '-', '*': '&times;', '/': '&divide;', '=': '='}
    for (let i = 0; i < numbers.length; i++) {
        memory.push(numbers[i]);
        memory.push(dict[signs[i]]);
    }
    str = memory.join(' ')
    return $('<textarea />').html(str).text();
}

// 화면에 숫자 출력, percent와 fraction 중복 처리
function PrintOut(screen_is_result = true, percnt_again = false, fraction_again = false) {
    if (screen_is_result == false) {
        document.getElementById('screen').innerHTML = screen;
        document.getElementById('memory').innerHTML = GetFormula();
    } else {
        document.getElementById('screen').innerHTML = result;
        document.getElementById('memory').innerHTML = GetFormula();
    }
    if (percnt_again == false) {
        PercentAgain = false
    } else {
        PercentAgain = true
    }
    if (fraction_again == false) {
        FractionAgain = false
    } else {
        FractionAgain = true
    }
}


/*                    특수 계산                    */

// 퍼센트(%)
function Percent() {
    if (numbers.length > 0 && PercentAgain == false) {
        screen = String(numbers[0] * (Number(screen) * 0.01));
        numbers.push(screen)
    } else if (PercentAgain == true) {
        numbers[numbers.length - 1] = Number(numbers[numbers.length - 1]) * 0.01
        screen = numbers[numbers.length - 1]
    }
    PrintOut(false, true, false)
}

// 분수 변환(1/x)
function Fraction() {
    if (FractionAgain == false) {
        screen = String(numbers[numbers.length-1] * (Number(screen) * 0.01));
        numbers.push(screen)
    } else if (FractionAgain == true) {
        numbers[numbers.length - 1] = Number(numbers[numbers.length - 1]) * 0.01
        screen = numbers[numbers.length - 1]
    }
    PrintOut(false, false, true)
}


/*                    사칙 연산                    */

function ArithmeticCalc() {
    if (numbers.length == 1) {
        result = Number(numbers[0]);
    } else {
        switch (signs[signs.length - 2]) {
            case ('+'):
                result = result + Number(numbers[1]);
                break
            case ('-'):
                result = result - Number(numbers[1]);
                break
            case ('*'):
                result = result * Number(numbers[1]);
                break
            case ('/'):
                result = result / Number(numbers[1]);
        }
    }
    return result
}


function Arithmetic(sign) {
    console.log(sign)
    if (screen) {
        signs.push(sign)
        numbers.push(screen)
        screen = '0';
    }
    result = ArithmeticCalc();
    PrintOut(true, false)
}

function Equals(sign) {
    if (screen != null) {
        signs.push(sign)
        numbers.push(screen)
        result = ArithmeticCalc();
        screen = result;
    }
    PrintOut(false, false)

    result = 0;
    numbers = [];
    signs = [];
}