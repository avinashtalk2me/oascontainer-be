const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerGetDropoffsByLocationId = async (id) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const dropoffs = await request
            .input('locationId', sql.Int, id)
            .execute('sp_GetDropoffPackageInfo');
        return dropoffs.recordset;

    }
    catch (err) {
        return []
    }
    finally {
        pool.close();
    }
}

const dbControllerInsertDropoff = async (locationId, deliveryId, userId, packageData) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let insertDropoff = await request
            .input('locationId', sql.Int, locationId)
            .input('deliveryId', sql.Int, deliveryId)
            .input('userId', sql.Int, userId)
            .input('packageData', sql.NVarChar(sql.MAX), JSON.stringify(packageData))
            .output('rowcount', sql.Int)
            .execute('sp_InsertDropoffPackageInfo');
        return insertDropoff.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


const dbControllerUpdateDropoff = async (packageId, package) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let updateDropoff = await request
            .input('packageId', sql.Int, packageId)
            .input('packageData', sql.NVarChar(sql.MAX), JSON.stringify(package))
            .output('rowcount', sql.Int)
            .execute('sp_UpdateDropoffPackageInfo');
        return updateDropoff.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerDeleteDropoff = async (packageId, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteContainer = await request
            .input('packageId', sql.Int, packageId)
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeleteDropoffPackageInfo');
        return deleteContainer.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

// const dbControllerGetSelectedPackagePkgNos = async (palletId, hwbNo, pkgNo) => {
//     const pool = await sql.connect(config);
//     try {
//         const request = pool.request();
//         let getSelectedPkgNo = await request
//             .input('palletId', sql.Int, palletId)
//             .input('hwbNo', sql.NVarChar(50), hwbNo)
//             .input('pkgNo', sql.NVarChar(10), pkgNo)
//             .output('isValidPackage', sql.Bit)
//             .execute('sp_GetSelectedPackagePkgNos');
//         return getSelectedPkgNo.output;
//     } catch (err) {
//         console.log(err)
//     }
//     finally {
//         pool.close();
//     }
// }

const dbControllerGetSelectedHwbInfoForDropoff = async (hwbNo, locationId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let dropoffs = await request
            .input('hwbNo', sql.NVarChar(50), hwbNo)
            .input('locationId', sql.Int, locationId)
            .output('isHWBNoAvailable', sql.Bit)
            .execute('sp_GetSelectedHWBDetailsForDropOff');

        return { isValidHwb: dropoffs.output.isHWBNoAvailable, hwbInfo: dropoffs.recordset && { ...dropoffs.recordset[0] } };
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}



module.exports = {
    dbControllerGetDropoffsByLocationId,
    dbControllerInsertDropoff,
    dbControllerUpdateDropoff,
    dbControllerDeleteDropoff,
    dbControllerGetSelectedHwbInfoForDropoff,
}