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
            // cc: company.EmailReceipent,
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
                        <p>Confirmacion de Entrega</p>
                        <p> Embarque <b>${item.ShipperName}</b>, su embarque número <b>${item.HwbNo}</b>. a <b>${item.DestinationCountry.trim()}</b>, fue entregado hoy.</p>
                        <p> Numero de paquetes: <b>${item.PackageCount}</b></p>
                        <p> Fecha de entrega: <b>${item.DeliveryDate}</b></p>
                        <p> Hora: <b>${item.DisplayTime}</b></p>                            
                        <div>Gracias por su patrocinio. Cualquier pregunta o inquietud comuniquese directamente con nosotros al <b>${company.Phone.replace("-",".")}</b><div>
                        <br/>
                        <p>POR FAVOR NO RESPONDA A ESTE NOTIFICACION.</p>
                        <br/>
                        <p><b>${company.Name}</b></p>
                        <br/>
                        *No responda*                        
                  </div>`

        let resp = await sendMail(company, item.ShipperEmail, `Embarque número ${item.HwbNo} fue entregado`, html)
        return resp;

    }
}