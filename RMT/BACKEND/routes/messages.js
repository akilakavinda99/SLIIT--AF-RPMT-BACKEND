const router = require("express").Router();
const Messages = require("../models/messages")

router.route("/add/:id").post(async (req, res) => {
  const RoomID = req.params.id;
  const chatMeassages = req.body.msg;

  // console.log(chatMeassages);
  // console.log(RoomID);

  // console.log(req.body);

  const newMessages = new Messages({
    message: [req.body.msg],
    roomId: req.params.id,
  });

  // console.log(newMessages);

  await Messages.findOne({ roomId: RoomID }).then(async (room) => {
    if (room) {
      // console.log(room);
      const newChatMessage = {
        message: chatMeassages,
      };
      await Messages.findOneAndUpdate(
        { roomId: RoomID },

        { $push: { message: chatMeassages } }
      )
        .then(() => {
          res.status(200).send("SUccess");
          //console.log("Succssss");
        })
        .catch((errr) => {
          console.log(errr);
        });
    } else {
      newMessages
        .save()
        .then(() => {
          console.log("Success new message");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

router.route("/get/:id").get(async (req, res) => {
  const RoomID = req.params.id;
  //console.log(RoomID);

  await Messages.findOne({roomId: RoomID}).then((msg) => {
    // console.log(msg)
    res.status(200).send({ status: "message data fetched.", messages: msg });

  }).catch((err) => {
    console.log(err.message);
    res.status(500).send({ status: "Error with fetching data" });
  });
});

module.exports = router;
