
const submitQuery = document.getElementById('submitQuery')


submitQuery.addEventListener('submit', getMessage)

function getMessage(e) {
    const userName = document.getElementById('userName')
    const userEmail = document.getElementById('userEmail')
    const userMessage = document.getElementById('userMessage')

    sendEmail(userName.value, userEmail.value, userMessage.value)
    e.preventDefault();
}

function sendEmail(name, email, message) {

    Email.send({
        SecureToken: "95781ab0-84d8-4a11-a63c-26b8c977cb1d",

        To: email,
        
        From: 'jlcrasta@protonmail.com',

        Subject: `Here is a Message from ${name}`,
        Body: `The Message is sent by ${email} and is as follows </br> ${message}`
    }).then(
        message => alert(message))
}

