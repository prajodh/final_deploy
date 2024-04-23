const { StatusCodes } = require("http-status-codes");
const OpenAI = require("openai");
require("dotenv").config()
const fs = require('fs');
const { NlpManager } = require('node-nlp');
const data = fs.readFileSync('model.nlp', 'utf8');
const manager = new NlpManager();
manager.import(data);



const chatbot = async (req, res) => {
    console.log(process.env.OPENAI_API_KEY)
     const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
     });

    const message = [];
    message.push(req.body.message)
    const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: message[0]  }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);

}    

const chatbot_2 = async (req, res) => {
  let response = await manager.process('en', req.body.message);
  if (response){
  return res.status(StatusCodes.OK).json({message:"success",data:response.answer, status_code:StatusCodes.OK})
  }
  
  return res.status(StatusCodes.OK).json({message:"success",data:"im not built to answer these question please contact our customer service rep for more details ph no: 9302153905", status_code:StatusCodes.OK})
}
module.exports = { chatbot, chatbot_2 };

