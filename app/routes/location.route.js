const locationController = require('../controllers/location.controller');

module.exports = {
    getLocations: (req, res) => {
        const locationId = req.params.deliveryId;
        locationController.dbControllerGetLocation(locationId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    insertLocation: (req, res) => {
        const locationId = req.params.deliveryId;
        const data = { ...req.body }
        locationController.dbControllerInsertLocation(locationId,data)
            .then(result => res.status(201).json({ status: 0, data: result, message: "location saved successfully." }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },
    
    getLocationById: (req, res) => {
        const locationId = req.params.locationId;
        const deliveryId = req.params.deliveryId;
        locationController.dbControllerGetLocationById(deliveryId, locationId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    updateLocation: (req, res) => {
        const locationId = req.params.locationId;
        const data = { ...req.body }
        locationController.dbControllerUpdateLocation(locationId, data)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },
    
    deleteLocation: (req, res) => {
        const locationId = req.params.locationId;
        const { userId } = req.user;
        locationController.dbControllerDeleteLocation(locationId, userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

}