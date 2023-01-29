const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerGetPkgTypes = async () => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const pkgTypes = await request.execute('sp_GetPackageType');
        return pkgTypes.recordset;
    }
    catch (err) {
        return []
    }
    finally {
        pool.close();
    }
}

const dbControllerInsertPkgType = async (pkgInfo) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let insertPkgType = await request
            .input('pkgType', sql.NChar(20), pkgInfo.pkgType)
            .execute('sp_InsertPackageType');
        return insertPkgType.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

module.exports = {
    dbControllerGetPkgTypes,
    dbControllerInsertPkgType
}