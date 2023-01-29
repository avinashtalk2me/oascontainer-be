const pkgTypeController = require('../controllers/pkgType.controller');

module.exports = {
    getPkgTypes: (req, res) => {
        pkgTypeController.dbControllerGetPkgTypes()
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    insertPkgTypes: (req, res) => {
        const data = { ...req.body }
        pkgTypeController.dbControllerInsertPkgType(data)
            .then(result => res.status(201).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },


}
