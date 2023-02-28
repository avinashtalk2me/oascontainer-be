const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerGetLocation = async (deliveryId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const response = await request
            .input('deliveryId', sql.Int, deliveryId)
            .execute('sp_GetLocationInfo');
        return response.recordset;
    }
    catch (err) {
        return []
    }
    finally {
        pool.close();
    }
}

const dbControllerInsertLocation = async (deliveryId, location) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('locationDesc', sql.NVarChar(40), location.locationDesc)
            .input('locationTime', sql.DateTime, location.locationTime)
            .input('displayLocationTime', sql.Text, location.displayLocationTime)
            .input('deliveryId', sql.Int, deliveryId)
            .output('locationId', sql.Int)
            .execute('sp_InsertLocationInfo');
        return response.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetLocationById = async (deliveryId, locationId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('deliveryId', sql.Int, deliveryId)
            .input('locationId', sql.Int, locationId)
            .execute('sp_GetSelectedLocationInfo');
        return response.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdateLocation = async (locationId, location) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('locationDesc', sql.NVarChar(40), location.locationDesc)
            .input('locationTime', sql.DateTime, location.locationTime)
            .input('displayLocationTime', sql.Text, location.displayLocationTime)
            .input('locationId', sql.Int, locationId)
            .output('RowCount', sql.Int)
            .execute('sp_UpdateLocationInfo');
        return response.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerDeleteLocation = async (locationId, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('locationId', sql.Int, locationId)
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeleteLocationInfo');
        return response.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

module.exports = {
    dbControllerGetLocation,
    dbControllerInsertLocation,
    dbControllerGetLocationById,
    dbControllerUpdateLocation,
    dbControllerDeleteLocation
}