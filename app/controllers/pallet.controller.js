const config = require('../config/dbconfig');
const sql = require('mssql');


const dbControllerGetPalletByContainerId = async (id) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        const pallets = await request
            .input('sailId', sql.Int, id)
            .execute('sp_GetPalletInfo');
        return pallets.recordset;

    }
    catch (err) {
        return []
    }
    finally {
        pool.close();
    }
}

const dbControllerInsertPallet = async (sailId, pallet) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let insertPallet = await request
            .input('sailId', sql.Int, sailId)
            .input('palletType', sql.NVarChar(50), pallet.palletType)
            .input('palletNo', sql.Int, pallet.palletNo)
            .input('palletDesc', sql.VarChar(50), pallet.palletDesc)
            .input('palletWeight', sql.NVarChar(50), pallet.palletWeight)
            .input('palletWeightUnit', sql.Char(2), pallet.palletWeightUnit)
            .output('palletId', sql.Int)
            .execute('sp_InsertPalletInfo');
        return insertPallet.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


const dbControllerGetPalletById = async (palletId, sailId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let pallet = await request
            .input('sailId', sql.Int, sailId)
            .input('palletId', sql.Int, palletId)
            .execute('sp_GetSelectedPalletInfo');
        return pallet.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerUpdatePallet = async (palletId, pallet) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let updatePallet = await request
            .input('palletType', sql.NVarChar(50), pallet.palletType)
            .input('palletId', sql.Int, palletId)
            .input('palletDesc', sql.VarChar(50), pallet.palletDesc)
            .input('palletWeight', sql.NVarChar(50), pallet.palletWeight)
            .input('palletWeightUnit', sql.Char(2), pallet.palletWeightUnit)
            .output('RowCount', sql.Int)
            .execute('sp_UpdatePalletInfo');
        return updatePallet.output;
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}


const dbControllerGetNextPalletNo = async (sailId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let palletNo = await request
            .input('sailId', sql.Int, sailId)
            // .output('nextPallet', sql.Int)
            // .output('sailUnit', sql.Char(2))
            .execute('sp_GetNextPalletNo');
        return palletNo.recordset[0];
    } catch (err) {
        console.log(err)
    }
    finally {
        pool.close();
    }
}

const dbControllerDeletePallet = async (id, userId) => {
    const pool = await sql.connect(config);
    try {
        const request = pool.request();
        let deleteContainer = await request
            .input('palletId', sql.Int, id)
            .input('userId', sql.Int, userId)
            .output('RowCount', sql.Int)
            .execute('sp_DeletePalletInfo');
        return deleteContainer.output;
    } catch (err) {
        console.log(err);
    }
    finally {
        pool.close();
    }
}


module.exports = {
    dbControllerGetPalletByContainerId,
    dbControllerInsertPallet,
    dbControllerGetPalletById,
    dbControllerUpdatePallet,
    dbControllerGetNextPalletNo,
    dbControllerDeletePallet
}