const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerGetDelivery = async (userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const response = await request
            .input('userId', sql.Int, userId)
            .execute('sp_GetDeliveryInfo');
        return response.recordset;

    }
    catch (err) {
        return []
    }
    finally {
        pool.close();
    }
}

const dbControllerInsertDelivery = async (delivery, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('deliveryDesc', sql.NVarChar(40), delivery.deliveryDesc)
            .input('deliveryDate', sql.DateTime, delivery.deliveryDate)
            .input('userId', sql.Int, userId)
            .output('deliveryId', sql.Int)
            .execute('sp_InsertDeliveryInfo');
        return response.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetDeliveryById = async (deliveryId, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('deliveryId', sql.Int, deliveryId)
            .input('userId', sql.Int, userId)
            .execute('sp_GetSelectedDeliveryInfo');
        return response.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdateDelivery = async (deliveryId, delivery) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('deliveryDesc', sql.NVarChar(40), delivery.deliveryDesc)
            .input('deliveryDate', sql.Date, delivery.deliveryDate)
            .input('deliveryId', sql.Int, deliveryId)
            .output('RowCount', sql.Int)
            .execute('sp_UpdateDeliveryInfo');
        return response.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerDeleteDelivery = async (deliveryId, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let response = await request
            .input('deliveryId', sql.Int, deliveryId)
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeleteDeliveryInfo');
        return response.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


module.exports = {
    dbControllerGetDelivery,
    dbControllerInsertDelivery,
    dbControllerGetDeliveryById,
    dbControllerUpdateDelivery,
    dbControllerDeleteDelivery
}