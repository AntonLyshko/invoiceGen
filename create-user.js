const User = require("./models/User");
const bcrypt = require("bcryptjs");

const addUser = async (login, password) => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  let user = new User({ login: login, password: password });
  await user.save().then(() => {
    console.log("User saved");
  });
};

module.exports = addUser;
