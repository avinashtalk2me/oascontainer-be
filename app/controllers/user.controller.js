const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerCheckDuplicateEmail = async (email) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const duplicateEmail = await request
            .input('email', sql.NVarChar(sql.MAX), email)
            .output('result', sql.Int)
            .execute('sp_ValidateEmail');
        return duplicateEmail.output.result;
    }
    catch (err) {
        return -1
    }
    finally {
        pool.close();
    }
}

const dbControllerIsValidCompany = async (companyName) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const validCompanyName = await request
            .input('companyName', sql.VarChar(sql.MAX), companyName)
            .output('result', sql.Int)
            .execute('sp_ValidateCompany');
        return validCompanyName.output.result;
    }
    catch (err) {
        return -1
    }
    finally {
        pool.close();
    }
}

const dbControllerRegisterUser = async (user) => {
    const pool = await sql.connect(config);
    try {
        // console.log(user.password.length)
        const request = pool.request();
        const insertUser = await request
            .input('email', sql.NVarChar(sql.MAX), user.email)
            .input('firstName', sql.NVarChar(sql.MAX), user.firstName)
            .input('lastName', sql.NVarChar(sql.MAX), user.lastName)
            .input('password', sql.NVarChar(sql.MAX), user.password)
            .input('companyName', sql.NVarChar(sql.MAX), user.companyName)
            .input('addedByUser', sql.NVarChar(sql.Int), user.addedByUser)
            .input('sailingAccess', sql.Int, user.sailingAccess)
            .input('deliveryAccess', sql.Int, user.deliveryAccess)
            .execute('sp_RegisterUser');
        return insertUser;
    }
    catch (err) {
        console.log(err)
        return -1
    }
    finally {
        pool.close();
    }
}

const dbControllerAddUser = async (user) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const insertUser = await request
            .input('email', sql.NVarChar(sql.MAX), user.email)
            .input('firstName', sql.NVarChar(sql.MAX), user.firstName)
            .input('lastName', sql.NVarChar(sql.MAX), user.lastName)
            .input('password', sql.NVarChar(sql.MAX), user.password)
            .input('userId', sql.NVarChar(sql.Int), user.userId)
            .input('sailingAccess', sql.Int, user.sailingAccess)
            .input('deliveryAccess', sql.Int, user.deliveryAccess)
            .input('adminAccess', sql.Int, user.adminAccess)
            .output('companyName', sql.NVarChar(sql.MAX))
            .execute('sp_InsertUser');
        return insertUser.output;
    }
    catch (err) {
        console.log(err)
        return -1
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdateUser = async (user) => {
    const pool = await sql.connect(config);
    try {
        // console.log(user.password.length)
        const request = pool.request();
        const updateUser = await request
            .input('email', sql.NVarChar(sql.MAX), user.email)
            .input('firstName', sql.NVarChar(sql.MAX), user.firstName)
            .input('lastName', sql.NVarChar(sql.MAX), user.lastName)
            .input('sailingAccess', sql.Int, user.sailingAccess)
            .input('userId', sql.NVarChar(sql.Int), user.userId)
            .input('deliveryAccess', sql.Int, user.deliveryAccess)
            .input('adminAccess', sql.Int, user.adminAccess)
            .output('RowCount', sql.Int)
            .execute('sp_UpdateUser');
        return updateUser.output;
    }
    catch (err) {
        console.log(err)
        return -1
    }
    finally {
        pool.close();
    }
}

const dbControllerValidateEmail = async (email) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const validateUserEmail = await request
            .input('email', sql.NVarChar(sql.MAX), email)
            .output('userId', sql.Int)
            .output('password', sql.NVarChar(sql.MAX))
            .output('roles', sql.NVarChar(sql.MAX))
            .output('createdBy', sql.NVarChar(sql.Int))
            .execute('sp_ValidateUser');
        return validateUserEmail.output;
    }
    catch (err) {
        return { password: null }
    }
    finally {
        pool.close();
    }
}

const dbControllerGetPasswordForEmail = async (email) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const validateUserEmailAndGetPwd = await request
            .input('email', sql.NVarChar(sql.MAX), email)
            .output('password', sql.NVarChar(sql.MAX))
            .execute('sp_GetUserPassword');
        return validateUserEmailAndGetPwd.output;
    }
    catch (err) {
        return { password: null }
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdatePassword = async (email, password) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const updateUserPassword = await request
            .input('email', sql.NVarChar(sql.MAX), email)
            .input('password', sql.NVarChar(sql.MAX), password)
            .output('userId', sql.Int)
            .execute('sp_UpdatePassword');
        return updateUserPassword.output;
    } catch (err) {
        return { userId: -1 }
    } finally {
        pool.close();
    }
}


const dbControllerDeactivateUser = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteUser = await request
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeactivateAccount');
        return deleteUser.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


const dbControllerDeleteUser = async (selectedUserId, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteUser = await request
            .input('userId', sql.Int, userId)
            .input('selectedUserId', sql.Int, selectedUserId)
            .output('RowCount', sql.Int)
            .execute('sp_DeleteUser');
        return deleteUser.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetCompanyDetails = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let companyDetails = await request
            .input('userId', sql.Int, userId)
            .execute('sp_GetCompanyDetails');
        return companyDetails.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetCompanyDetailsForAdmin = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let companyDetails = await request
            .input('userId', sql.Int, userId)
            .execute('sp_GetCompanyDetailsForAdmin');
        return companyDetails.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdateCompanyDetailsForAdmin = async (userId, companyData) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let updateContainer = await request 
            .input('userId', sql.Int, userId)
            .input('emailFromAddress', sql.NVarChar(50), companyData.emailFromAddress)
            .input('emailFromSignature', sql.NVarChar(50), companyData.emailFromSignature)
            .input('emailHost', sql.VarChar(50), companyData.emailHost)
            .input('emailPort', sql.Int, +companyData.emailPort)
            .input('emailReceipent', sql.VarChar(sql.MAX), companyData.emailReceipent)
            .input('emailSecurity', sql.VarChar(5), companyData.emailSecurity)
            .input('emailType', sql.VarChar(10), companyData.emailType)
            .input('emailUser', sql.VarChar(40), companyData.emailUser)
            .output('rowCount', sql.Int)
            .execute('sp_UpdateCompanyDetailsForAdmin');
        return updateContainer.output;
    } catch (err) {
        return { rowCount : -1}
    }
    finally {
        pool.close();
    }
}

const dbControllerGetUsers = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let userDetails = await request
            .input('userId', sql.Int, userId)
            .execute('sp_GetUserInfo');
        return userDetails.recordset;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetUserByUserId = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let userDetail = await request
            .input('userId', sql.Int, userId)
            .execute('sp_GetSelectedUserInfo');
        return userDetail.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerDeleteUserByUserId = async (selectedUserId, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteUser = await request
            .input('selectedUserId', sql.Int, selectedUserId)
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeleteUser');
        return deleteUser.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetUserDetailsForUserId = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const validateUserAndGetDetails = await request
            .input('userId', sql.Int, userId)
            .output('email', sql.NVarChar(sql.MAX))
            .output('password', sql.NVarChar(sql.MAX))
            .execute('sp_GetUserEmailAndPassword');
        return validateUserAndGetDetails.output;
    }
    catch (err) {
        return { email:null, password: null }
    }
    finally {
        pool.close();
    }
}


module.exports = {
    dbControllerCheckDuplicateEmail,
    dbControllerRegisterUser,
    dbControllerValidateEmail,
    dbControllerIsValidCompany,
    dbControllerGetPasswordForEmail,
    dbControllerUpdatePassword,
    dbControllerDeleteUser,
    dbControllerGetCompanyDetails,
    dbControllerGetUsers,
    dbControllerGetUserByUserId,
    dbControllerDeleteUserByUserId,
    dbControllerAddUser,
    dbControllerUpdateUser,
    dbControllerDeactivateUser,
    dbControllerGetUserDetailsForUserId,
    dbControllerGetCompanyDetailsForAdmin,
    dbControllerUpdateCompanyDetailsForAdmin
}