const nodemailer = require('nodemailer');


module.exports = {
    sendEmail: (email, password, company, subject) => {
        const html = `<div>
                <p>Do not respond to this email!</p>
                <p>Please store these credentials for your reference:</p>
                  <ul>
                    <li style="list-style-type:none;display: flex;">Company: &nbsp;  &nbsp; <span>${company}</span></li>
                    <li style="list-style-type:none;display: flex;">User:  &nbsp;  &nbsp; <span style="margin-left: 28px;">${email}</span></li>
                    <li style="list-style-type:none;display: flex;">Password:  &nbsp;  &nbsp; <span>%${password}%</span></li>
                  </ul>
                <p>Thank you!</p>
                <p>OAS Support</p>
                <br/>
                <a href="mailto:support@oasfreight.com">support@oasfreight.com</a>
        </div>`
        let transporter = nodemailer.createTransport({
            name: process.env.EMAIL_HOST,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_PASSWORD  // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: process.env.EMAIL_USER, // sender addresss
            to: `${email}`, // list of receivers
            subject, // Subject line
            // text: "Hello. This email is for your email verification.",
            html
        };

        // send mail with defined transport object
        const mailPromise = new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info)
                }
                // console.log('Message sent: %s', info.messageId);
                // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // res.render('contact', { msg: 'Email has been sent' });

            });
        })
        return mailPromise;
    }

}