const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeesSchema = new Schema(
  {
    phone: {type: String, required:[true, "please enter phone"]},
    role: {type: String, required:[true, "please enter role"]},
    description: {type: String, required:[true, "please enter description"]},
    name: {type: String, required:[true, "please enter name"]},
    empdate: {type: String, required:[true, "please enter empdate"]},
    email: {type: String, required:[true, "please enter email"]},
    position: {type: String, required:[true, "please enter position"]},
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employees", employeesSchema);
