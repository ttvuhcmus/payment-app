const db = require("../connections/postgres");
const md5 = require("md5");

const { nanoid, customAlphabet } = require("nanoid");
const nanoidNumber = customAlphabet("1234567890", 10);
const nanoidToken = customAlphabet("1234567890abcdef", 20);

const Api = require("../models/Api");

class SiteController {
  async indexGET(req, res) {
    if (req.session.token) {
      let user = await db.get("users", "token", req.session.token);
      let wallet = await db.get("wallets", "user_id", user[0].id);
      res.render("home", { menu: 0, user: user[0], wallet: wallet[0] });
    } else {
      res.render("login", { out: true });
    }
  }

  async login(req, res) {
    let user = await db.get("users", "username", req.body.username);

    let password = await md5(req.body.password);

    if (user[0] && user[0].password == password) {
      req.session.token = user[0].token;
      let md5UserName = await md5(user[0].username);
      if (md5UserName == password) res.redirect("/changePassword");
      else res.redirect("/");
    } else {
      req.session.token = null;
      res.render("login", { error: 1, out: true });
    }
  }

  async logout(req, res) {
    req.session.token = null;
    res.redirect("/");
  }

  async create(req, res) {
    if (req.session.token) {
      let user = await db.get("users", "token", req.session.token);

      let allUSer = await db.load("users");

      if (user[0].permission) {
        Api.getUsers()
          .then((resP) => {
            let _users = resP.data.items.map((item) => {
              let _u = allUSer.find((el) => el.id_number == item.f_CMND);
              if (!_u)
                return {
                  id_number: item.f_CMND,
                  name: item.f_Fullname,
                  email: "",
                  date_birth: item.f_YOB,
                  phone: item.f_SDT,
                  address: item.f_Address,
                };
              else return null;
            });

            _users = _users.filter((item) => {
              return item != null;
            });

            res.render("home", {
              user: { permission: 1 },
              menu: 1,
              users: _users,
            });
          })
          .catch(() => {
            res.render("home", { menu: 1, users: [] });
          });
        return;
      } else {
        res.redirect("/");
      }
    }
    res.render("login", { out: true });
  }

  async createUser(req, res) {
    await Api.getUserById(req.body.id_number).then((resP) => {
      let _user = resP.data.items;

      let user_id = nanoidNumber();

      let dbUser = {
        id: user_id,
        id_number: _user.f_CMND,
        username: _user.f_CMND,
        password: md5(_user.f_CMND),
        token: nanoid(),
        name: _user.f_Fullname,
        email: _user.f_Email || "",
        date_birth: _user.f_YOB,
        phone: _user.f_SDT,
        address: _user.f_Address,
        permission: 0,
      };

      let date = new Date();

      let dbWallet = {
        id: nanoidNumber(),
        user_id: user_id,
        balance: 500000,
        date: `${date.getDate() + 1}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`,
      };

      db.add("users", dbUser);
      db.add("wallets", dbWallet);
    });

    Api.getUsers()
      .then((resP) => {
        let _users = resP.data.items.map((item) => {
          let _u = allUSer.find((el) => el.id_number == item.f_CMND);
          if (!_u)
            return {
              id_number: item.f_CMND,
              name: item.f_Fullname,
              email: "",
              date_birth: item.f_YOB,
              phone: item.f_SDT,
              address: item.f_Address,
            };
          else return null;
        });

        _users = _users.filter((item) => {
          return item != null;
        });

        res.render("home", {
          menu: 1,
          user: { permission: 1 },
          users: _users,
          success: 1,
        });
      })
      .catch(() => {
        res.render("home", {
          menu: 1,
          user: { permission: 1 },
          users: [],
          success: 1,
        });
      });
  }

  async manager(req, res) {
    let users = await db.load("users");
    let wallets = await db.load("wallets");

    users = users.map((item) => {
      let _w = wallets.find((el) => el.user_id == item.id);
      return {
        ...item,
        walletId: _w.id,
        balance: _w.balance,
        walletDate: _w.data,
      };
    });

    res.render("home", { user: { permission: 1 }, menu: 2, users: users });
  }

  async balance(req, res) {
    let admin = await db.get("users", "token", req.session.token);
    let adWallet = await db.get("wallets", "user_id", admin[0].id);

    let wallet = await db.get("wallets", "id", req.body.wallet_id);

    let _value = parseInt(wallet[0].balance);

    if (req.body.option == "1") {
      _value += parseInt(req.body.value);
    } else {
      _value -= parseInt(req.body.value);
    }

    if (_value < 0) _value = 0;
    db.update("wallets", "id", req.body.wallet_id, { balance: _value });

    let date = new Date();
    let dbHistory = {
      id: nanoidNumber(),
      id_wallet: adWallet[0].id,
      id_dest: req.body.wallet_id,
      value: req.body.value,
      date: `${date.getDate() + 1}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`,

      content: `Change to ${req.body.wallet_id}     ${
        req.body.option == 1 ? "+" : "-"
      }${req.body.value} VND`,
    };
    db.add("history", dbHistory);

    let dbHistory2 = {
      id: nanoidNumber(),
      id_wallet: req.body.wallet_id,
      id_dest: adWallet[0].id,
      value: req.body.value,
      date: `${date.getDate() + 1}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`,

      content: `Change from admin     ${req.body.option == 1 ? "+" : "-"}${
        req.body.value
      } VND`,
    };
    db.add("history", dbHistory2);
    res.redirect("/manager");
  }

  async history(req, res) {
    if (req.session.token) {
      let user = await db.get("users", "token", req.session.token);

      let wallet = await db.get("wallets", "user_id", user[0].id);

      let history = await db.get("history", "id_wallet", wallet[0].id);

      res.render("home", { user: user[0], menu: 3, history: history });
    } else {
      res.render("login", { out: true });
    }
  }

  async password(req, res) {
    if (req.session.token) {
      let user = await db.get("users", "token", req.session.token);

      res.render("home", { user: user[0], menu: 4 });
    } else {
      res.render("login", { out: true });
    }
  }

  async changePassword(req, res) {
    if (req.session.token) {
      let user = await db.get("users", "token", req.session.token);

      if (
        req.body.old_password == "" ||
        req.body.new_password == "" ||
        req.body.conofirm_password == ""
      ) {
        res.render("home", { user: user[0], menu: 4, fail: 1 });
        return;
      } else {
        let _oldPass = md5(req.body.old_password);
        if (
          req.body.new_password != req.body.confirm_password ||
          user[0].password != _oldPass
        ) {
          res.render("home", { user: user[0], menu: 4, fail: 1 });
          return;
        } else {
          let newPass = md5(req.body.new_password);
          db.update("users", "token", req.session.token, { password: newPass });
          res.render("home", { user: user[0], menu: 4, success: 1 });
        }
      }
    } else {
      res.render("login", { out: true });
    }
  }
}

module.exports = new SiteController();
