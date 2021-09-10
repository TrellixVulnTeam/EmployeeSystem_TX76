const Employee = require("../models/Employee");

exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;



  try {
    const employees = await Employee.find({}).skip((perPage * page) - perPage).limit(limit);
    
    const count = await Employee.find({}).countDocuments();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("employees", {
    employees: employees,
      numberOfPages: numberOfPages,
      currentPage: page
    });
  } catch (e) {
    res.status(404).send({ message: "Could not list any employee" });
  }
};

exports.create = async (req, res) => {

  try {
    const employee = new Employee({ name: req.body.name, email: req.body.email, empdate: req.body.empdate, role: req.body.role, description: req.body.description, position: req.body.position, phone: req.body.phone });
    await employee.save();
    res.redirect('/')
  } catch (e) {
    if (e.errors) {
      console.log('here are our errors');
      console.log(e.errors);
      res.render('create-employee', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Employee.findByIdAndRemove(id);
    res.redirect("/employees");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findById(id);
    res.render('edit-employee', { employee: employee, id: id, errors:{} });
  } catch (e) {
    res.status(404).send({
      message: `couldn't find employee ${id}`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employee.updateOne({ _id: id }, req.body);
    res.redirect('/employees/?message=employee has been updated');
  } catch (e) {
    res.status(404).send({
      message: `couldn't find employee ${id}.`,
    });
  }
};

