const config = require('../config/dbconfig');
const sql = require('mssql');


const dbGetAppVersion = async () => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const getAppVersion = await request
            .execute('sp_GetAppVersion');
        return getAppVersion.recordset[0];
    }
    catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

module.exports = {
    dbGetAppVersion
}