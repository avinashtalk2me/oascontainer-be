const packageController = require("../controllers/package.controller");

module.exports = {
  getPackages: (req, res) => {
    const id = req.params.palletId;
    packageController
      .dbControllerGetPackageByPalletId(id)
      .then((result) => res.status(200).json({ status: 0, data: result }))
      .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
      );
  },

  insertPackage: (req, res) => {
    const data = { ...req.body };
    const palletId = req.params.palletId;
    const { userId } = req.user;
    packageController
      .dbControllerInsertPackage(palletId, data, userId)
      .then((result) => res.status(201).json({ status: 0, data: result }))
      .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
      );
  },

  updatePackage: (req, res) => {
    const packageId = req.params.packageId;
    const data = { ...req.body };
    const { userId } = req.user;
    packageController
      .dbControllerUpdatePackage(packageId, userId, data)
      .then((result) => res.status(200).json({ status: 0, data: result }))
      .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
      );
  },

  deletePackage: (req, res) => {
    const packageId = req.params.packageId;
    const { userId } = req.user;
    packageController.dbControllerDeletePackage(packageId, userId)
      .then(result => res.status(200).json({ status: 0, data: result }))
      .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
  },

  getSelectedPackagePkgNos: (req, res) => {
    const palletId = req.params.palletId;
    const { userId } = req.user;
    const { hwbNo, pkgNo } = { ...req.body };
    packageController.dbControllerGetSelectedPackagePkgNos(palletId, hwbNo, pkgNo, userId)
      .then(result => res.status(200).json({ status: 0, data: result }))
      .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
  },

  getSelectedHwbInfo: (req, res) => {
    const { hwbNo, palletId } = req.params;
    const { userId } = req.user;
    packageController
      .dbControllerGetSelectedHwbInfo(hwbNo, palletId, userId)
      .then((result) => res.status(200).json({ status: 0, data: result || {} }))
      .catch((err) =>
        res.status(500).json({ status: -1, message: err })
      );
  },
};
