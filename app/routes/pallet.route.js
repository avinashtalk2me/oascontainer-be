const palletController = require('../controllers/pallet.controller');

module.exports = {
    getPallets: (req, res) => {
        const sailId = req.params.sailId;
        palletController.dbControllerGetPalletByContainerId(sailId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    insertPallet: (req, res) => {
        const sailId = req.params.sailId;
        const data = { ...req.body }
        palletController.dbControllerInsertPallet(sailId, data)
            .then(result => res.status(201).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    getNextPalletBySailId: (req, res) => {
        const sailId = req.params.sailId;
        palletController.dbControllerGetNextPalletNo(sailId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    getPalletById: (req, res) => {
        const palletId = req.params.palletId;
        const sailId = req.params.sailId;
        palletController.dbControllerGetPalletById(palletId, sailId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    updatePallet: (req, res) => {
        const data = { ...req.body }
        const palletId = req.params.palletId;
        palletController.dbControllerUpdatePallet(palletId, data)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    deletePallet: (req, res) => {
        const palletId = req.params.palletId;
        const { userId } = req.user;
        palletController.dbControllerDeletePallet(palletId, userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    }
}
