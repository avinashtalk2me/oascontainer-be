const packageController = require("../controllers/dropoff.controller");

module.exports = {
  getDropOffs: (req, res) => {
    const id = req.params.locationId;
    packageController
      .dbControllerGetDropoffsByLocationId(id)
      .then((result) => res.status(200).json({ status: 0, data: result }))
      .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
      );
  },

  insertDropOff: (req, res) => {
    const data = { ...req.body };
    const {locationId, deliveryId} = req.params;
    const { userId } = req.user;
    packageController
      .dbControllerInsertDropoff(locationId, deliveryId, userId, data)
      .then((result) => res.status(201).json({ status: 0, data: result }))
      .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
      );
  },
 

  updateDropOff: (req, res) => {
    const packageId = req.params.packageId;
    const data = { ...req.body };
    packageController
      .dbControllerUpdateDropoff(packageId, data)
      .then((result) => res.status(200).json({ status: 0, data: result }))
      .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
      );
  },

  deleteDropOff: (req, res) => {
    const packageId = req.params.packageId;
    const { userId } = req.user;
    packageController.dbControllerDeleteDropoff(packageId, userId)
      .then(result => res.status(200).json({ status: 0, data: result }))
      .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
  },

  // getSelectedPackagePkgNos: (req, res) => {
  //   const palletId = req.params.palletId
  //   const { hwbNo, pkgNo } = { ...req.body };
  //   packageController.dbControllerGetSelectedPackagePkgNos(palletId, hwbNo, pkgNo)
  //     .then(result => res.status(200).json({ status: 0, data: result }))
  //     .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
  // },

  getSelectedHwbInfoForDropOff: (req, res) => {
    const { hwbNo, locationId } = req.params;
    packageController
      .dbControllerGetSelectedHwbInfoForDropoff(hwbNo, locationId)
      .then((result) => res.status(200).json({ status: 0, data: result }))
      .catch((err) =>
        res.status(500).json({ status: -1, message: err })
      );
  },
};
