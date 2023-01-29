const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerGetContainer = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const containers = await request
            .input('userId', sql.Int, userId)
            .execute('sp_GetSailingInfo');
        return containers.recordset;

    }
    catch (err) {
        return []
    }
    finally {
        pool.close();
    }
}

const dbControllerInsertContainer = async (container, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let insertContainer = await request
            .input('sailDesc', sql.NVarChar(50), container.sailDesc)
            .input('sailDate', sql.DateTime, container.sailDate)
            .input('sailUnit', sql.Char(2), container.sailUnit)
            .input('userId', sql.Int, userId)
            .output('sailId', sql.Int)
            .execute('sp_InsertSailingInfo');
        return insertContainer.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


const dbControllerGetContainerById = async (id) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let container = await request
            .input('sailId', sql.Int, id)
            .execute('sp_GetSelectedSailingInfo');
        return container.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdateContainer = async (id, container) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let updateContainer = await request
            .input('sailDesc', sql.NVarChar(50), container.sailDesc)
            .input('sailDate', sql.Date, container.sailDate)
            .input('sailUnit', sql.Char(2), container.sailUnit)
            .input('sailId', sql.Int, id)
            .output('RowCount', sql.Int)
            .execute('sp_UpdateSailingInfo');
        return updateContainer.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetContainerManifest = async (sailId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let container = await request
            .input('sailId', sql.Int, sailId)
            .execute('sp_GetContainerManifest');
        return container.recordset;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerPalletManifest = async (sailId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let container = await request
            .input('sailId', sql.Int, sailId)
            .execute('sp_GetPalletManifest');
        return container.recordset;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerDeleteContainer = async (id, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteContainer = await request
            .input('sailId', sql.Int, id)
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeleteSailingInfo');
        return deleteContainer.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


module.exports = {
    dbControllerGetContainer,
    dbControllerInsertContainer,
    dbControllerGetContainerById,
    dbControllerUpdateContainer,
    dbControllerGetContainerManifest,
    dbControllerPalletManifest,
    dbControllerDeleteContainer
}