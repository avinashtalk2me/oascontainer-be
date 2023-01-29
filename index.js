const express = require("express");
const cors = require("cors");
require("dotenv").config();
const containerRoutes = require("./app/routes/container.route");
const palletRoutes = require("./app/routes/pallet.route");
const packageRoutes = require("./app/routes/package.route");
const pkgTypeRoutes = require("./app/routes/pkgType.route");
const userRoutes = require("./app/routes/user.route");
const appUtilsRoutes = require("./app/routes/appUtils.route");
const auth = require("./app/middleware/auth");
const { getImageUrl } = require("./app/utils/getDocs");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();
app.use("/api", router);

const erroHandler = (err, req, res, next) => {
  res.status(500).json({ status: err["status"], message: err["message"] });
};


router.route("/oaslogo.png").get(getImageUrl);
router.route("/register").post(userRoutes.registerUser);
router.route("/login").post(userRoutes.validateUser);
router.route("/validateEmail").post(userRoutes.validateEmail);
router.route("/updatePassword").patch(userRoutes.updatePasword);
router.route("/getAppVersion").get(appUtilsRoutes.getAppVersion);

router.use(auth);
router.route("/deleteUser/:userId").delete(userRoutes.deleteUser);
router.route("/sailing").get(containerRoutes.getContainers);
router.route("/sailing").post(containerRoutes.insertContainer);
router.route("/sailing/containermanifest/:sailId").get(containerRoutes.getContainerManifest);
router.route("/sailing/palletmanifest/:sailId").get(containerRoutes.getPalletManifest);
router.route("/sailing/:sailId").get(containerRoutes.getContainerById);
router.route("/sailing/:sailId").patch(containerRoutes.updateContainer);
router.route("/sailing/:sailId").delete(containerRoutes.deleteContainer);

router.route("/pallet/:sailId").get(palletRoutes.getPallets);
router.route("/pallet/nextPalletNo/:sailId").get(palletRoutes.getNextPalletBySailId);
router.route("/pallet/:sailId").post(palletRoutes.insertPallet);
router.route("/pallet/:sailId/:palletId").get(palletRoutes.getPalletById);
router.route("/pallet/:palletId").patch(palletRoutes.updatePallet);
router.route("/pallet/:palletId").delete(palletRoutes.deletePallet);

router.route("/package/getHWBInfo/:hwbNo/:palletId").get(packageRoutes.getSelectedHwbInfo);
router.route("/package/getPkgNo/:palletId").post(packageRoutes.getSelectedPackagePkgNos);
router.route("/package/:palletId").get(packageRoutes.getPackages);
router.route("/package/:palletId").post(packageRoutes.insertPackage);
router.route("/package/:palletId/:packageId").get(packageRoutes.getPackageById);
router.route("/package/:packageId").patch(packageRoutes.updatePackage);
router.route("/package/:packageId").delete(packageRoutes.deletePackage);

router.route("/package/pkgType").get(pkgTypeRoutes.getPkgTypes);
router.route("/package/pkgType").post(pkgTypeRoutes.insertPkgTypes);



app.use(erroHandler);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`App is running at PORT ${PORT}`);
});
