const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerGetPackageByPalletId = async (id) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const packages = await request
            .input('palletId', sql.Int, id)
            .execute('sp_GetPackageInfo');
        return packages.recordset;

    }
    catch (err) {
        return []
    }
    finally {
        pool.close();
    }
}

const dbControllerInsertPackage = async (palletId, packageData) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let insertPackage = await request
            .input('palletId', sql.Int, palletId)
            // .input('packageType', sql.NChar(10), package.packageType)
            .input('packageData', sql.NVarChar(sql.MAX), JSON.stringify(packageData))
            .output('rowcount', sql.Int)
            .execute('sp_InsertPackageInfo');
        return insertPackage.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


const dbControllerGetPackageById = async (packageId, palletId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let packages = await request
            .input('packageId', sql.Int, packageId)
            .input('palletId', sql.Int, palletId)
            .execute('sp_GetSelectedPackageInfo');
        return packages.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdatePackage = async (packageId, package) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let updatePallet = await request
            // .input('hwbNo', sql.NVarChar(50), package.hwbNo)
            // .input('packageCount', sql.NVarChar(50), package.packageCount)
            .input('packageId', sql.Int, packageId)
            .input('packageData', sql.NVarChar(sql.MAX), JSON.stringify(package))
            .output('rowcount', sql.Int)
            .execute('sp_UpdatePackageInfo');
        return updatePallet.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerDeletePackage = async (id, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteContainer = await request
            .input('packageId', sql.Int, id)
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeletePackageInfo');
        return deleteContainer.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetSelectedPackagePkgNos = async (palletId, hwbNo, pkgNo) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let getSelectedPkgNo = await request
            .input('palletId', sql.Int, palletId)
            .input('hwbNo', sql.NVarChar(50), hwbNo)
            .input('pkgNo', sql.NVarChar(10), pkgNo)
            .output('isValidPackage', sql.Bit)
            .execute('sp_GetSelectedPackagePkgNos');
        return getSelectedPkgNo.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerGetSelectedHwbInfo = async (hwbNo, palletId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let packages = await request
            .input('hwbNo', sql.NVarChar(50), hwbNo)
            .input('palletId', sql.Int, palletId)
            .output('isNewHWBNo', sql.Bit)
            .execute('sp_GetSelectedHWBInfo');

        return { isExistingHwb: packages.output.isNewHWBNo, hwbInfo: { ...packages.recordset[0] } };
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}



module.exports = {
    dbControllerGetPackageByPalletId,
    dbControllerInsertPackage,
    dbControllerGetPackageById,
    dbControllerUpdatePackage,
    dbControllerDeletePackage,
    dbControllerGetSelectedPackagePkgNos,
    dbControllerGetSelectedHwbInfo
}