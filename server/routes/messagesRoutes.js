const { addMsg, getAllMsg } = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/addmsg", addMsg);
router.post("/getallmsgs", getAllMsg);

module.exports = router;
