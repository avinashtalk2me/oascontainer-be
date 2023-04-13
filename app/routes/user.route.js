const userController = require('../controllers/user.controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailServ = require('../utils/emailService');

module.exports = {
    registerUser: async (req, res) => {
        const { email, firstName, lastName, password, companyName, addedByUser, deliveryAccess, sailingAccess, isUserUpdate } = { ...req.body }
        try {
            const emailCount = await userController.dbControllerCheckDuplicateEmail(email);
            if (emailCount === 0) {
                const companyCount = await userController.dbControllerIsValidCompany(companyName);
                if (companyCount) {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const user = {
                        email, firstName, lastName, password: hashedPassword, companyName, addedByUser, deliveryAccess, sailingAccess, isUserUpdate
                    }
                    if (isUserUpdate) {
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
                    }

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
            const { userId, password, roles, createdBy } = await userController.dbControllerValidateEmail(req.body.email);
            if (password) {
                if (await bcrypt.compare(req.body.password, password)) {
                    const access_token = jwt.sign(
                        { userId: userId, date: new Date() },
                        process.env.SECRET
                    )
                    res.status(200).json({ status: 0, message: 'Success', data: { userId, access_token, userRoles: JSON.parse(roles), createdBy } });
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
            try {
                const { userId } = await userController.dbControllerUpdatePassword(email, hashedPassword);
                if (userId > 0) {
                    const companyDetails = await userController.dbControllerGetCompanyDetails(userId);

                    const isEmailSent = await emailServ.sendEmailForPassword(email, password, companyDetails, "OAS Conatiner Manifest Password Reset");

                    // if (isEmailSent) {
                        res.status(200).json({ status: 0, message: "Password changed successfully." })
                    // } else {
                    //     res.status(500).json({ status: -1, message: 'Unable to process request.' })
                    // }

                } else {
                    res.status(500).json({ status: -1, message: 'Unable to process request.' })
                }

            } catch (err) {
                res.status(500).json({ status: -1, message: 'Unable to process request.' });
            }

        } catch (err) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' });
        }
    },

    changePasswordForNewLogin: async (req, res) => {
        const { newPassword } = { ...req.body };

        const { userId } = req.user;

        try {
            const { email, password } = await userController.dbControllerGetUserDetailsForUserId(userId);

            if (password) {
                if (await bcrypt.compare(req.body.password, password)) {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    // await userController.dbControllerUpdatePassword(email, hashedPassword);
                    const { userId } = await userController.dbControllerUpdatePassword(email, hashedPassword);
                    if (userId > 0) {
                        const companyDetails = await userController.dbControllerGetCompanyDetails(userId);

                        const isEmailSent = await emailServ.sendEmailForPassword(email, newPassword, companyDetails, "OAS Conatiner Manifest Password Change");

                        // if (isEmailSent) {
                            res.status(200).json({ status: 0, message: "Password changed successfully." })
                        // } else {
                        //     res.status(500).json({ status: -1, message: 'Unable to process request.' })
                        // }

                    } else {
                        res.status(500).json({ status: -1, message: 'Unable to process request.' })
                    }
                } else {
                    res.status(400).json({ status: -1, message: 'Invalid Password' });
                }
            } else {
                res.status(400).json({ status: -1, message: 'User not found. Please add .' });
            }

        } catch (err) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' });
        }
    },

    getUsers: (req, res) => {
        const { userId } = req.user;
        userController.dbControllerGetUsers(userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    getUserByUserId: (req, res) => {
        const selectedUserId = req.params.userId;
        userController.dbControllerGetUserByUserId(selectedUserId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    deleteUserByUserId: (req, res) => {
        const selectedUserId = req.params.userId;
        const { userId } = req.user;
        userController.dbControllerDeleteUserByUserId(selectedUserId, userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    deactivateUser: (req, res) => {
        const { userId } = req.user;
        userController.dbControllerDeactivateUser(userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },


    addUser: async (req, res) => {
        const { email, firstName, lastName, password, deliveryAccess, sailingAccess, adminAccess } = { ...req.body }
        const { userId } = req.user;
        try {
            const emailCount = await userController.dbControllerCheckDuplicateEmail(email);
            if (emailCount === 0) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = {
                    email, firstName, lastName, password: hashedPassword, userId, deliveryAccess,
                    sailingAccess, adminAccess
                }
                userController.dbControllerAddUser(user)
                    .then(result => {
                        if (result === -1) {
                            res.status(400).json({ status: -1, message: 'Unable to process request.' });
                        } else {
                            const { companyName } = result;
                            res.status(201).json({ status: 0, message: 'User added successfully.' });
                            emailServ.sendEmail(email, password, companyName, "OAS Container Manifest Registratin Successful!")
                        }
                    })
                    .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));

            } else {
                res.status(400).send({ status: -1, message: 'Email already in use. Please enter unique email' });
            }
        } catch (err) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' });
        }
    },

    updateUser: async (req, res) => {
        const { email, firstName, lastName, deliveryAccess, sailingAccess, adminAccess, isEmailChanged } = { ...req.body }
        const userId = req.params.userId;
        try {
            let emailCount = 0
            if (isEmailChanged) {
                emailCount = await userController.dbControllerCheckDuplicateEmail(email);
            }
            if (emailCount === 0) {
                const user = {
                    email, firstName, lastName, userId, deliveryAccess, sailingAccess, adminAccess
                }
                userController.dbControllerUpdateUser(user)
                    .then(result => {
                        if (result === -1) {
                            res.status(400).json({ status: -1, message: 'Unable to process request.' });
                        } else {
                            res.status(201).json({ status: 0, message: 'User updated successfully.' });
                        }
                    })
                    .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));

            } else {
                res.status(400).send({ status: -1, message: 'Email already in use. Please enter unique email' });
            }
        } catch (err) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' });
        }
    },

    getCompanyDetails: (req, res) => {
        const { userId } = req.user;
        userController.dbControllerGetCompanyDetailsForAdmin(userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    updateCompanyDetails: (req, res) => {
        const { userId } = req.user;
        const data = { ...req.body }
        userController.dbControllerUpdateCompanyDetailsForAdmin(userId, data)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },
}