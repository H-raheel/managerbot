const tools=[
    {
      type: "function",
      function: {
        name: "CheckTasks",
        description:
          "Find if employee has any tasks due in future and assign it to them.",
        parameters: {
          type: "object",
          properties: {
            employeeName: {
              type: "string",
            },
          },
          required: ["employeeName"],
        },
      },
    },
  ];
  
  module.exports = {tools};