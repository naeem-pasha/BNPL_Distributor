const { Router } = require("express");
const {
  createDistributer,
  loginDistributer,
  approvedRequest,
  allRequest,
  sendAutherizedToUser,
  sendInvoiceToUser,
  updateDate,
  acceptDelivery,
  sendDeliveryConfirmationToUser,
  getDistributerDetail,
} = require("../controller/request.control");
const authMiddleware = require("../middleware/authmiddleware");

const route = Router();

route.post("/create-distributer", createDistributer);

route.post("/login", loginDistributer);

route.post("/aprove", approvedRequest);

route.get("/allrequest", authMiddleware, allRequest);

route.put("/update-date/:id", updateDate);

route.put("/send-autherized-user/:id", sendAutherizedToUser);

route.put("/send-invoice-user/:id", sendInvoiceToUser);

route.put("/send-delivery-letter-to-user/:id", sendDeliveryConfirmationToUser);

route.put("/user-accept-delivery/:id", acceptDelivery);

route.get("/get-distributer-detail/:id", getDistributerDetail);

module.exports = route;
