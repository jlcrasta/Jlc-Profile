
const date = document.getElementById('dayMonthYear')
const time = document.getElementById('timeOfToday')
const day = document.getElementById('todayDay')

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
const today = new Date()
let dayNo = today.getDay();
let d = Number(dayNo - 1)

date.innerText = `${today.getDate()}:${today.getMonth() + 1}:${today.getFullYear()}`//to change date

for (i = 0; i <= d; i++) {//to change day
    day.innerText = days[i]
}

setInterval(() => {//to change time
    const now = new Date()
    time.innerText = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}, 500);









