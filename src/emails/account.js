const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'katiecameronloyd@gmail.com',
        subject: 'Welcome to Task Manager!',
        text: `Hi, ${name}! Thanks for signing up for the task manager app. I hope you enjoy it!`
        // html:
    })
}

const sendCancelEmail = (email) => {
    sgMail.send({
        to: email,
        from: 'katiecameronloyd@gmail.com',
        subject: 'Task Manager account cancelled',
        text: `Sorry to see you go. Let us know what we could do better.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}