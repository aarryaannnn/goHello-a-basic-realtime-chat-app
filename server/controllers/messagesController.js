const msgModel = require("../model/messageModel");

module.exports.addMsg = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await msgModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added successfully" });
    } else {
      return res.json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    next(ex);
    // return res.json({ msg: "Internal server error" });
  }
};
module.exports.getAllMsg = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const msgs = await msgModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectMsgs = msgs.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectMsgs);
  } catch (ex) {
    next(ex);
  }
};
