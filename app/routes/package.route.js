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
    packageController
      .dbControllerInsertPackage(palletId, data)
      .then((result) => res.status(201).json({ status: 0, data: result }))
      .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
      );
  },

  // getPackageById: (req, res) => {
  //   const packageId = req.params.packageId;
  //   const palletId = req.params.palletId;
  //   packageController
  //     .dbControllerGetPackageById(packageId, palletId)
  //     .then((result) => res.status(200).json({ status: 0, data: result }))
  //     .catch((err) => res.status(500).json({ status: -1, message: "Unable to process request." })
  //     );
  // },

  updatePackage: (req, res) => {
    const packageId = req.params.packageId;
    const data = { ...req.body };
    packageController
      .dbControllerUpdatePackage(packageId, data)
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
    const palletId = req.params.palletId
    const { hwbNo, pkgNo } = { ...req.body };
    packageController.dbControllerGetSelectedPackagePkgNos(palletId, hwbNo, pkgNo)
      .then(result => res.status(200).json({ status: 0, data: result }))
      .catch(err => res.status(500).json({ status: -1, message: 'Unable to process request.' }));
  },

  getSelectedHwbInfo: (req, res) => {
    const { hwbNo, palletId } = req.params;
    packageController
      .dbControllerGetSelectedHwbInfo(hwbNo, palletId)
      .then((result) => res.status(200).json({ status: 0, data: result || {} }))
      .catch((err) =>
        res.status(500).json({ status: -1, message: err })
      );
  },
};
