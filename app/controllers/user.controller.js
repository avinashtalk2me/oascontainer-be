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
            .input('sailingAccess', sql.Int, user.sailingAccess)
            .input('deliveryAccess', sql.Int, user.deliveryAccess)
            .execute('sp_InsertUser');
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

const dbControllerValidateEmail = async (email) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const validateUserEmail = await request
            .input('email', sql.NVarChar(sql.MAX), email)
            .output('userId', sql.Int)
            .output('password', sql.NVarChar(sql.MAX))
            .output('roles', sql.NVarChar(sql.MAX))
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

const dbControllerDeleteUser = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteUser = await request
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

module.exports = {
    dbControllerCheckDuplicateEmail,
    dbControllerRegisterUser,
    dbControllerValidateEmail,
    dbControllerIsValidCompany,
    dbControllerGetPasswordForEmail,
    dbControllerUpdatePassword,
    dbControllerDeleteUser,
    dbControllerGetCompanyDetails
}