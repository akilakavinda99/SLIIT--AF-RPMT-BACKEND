const router = require("express").Router();
let Student = require("../models/student");
let requestSupervisor = require("../models/requestSupervisor.js");
let requestCoSupervisor = require("../models/requestCoSupervisor.js");
let registerResearch = require("../models/registerResearchTopic.js");
let StudentGroup = require("../models/studentGroup");

const { protect } = require("../middleware/authMiddleware");
const { protect_student } = require("../middleware/authMiddleware_student");

// Add new Student to the system
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const itNumber = req.body.itNumber;
  const email = req.body.email;
  const password = req.body.password;

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
router.route("/groupRegister").post(async (req, res) => {
  const leaderName = req.body.leaderName;
  const firstMember = req.body.firstMember;
  const secondMember = req.body.secondMember;
  const thirdMember = req.body.thirdMember;

  const IdArray = [leaderName, firstMember, secondMember, thirdMember];
  const newStudentGroup = new StudentGroup({
    leaderName,
    firstMember,
    secondMember,
    thirdMember,
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
    newStudentGroup
      .save()
      .then(async () => {
        const studentUpdate = {
          hasGroup: true,
          groupId: newStudentGroup._id,
        };

        console.log(studentUpdate);
        console.log(IdArray);
        for (let index = 0; index < IdArray.length; index++) {
          const id = IdArray[index];
          console.log(id);

          try {
            await Student.findOneAndUpdate({ itNumber: id }, studentUpdate);
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
      })

      .catch((err) => {
        console.log(err.message);
        res.send("Error: " + err.message);
      });
  }
});

// Supervisor Request
router.route("/requestSupervisor").post(protect_student, (req, res) => {
  const name = req.body.name;
  const requestedDate = req.body.requestedDate;

  const newRequest = new requestSupervisor({
    name,
    requestedDate,
  });

  newRequest
    .save()
    .then(() => {
      res.json("Supervisor request added to the system.");
    })
    .catch((error) => {
      console.log(error);
    });
});

// CoSupervisor Request
router.route("/requestCoSupervisor").post(protect_student, (req, res) => {
  const name = req.body.name;
  const requestedDate = req.body.requestedDate;

  const newRequest = new requestCoSupervisor({
    name,
    requestedDate,
  });

  newRequest
    .save()
    .then(() => {
      res.json("Supervisor request added to the system.");
    })
    .catch((error) => {
      console.log(error);
    });
});

//get one students details
router.route("/get/:id").get(async (req, res) => {
  const id = req.params.id;

  await Student.findById(id)
    .then((student) => {
      res.status(200).send({ status: "student fetched", student });
    })
    .catch((e) => {
      res.status(500).send({ status: "Error" });
    });
});

//get one group details
router.route("/getGroup/:id").get(async (req, res) => {
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
router.route("/update/:id").put(async (req, res) => {
  const id = req.params.id;
  const { name, itNumber, email, password } = req.body;

  const updateStudent = {
    name,
    itNumber,
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
});

// Register Research Topic
router.route("/registerResearch").post((req, res) => {
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

// Get all students
router.route("/").get((req, res) => {
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

module.exports = router;
