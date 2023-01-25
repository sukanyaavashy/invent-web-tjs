const Asset = require("../model/assets_model");
const User = require("../model/user_model");

//create Assets or Post
exports.create = async (req, res) => {
  try {
    //validate request
    if (!req.body) {
      res.render("error404");
    }

    //new Asset
    const newAsset = await Asset.create({
      name: req.body.name,
      description: req.body.description,
    });

    if (newAsset) {
      res.redirect("/api/assets");
    } else {
      res.render("error404");
    }
  } catch (error) {
    res.render("error404");
  }
};

// Get Assets
exports.find = async (req, res) => {
  try {
    if (req.query.id) {
      const id = req.query.id;
      const data = await Asset.findOne({
        _id: id,
        $or: [{ status: "Unassigned" }, { status: "waiting" }],
      });
      if (!data) {
        res.render("error404");
      } else {
        res.render("assets", { assets: data });
      }
    } else {
      const asset = await Asset.find({
        $or: [{ status: "Unassigned" }, { status: "waiting" }],
      });
      if (asset) {
        res.render("assets", { assets: asset });
      } else {
        res.render("error404");
      }
    }
  } catch (error) {
    res.render("error404");
  }
};

// get users data from assigned assets
exports.getUsers = async (req, res) => {
  try {
    const response = [];
    const asset = await Asset.find({ status: "assigned" });
    if (asset.length != 0) {
      for (let i = 0; i < asset.length; i++) {
        const user = await User.findOne({ id: asset[i].userId });
        if (user) {
          response.push({
            _id: asset[i]._id,
            userName: user.name,
            description: asset[i].description,
            asset: asset[i].name,
            updatedAt: asset[i].updatedAt.toLocaleString(),
          });
        }
      }
      res.render("index", { users: response });
    } else if (asset.length == 0) {
      res.render("index", { users: response });
    } else {
      res.render("error404");
    }
  } catch (error) {
    res.render("error404");
  }
};

exports.usersHistory = async (req, res) => {
  try {
    const asset = await Asset.findById({ _id: req.params.assetId });
    if (asset) {
      res.render("history", { users: asset.history });
    } else {
      res.render("error404");
    }
  } catch (error) {
    res.render("error404");
  }
};

//update Assets
exports.update = async (req, res) => {
  try {
    if (req.body.password) {
      if (!req.body.password || req.body.password !== process.env.PASSWORD) {
        res.render("error404");
      } else {
        const asset = await Asset.findById(req.body.id);
        if (asset && asset.status === "waiting") {
          const data = await Asset.findByIdAndUpdate(
            { _id: req.body.id },
            { status: "assigned" },
            { new: true }
          );
          if (data) {
            res.redirect("/api/assets");
          } else {
            res.render("error404");
          }
        } else {
          const data = await Asset.findByIdAndUpdate(
            { _id: req.body.id },
            { status: "Unassigned", userId: "" },
            { new: true }
          );
          if (data) {
            res.redirect("/");
          } else {
            res.render("error404");
          }
        }
      }
    } else {
      let history = "";
      const user = await User.findOne({ id: req.body.userId });
      if (user) {
        history = {
          id: user.id,
          name: user.name,
          createdAt: new Date().toLocaleString(),
        };
      }
      const data = await Asset.findByIdAndUpdate(
        { _id: req.body.id },
        {
          userId: req.body.userId,
          status: "waiting",
          $push: { history: history },
        },
        { new: true }
      );
      if (data) {
        res.redirect("/api/assets");
      } else {
        res.render("error404");
      }
    }
  } catch (error) {
    res.render("error404");
  }
};
