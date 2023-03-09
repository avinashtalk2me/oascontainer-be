const nodemailer = require('nodemailer');

const getEmailConfiguration = (companyEmailConfigs) => {
    const configs = {
        name: companyEmailConfigs.EmailHost,
        host: companyEmailConfigs.EmailHost,
        port: companyEmailConfigs.EmailPort,
        auth: {
            user: companyEmailConfigs.EmailUser,
            pass: companyEmailConfigs.EmailPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    }

    return configs;
}

const mailOptions = (company, email, subject, html) => {

    // setup email data with unicode symbols
    let mailOptions = {
        from: company.EmailUser, // sender addresss
        to: `${email}`, // list of receivers
        subject, // Subject line
        // text: "Hello. This email is for your email verification.",
        html
    };

    return mailOptions;
}

const sendMail = async (company, email, subject, html) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            name: company.EmailHost,
            host: company.EmailHost,
            port: company.EmailPort,
            secure: company.EmailPort === 465 ? true : false, // true for 465, false for other ports
            auth: {
                user: company.EmailUser, // generated ethereal user
                pass: company.EmailPassword  // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: company.EmailUser, // sender addresss
            to: `${email}`, // list of receivers
            cc: company.EmailReceipent,
            subject, // Subject line
            // text: "Hello. This email is for your email verification.",
            html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            }
            else {
                resolve(true);
            }
        });

    })
}

module.exports = {
    sendEmailForPassword: async (email, password, company, subject) => {
        const html = `<div>
                <p>Do not respond to this email!</p>
                <p>Please store these credentials for your reference:</p>
                  <ul>
                    <li style="list-style-type:none;display: flex;">Company: &nbsp;  &nbsp; <span>${company.Name}</span></li>
                    <li style="list-style-type:none;display: flex;">User:  &nbsp;  &nbsp; <span style="margin-left: 28px;">${email}</span></li>
                    <li style="list-style-type:none;display: flex;">Password:  &nbsp;  &nbsp; <span>%${password}%</span></li>
                  </ul>
                <p>Thank you!</p>
                <p>${company.EmailFromSignature}</p>
                <br/>
                <a href="mailto:${company.EmailFromAddress}">${company.EmailFromAddress}</a>
        </div>`

        let resp = await sendMail(company, email, subject, html);
        return resp;
    },

    sendEmailForShipmentScanned: async (item, company) => {
        const html = `<div>
                        <p> Shipment number <b>${item.HwbNo}</b> delivered.</p>
                        <p> Total Packages Delivered: <b>${item.PackageCount}</b> </p>
                        <p> Date: <b>${item.DeliveryDate}</b> </p>
                        <p> Time: <b>${item.DisplayTime}</b> </p>                            
                        <div> Thank you for your business. Please contact <b>${company.Name}</b> with any questions or concerns.<div>
                  </div>`

        let resp = await sendMail(company, item.ShipperEmail, `Shipment number ${item.HwbNo} has been delivered`, html)
        return resp;

    }
}