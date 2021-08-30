
document.getElementById('calForm').addEventListener('submit', output)

function output(e) {
    const num1 = document.getElementById('1stNum')
    const num2 = document.getElementById('2ndNum')
    const opera = document.getElementById('oper')
    let a = Number(num1.value);
    let b = Number(num2.value);
    let oper = opera.value;
    let ans = 0;

    if (oper == 'add') {
        ans = a + b;
    }
    else if (oper == 'sub') {
        ans = a - b
    }
    else if (oper == 'multi') {
        ans = a * b
    }
    else if (oper == 'divi') {
        ans = a / b
    }
    else if (oper == 'modu') {
        ans = a % b;
    }
    else {
        alert('Invalid Operation')

    }
    const display = document.getElementById('answer');
    display.value = ans
    e.preventDefault();
}
