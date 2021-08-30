const eth = 'https://api.cryptonator.com/api/ticker/eth-usd';
const bit = 'https://api.cryptonator.com/api/ticker/btc-usd';
const binan = 'https://api.cryptonator.com/api/ticker/bnb-usd';
const teth = 'https://api.cryptonator.com/api/ticker/usdt-usd';
const lite = 'https://api.cryptonator.com/api/ticker/ltc-usd';

//https://free.currconv.com/api/v7/convert?q=USD_PHP,PHP_USD&compact=ultra&apiKey=146574c991df2838756b'

const etherium = document.getElementsByClassName('cryptoValue')[0]
const etheriumChange = document.getElementsByClassName('change')[0]
function etheriumValue() {
    fetch(eth)
        .then(res => {
            return res.json()
        })
        .then((data) => {
            const crypto = data.ticker
            etherium.innerText = crypto.price
            etheriumChange.innerText = crypto.change
        })
}


const bitcoin = document.getElementsByClassName('cryptoValue')[1]
const bitcoinChange = document.getElementsByClassName('change')[1]
function bitcoinValue() {
    fetch(bit)
        .then(res => {
            return res.json()
        })
        .then((data) => {
            const crypto = data.ticker
            bitcoin.innerText = crypto.price
            bitcoinChange.innerText = crypto.change
        })
}


const binance = document.getElementsByClassName('cryptoValue')[2]
const binanceChange = document.getElementsByClassName('change')[2]
function binanceValue() {
    fetch(binan)
        .then(res => {
            return res.json()
        })
        .then((data) => {
            const crypto = data.ticker
            binance.innerText = crypto.price
            binanceChange.innerText = crypto.change
        })
}


const tether = document.getElementsByClassName('cryptoValue')[3]
const tetherChange = document.getElementsByClassName('change')[3]
function tetherValue() {
    fetch(teth)
        .then(res => {
            return res.json()
        })
        .then((data) => {
            const crypto = data.ticker
            tether.innerText = crypto.price
            tetherChange.innerText = crypto.change
        })
}



const litecoin = document.getElementsByClassName('cryptoValue')[4]
const litecoinChange = document.getElementsByClassName('change')[4]
function litecoinValue() {
    fetch(lite)
        .then(res => {
            return res.json()
        })
        .then((data) => {
            const crypto = data.ticker
            litecoin.innerText = crypto.price
            litecoinChange.innerText = crypto.change
        })
}

function fetchCrypto() {
    etheriumValue(), bitcoinValue(), binanceValue(), tetherValue(), litecoinValue();
}

const id = setInterval(fetchCrypto, 1000)

