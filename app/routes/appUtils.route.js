const appUtilsController = require('../controllers/appUtils.controller');

module.exports = {
    getAppVersion: (req, res) => {
        appUtilsController.dbGetAppVersion()
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    }
}