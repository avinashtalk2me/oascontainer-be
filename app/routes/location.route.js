const locationController = require('../controllers/location.controller');
const userController = require('../controllers/user.controller');
const emailServ = require('../utils/emailService');

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
        locationController.dbControllerInsertLocation(locationId, data)
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

    getShipperDetailsForEmailForLocation: async (req, res) => {
        const locationId = req.params.locationId;
        const { userId } = req.user;
        const packageIds = [];
        try {
            const shipperDetails = await locationController.dbControllerGetShipperDetailsForEmailForSelectedLocation(locationId, userId);

            const companyDetails = await userController.dbControllerGetCompanyDetails(userId);

            for (let i = 0; i < shipperDetails.length; i++) {
                if (shipperDetails[i].ShipperEmail === "") {
                    packageIds.push({
                        packageId: shipperDetails[i].PackageID,
                        hwbNo: shipperDetails[i].HwbNo,
                        failure: "yes"
                    });
                    continue;
                }
                // const isEmailSent = 
                await emailServ.sendEmailForShipmentScanned(shipperDetails[i], companyDetails);
                packageIds.push({
                    packageId: shipperDetails[i].PackageID,
                    hwbNo: shipperDetails[i].HwbNo,
                    failure: "no"
                });
                // !isEmailSent && packageIds.push({
                //     packageId: shipperDetails[i].PackageID,
                //     hwbNo: shipperDetails[i].HwbNo,
                //     failure: "yes"
                // });
            }

            const { rowCount } = await locationController.dbControllerUpdateLocationDropStatusAfterEmailSent(locationId, packageIds);

            if (rowCount !== -1) {
                res.status(200).json({ status: 0, message: 'Email is sent successfully.' })
            } else {
                res.status(200).json({ status: -1, message: 'Unable to send email. Missing Email Recipient.' })
            }
        } catch (ex) {
            res.status(500).json({ status: -1, message: 'Unable to process request.' })
        }

    }

}