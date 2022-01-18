class SiteController {
  indexGET(req, res) {
    res.render("login");
  }

  indexPOST(req, res) {
    res.render("login");
  }
}

module.exports = new SiteController();
