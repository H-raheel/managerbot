const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const {CheckTasks} =require('./functions')
const { tools } = require('./tools');


dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const context = [
  {
    role: "system",
    content:
      "You are an employer that checks and assigns tasks to your employees when they request for tasks.Do not assign tasks yourself.",
  },
];


async function callOpenAI() {

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context,
    temperature: 0.0,
    tools: tools,
  });
  console.log(response.choices[0].message)
  //   context.push(response.choices[0].message)
  const FunctionCallMade = response.choices[0].finish_reason == "tool_calls";

  if (FunctionCallMade) {
    const toolCall = response.choices[0].message.tool_calls[0];
   
    const functionName = toolCall.function.name;
    if (functionName == "CheckTasks") {
      const args = JSON.parse(toolCall.function.arguments);
      const tasks = await CheckTasks(args.employeeName);
     
      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: `${JSON.stringify(tasks)}`,
        tool_call_id: toolCall.id,
      });
      const secondCallResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
      });
    //   console.log("second")
  console.log(secondCallResponse.choices[0].message);
    }
  }
  else{
    
    context.push(response.choices[0].message);


  }

 
  

}



process.stdin.addListener("data", async function (input) {
  let userInput = input.toString().trim();
  context.push({
    role: "assistant",
    content: userInput,
  });
  await callOpenAI();
});
