const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
let Student = require("../models/student");
let requestSupervisor = require("../models/requestSupervisor.js");
let requestCoSupervisor = require("../models/requestCoSupervisor.js");
let registerResearch = require("../models/registerResearchTopic.js");
let StudentGroup = require("../models/studentGroup");

let Staff = require("../models/staff");

const { protect } = require("../middleware/authMiddleware");
const { protect_student } = require("../middleware/authMiddleware_student");
const { application } = require("express");

const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJWT = require("../middleware/verifyJWT");
const Presentation = require("../models/presentation");

// Add new Student to the system
router.route("/add").post(async (req, res) => {
  const saltPassword = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(req.body.password, saltPassword);

  const name = req.body.name;
  const itNumber = req.body.itNumber;
  const email = req.body.email;
  const password = securePassword;

  const newStudent = new Student({
    name,
    itNumber,
    email,
    password,
  });

  Student.findOne({
    itNumber: itNumber,
    email: email,
  })
    .then((student) => {
      if (!student) {
        newStudent
          .save()
          .then(() => {
            res.json("New Student added to the system.");
          })
          .catch((error) => {
            res.json(error);
            console.log(error);
          });
      } else {
        res.status(409).send({
          error: "User already exists.",
        });
      }
    })
    .catch((err) => {
      res.send("Error: " + err.message);
    });
});

//Group Register
router
  .route("/groupRegister")
  .post(
    [verifyJWT, verifyRoles(ROLES_LIST.admin, ROLES_LIST.Student)],
    async (req, res) => {
      const leaderName = req.body.leaderName;
      const groupName = req.body.groupName;
      const firstMember = req.body.firstMember;
      const secondMember = req.body.secondMember;
      const thirdMember = req.body.thirdMember;

      const IdArray = [leaderName, firstMember, secondMember, thirdMember];
      const newStudentGroup = new StudentGroup({
        leaderName,
        firstMember,
        secondMember,
        thirdMember,
        groupName,
      });

      var existed = true;

      for (let index = 0; index < IdArray.length; index++) {
        console.log(existed);
        if (existed) {
          const element = IdArray[index];
          console.log(element);
          await Student.findOne({
            itNumber: element,
          }).then((student) => {
            console.log("then eka wda");
            if (!student) {
              existed = false;
              res.status(500).send({
                status: "One or more student not registred",
              });
              return;
            }
          });
        } else {
          break;
        }
      }

      for (let index = 0; index < IdArray.length; index++) {
        if (existed) {
          const element = IdArray[index];
          console.log(element);
          await Student.findOne({
            itNumber: element,
            hasGroup: true,
          }).then((student) => {
            console.log("then2 eka wda");
            console.log(student);
            if (student) {
              existed = false;
              res.status(500).send({
                status: "One or more student is in the grp",
              });
              return;
            }
          });
        } else {
          break;
        }
      }

      console.log("sdsd");

      if (existed) {
        StudentGroup.find({
          groupName: groupName,
        })
          .then((group) => {
            console.log(group);
            if (group.length == 0) {
              newStudentGroup
                .save()
                .then(async () => {
                  const studentUpdate = {
                    hasGroup: true,
                    groupId: newStudentGroup._id,
                    groupName: newStudentGroup.groupName,
                  };

                  console.log(studentUpdate);
                  console.log(IdArray);
                  for (let index = 0; index < IdArray.length; index++) {
                    const id = IdArray[index];
                    console.log(id);

                    try {
                      await Student.findOneAndUpdate(
                        { itNumber: id },
                        studentUpdate
                      );
                      console.log("sdsdwwe");
                    } catch (err) {
                      console.log(err);
                    }
                    console.log("sdsff");
                  }
                  console.log("New admin added to the system.");
                  res.status(200).send({
                    status: "New admin added to the system.",
                  });
                })

                .catch((err) => {
                  console.log(err.message);
                  res.status(500).send({
                    error: "Error with adding new admin.",
                  });
                });
            } else {
              res.status(406).send({
                status: "Group name is not available",
              });
              console.log("group name not available");
            }
          })

          .catch((err) => {
            console.log(err.message);
            res.send("Error: " + err.message);
          });
      }
    }
  );

// Supervisor Request
router
  .route("/requestSupervisor")
  .post(
    [verifyJWT, verifyRoles(ROLES_LIST.admin, ROLES_LIST.Student)],
    (req, res) => {
      const topic = req.body.topic;
      const groupId = req.body.groupId;
      const supervisorId = req.body.supervisorId;

      const newRequest = new requestSupervisor({
        topic,
        groupId,
        supervisorId,
      });

      newRequest
        .save()
        .then(async () => {
          const updateGroup = {
            hasRequestedSupervisor: true,
          };
          try {
            await StudentGroup.findByIdAndUpdate(groupId, updateGroup);
          } catch (error) {
            console.log(error);
          }

          res.json("Supervisor request added to the system.");
        })
        .catch((error) => {
          res.json(error);
          console.log(error);
        });
    }
  );

// router.route("/stdlogin").post(async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   console.log(email);

//   Student.findOne({ email, password }, (err, Student) => {
//     console.log(req.body.email);

//     if (Student) {
//       if (email == Student.email) {
//         res.send({ message: "login sucess", Student: Student });
//       } else {
//         res.send({ error: "Wrong Credentials" });
//       }
//     } else {
//       res.send({ error: "not registered" });
//     }
//   });
// });

// router.route("/stdlogin").post(async (req, res) => {

//   const email = req.body.email;

//   const password = req.body.password;

//   console.log(email);

//   await Student.findOne({

//     email: email,

//     password: password,

//   })

//     .then((student) => {

//       if (student) {

//         console.log(student);

//         res.json(student);

//       }

//     })

//     .catch((err) => {

//       console.log(err);

//     });

// });

router.route("/stdlogin").post(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  await Student.findOne({ itNumber: username })
    .then((student) => {
      if (student) {
        // if(bcrypt.compareSync(password, student.password)){
        if (password == student.password) {
          res.json({
            status: "Successfully logged in as a Student.",
            student: student,
          });
        } else {
          res.json({
            status: "Password doesn't match.",
          });
        }
      } else {
        Staff.findOne({ email: username })
          .then((staff) => {
            if (staff) {
              if (bcrypt.compareSync(password, staff.password)) {
                res.json({
                  status: "Successfully logged in as Staff.",
                  staff: staff,
                });
              } else {
                res.json({
                  status: "Password doesn't match.",
                });
              }
            } else {
              res.json({ status: "No user found" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// CoSupervisor Request
router
  .route("/requestCoSupervisor")
  .post(
    [verifyJWT, verifyRoles(ROLES_LIST.admin, ROLES_LIST.Student)],
    (req, res) => {
      const topic = req.body.topic;
      const groupId = req.body.groupId;
      const supervisorId = req.body.supervisorId;

      const newRequest = new requestCoSupervisor({
        topic,
        groupId,
        supervisorId,
      });

      newRequest
        .save()
        .then(async () => {
          const updateGroup = {
            hasRequestedCoSupervisor: true,
          };
          try {
            await StudentGroup.findByIdAndUpdate(groupId, updateGroup);
          } catch (error) {
            console.log(error);
          }

          res.json("Supervisor request added to the system.");
        })
        .catch((error) => {
          res.json(error);
          console.log(error);
        });
    }
  );

//get one students details
router.route("/get/:id").get(verifyJWT, async (req, res) => {
  const id = req.params.id;

  await Student.findById(id)
    .then((student) => {
      res.status(200).send({ status: "student fetched", student });
    })
    .catch((e) => {
      res.status(500).send({ status: "Error" });
    });
});

router
  .route("/delete/:id")
  .delete([verifyJWT, verifyRoles(ROLES_LIST.admin)], async (req, res) => {
    const id = req.params.id;
    const groupID = req.params.groupID;

    await Student.findByIdAndRemove(id)
      .then((student) => {
        StudentGroup.findByIdAndUpdate({});
        res.status(200).send({ status: "student deleted" });
      })
      .catch((e) => {
        res.status(500).send({ status: "Error" });
      });
  });

//get one group details
router.route("/getGroup/:id").get(verifyJWT, async (req, res) => {
  const id = req.params.id;

  await StudentGroup.findById(id)
    .then((student) => {
      res.status(200).send({ status: "Group fetched", student });
    })
    .catch((e) => {
      res.status(500).send({ status: "Error" });
    });
});

//update student details
router
  .route("/update/:id")
  .put(
    [verifyJWT, verifyRoles(ROLES_LIST.admin, ROLES_LIST.Student)],
    async (req, res) => {
      const id = req.params.id;
      const { name, email, password } = req.body;

      const updateStudent = {
        name,
        email,
        password,
      };

      await Student.findByIdAndUpdate(id, updateStudent)
        .then(() => {
          res.status(200).send({ status: "student updated" });
        })
        .catch((e) => {
          res.status(500).send({ status: "Error" });
        });
    }
  );

// Register Research Topic
router.route("/registerResearch").post(verifyJWT, (req, res) => {
  const name = req.body.name;
  const topic = req.body.topic;
  const groupId = req.body.groupId;

  const newRequest = new registerResearch({
    name,
    topic,
    groupId,
  });

  newRequest
    .save()
    .then(() => {
      res.json("Research topic added to the system.");
    })
    .catch((error) => {
      console.log(error);
    });
});

// Get all topics

// router.route("/topics").get((verifyJWT),(req, res) => {
//   registerResearch

router.route("/topics").get(verifyJWT, (req, res) => {
  requestSupervisor
    .find()
    .then((researchtopics) => {
      res.json(researchtopics);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: "Error with listing panels",
      });
    });
});

// Get all students
router
  .route("/")
  .get([verifyJWT, verifyRoles(ROLES_LIST.admin)], (req, res) => {
    Student.find({}, { password: 0 })
      .then((student) => {
        res.json(student);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({
          error: "Error with listing all students",
        });
      });
  });

//Login

router.route("/getStudent/:id").get(verifyJWT, (req, res) => {
  itNumber = req.params.id;

  Student.findOne({
    itNumber: itNumber,
  })
    .then((student) => {
      res.json(student);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.route("/getSupervisorStatus/:id").get(verifyJWT, (req, res) => {
  groupId = req.params.id;

  requestSupervisor
    .findOne({
      groupId: groupId,
    })
    .then((supervisor) => {
      res.json(supervisor);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.route("/getCoSupervisorStatus/:id").get(verifyJWT, (req, res) => {
  groupId = req.params.id;

  requestCoSupervisor
    .findOne({
      groupId: groupId,
    })
    .then((supervisor) => {
      res.json(supervisor);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.route("/submitPresentation").post(verifyJWT, (req, res) => {
  const topic = req.body.topic;
  const video = req.body.video;
  const groupId = req.body.groupId;
  const supervisorId = req.body.supervisorId;
  const submittorId = req.body.submittorId;
  const newPresentation = new Presentation({
    topic,
    video,
    groupId,
    supervisorId,
    submittorId,
  });

  newPresentation
    .save()
    .then(() => {
      res.json("Presentation submitted success");
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
