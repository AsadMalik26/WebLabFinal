var express = require("express");
var router = express.Router();
var productModal = require("../modals/productModal");

//set up multer for storing uploaded files
var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });
//above - image storing in db resources - in process

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let products = await productModal.find();
  var i = 1;
  res.render("products/list", { title: "Products List", products, i });
});
//store data
router.get("/add", async function (req, res, next) {
  res.render("products/add");
});
router.post("/add", async function (req, res, next) {
  let product = new productModal();
  product.name = req.body.name;
  product.details = req.body.details;
  await product.save();
  res.redirect("/products");
  // res.send("I am in products.js");
});

router.get("/delete/:id", async (req, res, nexy) => {
  let product = await productModal.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});
router.get("/edit/:id", async function (req, res, nexy) {
  let product = await productModal.findById(req.params.id);
  console.log("editing");
  res.render("products/edit", { product });
});
router.post("/edit/:id", async function (req, res, next) {
  let product = await productModal.findById(req.params.id);
  product.name = req.body.name;
  product.details = req.body.details;
  console.log("saving");
  await product.save();
  res.redirect("/products");
});

module.exports = router;
