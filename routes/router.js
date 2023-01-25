const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const assetController = require("../controller/assets.controller");

//API to the users
router.get("/", assetController.getUsers);
router.post("/api/users", userController.create);
router.put("/api/users/:id", userController.update);


//API to the assets
router.get("/api/assets", assetController.find);
router.post("/api/assets", assetController.create);
router.post("/api/updateAssets", assetController.update);
router.get("/api/usersHistory/:assetId", assetController.usersHistory);


module.exports = router;
