const User = require("../model/user_model");

//create users or Post
exports.create = async (req, res) => {
  try {
    //validate request
    if (!req.body) {
      res.render("error404");
    }

    //new user
    const allUsers = await User.find();

    const user = new User({
      id: allUsers.length + 1,
      name: req.body.name,
      asset: req.body.asset,
    });

    //save user in the database
    const data = await user.save();
    if (data) {
      res.send(data);
    } else {
      res.render("error404");
    }
  } catch (error) {
    res.render("error404");
  }
};

//Get users
exports.find = async (req, res) => {
  try {
    if (req.query.id) {
      const id = req.query.id;
      const data = await User.findById(id);
      if (!data) {
        res.render("error404");
      } else {
        res.render("index", { users: data });
      }
    } else {
      const user = await User.find();
      if (user) {
        res.render("index", { users: user });
      } else {
        res.render("error404");
      }
    }
  } catch (error) {
    res.render("error404");
  }
};

// update users
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      res.render("error404");
    }
    const id = req.params.id;
    const data = await User.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (!data) {
      res.render("error404");
    } else {
      res.send(data);
    }
  } catch (error) {
    res.render("error404");
  }
};
