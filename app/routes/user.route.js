const userController = require('../controllers/user.controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailServ = require('../utils/email');

module.exports = {
    registerUser: async (req, res) => {
        const { email, firstName, lastName, password, companyName, deliveryAccess, sailingAccess } = { ...req.body }
        try {
            const emailCount = await userController.dbControllerCheckDuplicateEmail(email);
            if (emailCount === 0) {

                const companyCount = await userController.dbControllerIsValidCompany(companyName);

                if (companyCount) {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const user = {
                        email, firstName, lastName, password: hashedPassword, companyName, deliveryAccess, sailingAccess
                    }

                    userController.dbControllerRegisterUser(user)
                        .then(result => {
                            if (result === -1) {
                                res.status(400).json({ status: -1, message: 'Unable to process request.' });
                            } else {
                                res.status(201).json({ status: 0, message: 'User registered successfully.' });
                                emailServ.sendEmail(email, password, companyName, "OAS Container Manifest Registratin Successful!")
                            }
                        })
                        .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
                } else {
                    res.status(400).send({ status: -1, message: 'Company is not valid. Please enter valid company' });
                }

            } else {
                res.status(400).send({ status: -1, message: 'Email already in use. Please enter unique email' });
            }
        } catch (err) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' });
        }
    },

    validateUser: async (req, res) => {
        try {
            const { userId, password, roles } = await userController.dbControllerValidateEmail(req.body.email);
            if (password) {
                if (await bcrypt.compare(req.body.password, password)) {
                    const access_token = jwt.sign(
                        { userId: userId, date: new Date() },
                        process.env.SECRET
                    )
                    res.status(200).json({ status: 0, message: 'Success', data: { userId, access_token, userRoles: JSON.parse(roles) } });
                } else {
                    res.status(400).json({ status: -1, message: 'Invalid Credentials.' });
                }
            } else {
                res.status(400).json({ status: -1, message: 'Email not found. Please register.' });
            }
        } catch (err) {
            res.status(500).json({ status: -1, message: err });
        }
    },

    validateEmail: async (req, res) => {
        try {
            const emailCount = await userController.dbControllerCheckDuplicateEmail(req.body.email);
            if (emailCount === 1) {
                res.status(200).json({ status: 0, message: 'Successfully validated the email.' });
            } else {
                res.status(400).json({ status: -1, message: 'Email not found. Please register.' });
            }
        } catch (err) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' });
        }
    },

    updatePasword: async (req, res) => {
        const { email, password } = { ...req.body };

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            userController.dbControllerUpdatePassword(email, hashedPassword)
                .then(response => {
                    const { companyName } = response;
                    res.status(200).json({ status: 0, message: "Password changed successfully." });
                    emailServ.sendEmail(email, password, companyName, "OAS Conatiner Manifest Password Reset")
                })
                .catch(err =>
                    res.status(500).json({ status: -1, message: 'Unable to process request.' })
                );

        } catch (err) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' });
        }
    },

    deleteUser: (req, res) => {
        userController.dbControllerDeleteUser(req.params.userId)
            .then(result => res.status(200).json({ status: 0, message: 'Your OAS Manifest account has been deleted. Thank you for your business.' }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    }
}