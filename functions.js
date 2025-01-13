const fs = require('fs');
const path = require('path');

async function CheckTasks(employeeName) {
    const tasksFilePath = path.join(__dirname, "tasks.json");
    const tasksData = JSON.parse(fs.readFileSync(tasksFilePath, "utf8"));
  
    const currentDate = new Date();
  
    const futureTasks = tasksData.tasks.filter(
      (task) =>
        task.employeeName === employeeName &&
        new Date(task.deadline) > currentDate
    );
  
    if (futureTasks.length > 0) {
    
      return {
        message: `Tasks for ${employeeName} with future deadlines:`,
        tasks: futureTasks.map((task) => ({
          task
        })),
      };
    } else {
      return {
        message: `No tasks found for ${employeeName} with future deadlines.`,
        tasks: [],
      };
    }
  }

module.exports = { CheckTasks };