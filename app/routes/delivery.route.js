const deliveryController = require('../controllers/delivery.controller');

module.exports = {
    getDeliveries: (req, res) => {
        const { userId } = req.user;
        deliveryController.dbControllerGetDelivery(userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    insertDelivery: (req, res) => {
        const data = { ...req.body }
        const { userId } = req.user;
        deliveryController.dbControllerInsertDelivery(data, userId)
            .then(result => res.status(201).json({ status: 0, data: result, message: "Delivery saved successfully." }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },
    
    getDeliveryById: (req, res) => {
        const deliveryId = req.params.deliveryId;
        const { userId } = req.user;
        deliveryController.dbControllerGetDeliveryById(deliveryId, userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

    updateDelivery: (req, res) => {
        const deliveryId = req.params.deliveryId;
        const data = { ...req.body }
        deliveryController.dbControllerUpdateDelivery(deliveryId, data)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },
    
    deleteDelivery: (req, res) => {
        const deliveryId = req.params.deliveryId;
        const { userId } = req.user;
        deliveryController.dbControllerDeleteDelivery(deliveryId, userId)
            .then(result => res.status(200).json({ status: 0, data: result }))
            .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
    },

}