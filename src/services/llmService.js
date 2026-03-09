// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.AIzaSyBrjoaOrb1uZMMbUd8IEey4Z2DjoOLxaxI);

// exports.summarizeText = async (text) => {

//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   const prompt = `
// Summarize the following text into 3-6 bullet points:

// ${text}
// `;

//   const result = await model.generateContent(prompt);

//   const response = result.response.text();

//   return response;

// };


const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.summarizeText = async (text) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `Summarize the following text into 3-6 bullet points:\n\n${text}`;

  const result = await model.generateContent(prompt);

  const response = await result.response;

  return response.text();
};