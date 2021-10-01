const Task = require("../models/Task")
const Project = require("../models/Project")
const {validationResult} = require("express-validator")


exports.createTask = async(req, res) =>{
  const Errors = validationResult(req)
  if(!Errors.isEmpty()){
    return res.status(400).json({Errors: Errors.array()})
  }
  try {
    const {project} = req.body
    let projectInfo = await Project.findById(project)
    if(!projectInfo){
      return res.status(400).json({msg: "Project not found"})
    }
    if(projectInfo.userCreator.toString() !== req.userContainer.id){
      return res.status(401).json({msg: "Not Authorized"})
    }
    const taskContainer = new Task(req.body)
    await taskContainer.save()
    res.json({taskContainer})
  } catch (error) {
    console.log(error)
    res.state(500).send("There was a mistake")
  }
}
exports.getTask = async(req, res) =>{
  try{
    const {project} = req.query
    let projectInfo = await Project.findById(project)
    if(!projectInfo){
      return res.status(400).json({msg: "Project not found"})
    }
    if(projectInfo.userCreator.toString() !== req.userContainer.id){
      return res.status(401).json({msg: "Not Authorized"})
    }
    const task = await Task.find({project})
    res.json({task})
  } catch (error) {
    console.log(error)
    res.status(500).sen("There was a Error")
  }
}

exports.updateTask= async(req, res) =>{
  try{
    const {project, name, state} = req.body

    let task = await Task.findById(req.params.id)
    if(!task){
      return res.status(404).json({msg: "Not Found"})
    }

    let projectInfo = await Project.findById(project)
    if(projectInfo.userCreator.toString() !== req.userContainer.id){
      return res.status(401).json({msg: "Not Authorized"})
    }

    let newTask = {}
    newTask.name = name
    newTask.state = state
    task= await Task.findOneAndUpdate({_id: req.params.id}, newTask, {new: true})

    res.json({task})
  } catch (error) {
    console.log(error)
    res.status(500).sen("There was a Error")
  }
}
exports.deleteTask = async(req, res) => {
  try{
    const {project} = req.query
    let task = await Task.findById(req.params.id)
    if(!task){
      return res.status(404).json({msg: "Not Found"})
    }

    let projectInfo = await Project.findById(project)
    if(projectInfo.userCreator.toString() !== req.userContainer.id){
      return res.status(401).json({msg: "Not Authorized"})
    }
    await Task.findOneAndRemove({_id: req.params.id})
    res.json({msg: "Task Deleted"})
  } catch (error) {
    console.log(error)
    res.status(500).sen("There was a Error")
  }
}