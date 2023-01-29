const containerController = require('../controllers/container.controller');

module.exports = {
    getContainers: (req, res) => {
        const { userId } = req.user;
        containerController.dbControllerGetContainer(userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    insertContainer: (req, res) => {
        const data = { ...req.body }
        const { userId } = req.user;
        containerController.dbControllerInsertContainer(data, userId)
            .then(result => res.status(201).json({ status: 0, data: result, message: "Sail saved successfully." }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    getContainerById: (req, res) => {
        const id = req.params.sailId;
        containerController.dbControllerGetContainerById(id)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    updateContainer: (req, res) => {
        const id = req.params.sailId;
        const data = { ...req.body }
        containerController.dbControllerUpdateContainer(id, data)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    getContainerManifest: (req, res) => {
        const id = req.params.sailId;
        containerController.dbControllerGetContainerManifest(id)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    getPalletManifest: (req, res) => {
        const id = req.params.sailId;
        containerController.dbControllerPalletManifest(id)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    deleteContainer: (req, res) => {
        const id = req.params.sailId;
        const { userId } = req.user;
        containerController.dbControllerDeleteContainer(id, userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

}
