const router = require("express").Router();
const bcrypt = require("bcrypt");
let Staff = require("../models/staff.js");
let ResearchTopic = require("../models/acceptTopics");

const { protect } = require("../middleware/authMiddleware");
const { protect_staff } = require("../middleware/authMiddleware_staff");
const StudentGroup = require("../models/studentGroup.js");
const requestSupervisor = require("../models/requestSupervisor.js");
const requestCoSupervisor = require("../models/requestCoSupervisor.js");
const verifyJWT = require("../middleware/verifyJWT.js");
const ROLES_LIST = require("../config/roles_list.js");
const verifyRoles = require("../middleware/verifyRoles.js");

//Add new staff member to the system
router.route("/add").post(async (req, res) => {
  //console.log(req.body)

  const saltPassword = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(req.body.password, saltPassword);

  const newStaff = new Staff({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    telephone: req.body.telephone,
    researcharea: req.body.researchArea,
    password: securePassword,
    panel: "",
  });

  newStaff
    .save()
    .then(() => {
      res.json("New Staff member added to the system.");
    })
    .catch((error) => {
      res.json(error);
      console.log(error);
    });
});

// Get staff member details
// router.route("/get/:id").get((protect_staff),async(req, res)=> {
router.route("/get/:id").get(verifyJWT, async (req, res) => {
  const staffId = req.params.id;

  await Staff.findById(staffId)
    .then((staff) => {
      res.status(200).send({ status: "Staff member data fetched.", staff });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with fetching data" });
    });
});

//get according to field
router.route("/getToField/:id").get(verifyJWT, async (req, res) => {
  const field = req.params.id;

  await Staff.find({
    researcharea: field,
  })
    .then((staff) => {
      res.status(200).send({ status: "Staff member data fetched.", staff });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "Error with fetching data" });
    });
});

//Update staff member details
router.route("/update/:id").put([(verifyJWT), (verifyRoles(ROLES_LIST.admin, ROLES_LIST.Staff))], async (req, res) => {
  let staffId = req.params.id;

  const updateStaff = {
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    telephone: req.body.telephone,
    researcharea: req.body.researcharea,
    password: req.body.password,
  };

  await Staff.findByIdAndUpdate(staffId, updateStaff)
    .then(() => {
      res.status(200).send({
        status: "Staff member updated.",
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        stauts: "Error with updating data.",
      });
    });
});

// Get all staff
router
  .route("/")
  .get([verifyJWT, verifyRoles(ROLES_LIST.admin)], (req, res) => {
    Staff.find({}, { password: 0 })
      .then((staff) => {
        res.json(staff);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({
          error: "Error with listing all staff",
        });
      });
  });

// Get accepted staff
router.route("/accepted").get(verifyJWT, (req, res) => {
  Staff.find({ isAccepted: true }, { password: 0 })
    .then((staff) => {
      res.json(staff);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        error: "Error with listing staff.",
      });
    });
});

// Get pending staff
router
  .route("/pending")
  .get([verifyJWT, verifyRoles(ROLES_LIST.admin)], (req, res) => {
    Staff.find({ isAccepted: false }, { password: 0 })
      .then((staff) => {
        res.json(staff);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({
          error: "Error with listing staff.",
        });
      });
  });

//fetch allocated group requests for supervisor
router.route("/supervisor/requests/:id").get(async (req, res) => {
  supervisorId = req.params.id;

  await requestSupervisor
    .find({ supervisorId: supervisorId })
    .then((supervisor) => {
      // console.log(supervisor);
      res.status(200).send({ status: "supervisor fetched", supervisor });
    })
    .catch((e) => {
      res.status(500).send({ status: "Error" });
    });
});

////fetch allocated group requests for supervisor
router.route("/cosupervisor/requests/:id").get(async (req, res) => {
  cosupervisorId = req.params.id;

  await requestCoSupervisor
    .find({ supervisorId: cosupervisorId })
    .then((cosupervisor) => {
      // console.log(supervisor);
      res.status(200).send({ status: "cosupervisor fetched", cosupervisor });
    })
    .catch((e) => {
      res.status(500).send({ status: "Error" });
    });
});

// Accept/Reject staff member
router
  .route("/accept-reject/:id")
  .put([verifyJWT, verifyRoles(ROLES_LIST.admin)], async (req, res) => {
    const staffId = req.params.id;
    const acceptStatus = req.body;
    // console.log("id: " + staffId);
    // console.log(acceptStatus);

    if (acceptStatus.isAccepted) {
      await Staff.findByIdAndUpdate(staffId, acceptStatus)
        .then(() => {
          res.status(200).send({ status: "Staff member accepted." });
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500).send({ error: "Error with accepting." });
        });
    } else {
      await Staff.findByIdAndDelete(staffId)
        .then(() => {
          res.status(200).send({ status: "Request rejected." });
        })
        .catch(() => {
          res.status(500).send({ error: "Error with rejecting." });
        });
    }
  });

//Accept Supervisor request
// router
//   .route("/supervisor-accept/:id/:groupId")
//   .put([verifyJWT, verifyRoles(ROLES_LIST.admin)], async (req, res) => {
//     const requestId = req.params.id;
//     const GroupId = req.params.groupId;
//     const supervisorId = req.body.supervisorId;

//     const updateRequestStatus = {
//       supervisorRequestStatus: "Accepted",
//     };

//     await requestSupervisor
//       .findByIdAndUpdate(requestId, updateRequestStatus)
//       .then(async () => {
//         const studentGroup = { supervisorId: supervisorId };
//         await StudentGroup.findByIdAndUpdate(GroupId, studentGroup).then(() => {
//           res.status(200).send({
//             status: "Supervisor request accepted",
//           });
//         });
//       })
//       .catch((err) => {
//         console.log(err.message);

//         res.status(500).send({ error: "Error with accepting." });
//       });
//   } else {
//     await Staff.findByIdAndDelete(staffId)
//       .then(() => {
//         res.status(200).send({ status: "Request rejected." });
//       })
//       .catch(() => {
//         res.status(500).send({ error: "Error with rejecting." });
//       });
//   }
// });

//Accept Supervisor request
router.route("/supervisor-accept/:id/:groupId").put([(verifyJWT), (verifyRoles(ROLES_LIST.Staff))], async (req, res) => {
  const requestId = req.params.id;
  const GroupId = req.params.groupId;
  const supervisorId = req.body.supervisorId;

  const updateRequestStatus = {
    supervisorRequestStatus: "Accepted",
  };

  await requestSupervisor
    .findByIdAndUpdate(requestId, updateRequestStatus)
    .then(async () => {
      const studentGroup = { supervisorId: supervisorId };
      await StudentGroup.findByIdAndUpdate(GroupId, studentGroup).then(() => {
        res.status(200).send({
          status: "Supervisor request accepted",
        })

      });
    });
})

//Reject Supervisor request
router.route("/supervisor-reject/:id/:groupId").put([(verifyJWT), (verifyRoles(ROLES_LIST.Staff))], async (req, res) => {
  const requestId = req.params.id;
  const GroupId = req.params.groupId;

  // console.log(GroupId);
  // console.log(requestId);

  const updateRequestStatus = {
    supervisorRequestStatus: "Rejected",
  };

  await requestSupervisor
    .findByIdAndUpdate(requestId, updateRequestStatus)
    .then(async () => {
      const studentGroup = { hasRequestedSupervisor: false };
      await StudentGroup.findByIdAndUpdate(GroupId, studentGroup)
        .then(() => {
          res.status(200).send({
            status: "Supervisor request rejected",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: "Error with rejecting request",
      })
    })
})

// router
//   .route("/supervisor-reject/:id/:groupId")
//   .put([verifyJWT, verifyRoles(ROLES_LIST.admin)], async (req, res) => {
//     const requestId = req.params.id;
//     const GroupId = req.params.groupId;

//     console.log(GroupId);
//     console.log(requestId);

//     const updateRequestStatus = {
//       supervisorRequestStatus: "Rejected",
//     };

//     await requestSupervisor
//       .findByIdAndUpdate(requestId, updateRequestStatus)
//       .then(async () => {
//         const studentGroup = { hasRequestedSupervisor: false };
//         await StudentGroup.findByIdAndUpdate(GroupId, studentGroup)
//           .then(() => {
//             res.status(200).send({
//               status: "Supervisor request rejected",
//             });
//           })
//           .catch((err) => {
//             console.log(err);
//           });

//         // res.status(200).send({
//         //   status: "Supervisor request rejected"
//         // })
//       })
//       .catch((err) => {
//         console.log(err.message);
//         res.status(500).send({
//           status: "Error with rejecting request",
//         });
//       });
//   });


//Accept Co-Supervisor request
router.route("/cosupervisor-accept/:id/:groupId").put(async (req, res) => {
  const requestId = req.params.id;
  const GroupId = req.params.groupId;
  const supervisorId = req.body.supervisorId;

  const updateRequestStatus = {
    supervisorRequestStatus: "Accepted",
  };

  await requestCoSupervisor
    .findByIdAndUpdate(requestId, updateRequestStatus)
    .then(async () => {
      const studentGroup = { supervisorId: supervisorId };
      await StudentGroup.findByIdAndUpdate(GroupId, studentGroup).then(() => {
        res.status(200).send({
          status: "Co-Supervisor request accepted",
        });
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: "Error with accepting request",
      });
    });
});


//Reject Supervisor request
router.route("/cosupervisor-reject/:id/:groupId").put(async (req, res) => {
  const requestId = req.params.id;
  const GroupId = req.params.groupId;

  // console.log(GroupId);
  // console.log(requestId);

  const updateRequestStatus = {
    supervisorRequestStatus: "Rejected",
  };

  await requestCoSupervisor
    .findByIdAndUpdate(requestId, updateRequestStatus)
    .then(async () => {
      const studentGroup = { hasRequestedSupervisor: false };
      await StudentGroup.findByIdAndUpdate(GroupId, studentGroup)
        .then(() => {
          res.status(200).send({
            status: "Co-Supervisor request rejected",
          });
        })
        .catch((err) => {
          console.log(err);
        });

    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: "Error with rejecting request",
      });
    });
});


// Delete staff member
router.route('/delete/:id').delete([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {
  const staffId = req.params.id
  Staff.findByIdAndDelete(staffId)
    .then(() => {
      res.status(200).send({
        status: "User account deleted."
      })
    })
    .catch((err) => {
      console.log(err.message)
      res.status(500).send({
        error: "Error with deleting admin."
      })
    })
})

module.exports = router
