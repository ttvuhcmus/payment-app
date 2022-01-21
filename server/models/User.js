const db = require("../connections/postgres");
const tbName = "Users";
const usernameFieldName = "f_Username";
const bcrypt = require("../utils/bcrypt");

module.exports = {
  getAll: async () => {
    const res = await db.load(tbName);
    return res;
  },

  getUserByName: async (username) => {
    const res = await db.get(tbName, usernameFieldName, username);
    if (res.length > 0) {
      return res[0];
    }
    return null;
  },

  add: async (user) => {
    const res = await db.add(tbName, user);
    return res;
  },

  auth: async (username, password) => {
    console.log("Sign-in AUTH:");
    console.log("Username:", username);
    console.log("Password:", password);
    const userFound = await db.get(tbName, usernameFieldName, username);
    if (userFound.length > 0) {
      const match = bcrypt.auth(userFound[0].f_Password, password);
      if (match) {
        console.log("SIGN-IN AUTH: Sign-in successfully!");
        return true;
      }
      console.log("SIGN-IN AUTH: Wrong Password!");
      return false;
    }
    console.log("SIGN-IN AUTH: Account does not exist!");
    return false;
  },
};
