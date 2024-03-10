import logo from "./logo.svg";
import "./App.css";
import OpenAI from "openai";
// Import React and Material UI components
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  InputLabel,
} from "@mui/material";


const openai = new OpenAI({
  apiKey: '', // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true,
});
// Define a custom component for the form

// Define a custom component for the form
const Form = () => {
  // Use state hooks to store the values of the text fields
  const [major, setMajor] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [skills, setSkills] = useState("");
  const [cv, setCV] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Define a function that takes two parameters: major and industry
  function createSystemPrompt(major, industry) {
    // Use template literals to create a prompt string with the parameters
    let prompt = `Create a resume tailored to ${major} and ${industry}.
The resume should be concise, and focus on matching the job description provided.
Make sure it stands out while accurately reflecting the individual's skills and experiences.
Honesty is key; only include skills and experiences that the individual actually possesses.
All results should be returned in JSON properly formatted by resume section`;
    // Return the prompt string
    return prompt;
  }
  function createUserPromt(objective, skills, jobTitle, jobDescription) {
    let q1 = `
    I'm looking to create a tailored resume for an ${jobTitle} role based on a specific job description here:
    ${jobDescription} 
    My objective is to ${objective}.
    The resume should focus on matching the job's requirements and qualifications. Over the next five prompts, I will provide details for the Objective, Skills, Work Experience, Education, and Additional Qualifications sections. 
    Please generate concise and relevant content for each section.
    For this prompt please only generate the objective!!`;
    // Use template literals to create a prompt string with the parameters
    return q1;
  }

  let q1 = createUserPromt(objective, skills, jobTitle, jobDescription);
  let q2 = `I have the following skills: ${skills}. please based on job description, generate a relevant content for the skills section of the resume.`; 
  const processForm = async () => {
    let systemPrompt = createSystemPrompt(major, industry);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: q1 },
      ],
      temperature: 0.3,
      max_tokens: 2500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log(response.choices[0].message.content);
    let objective = response.choices[0].message.content.trim();

    const response2 = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: q1 },
        { role: "assistant", content:objective},
        { role: "user", content: q2 }
      ],
      temperature: 0.3,
      max_tokens: 2500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log(response2.choices[0].message.content);
    const skills = response2.choices[0].message.content.trim();
    const result = {
       objective,
      skills
    }

    setCV(result);
  };

  // Define a function to handle the form submission
  const handleSubmit = (e) => {
    // Prevent the default browser behavior
    e.preventDefault();
    // Display the values in the console
    console.log("major:", major);
    console.log("industry:", industry);
    console.log("objective:", objective);
    console.log("skills:", skills);

    processForm();
    // Clear the text fields
    setMajor("");
    setIndustry("");
    setObjective("");
    setSkills("");
    setJobTitle("");
    setJobDescription("");
  };

  // Return the JSX code for the form
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <InputLabel>Major</InputLabel>
          <TextField
            label="Major"
            variant="outlined"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
          />
        </div>
        <div>
          <InputLabel>Industry</InputLabel>
          <TextField
            label="Industry"
            variant="outlined"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
          />
        </div>
        <div>
          <InputLabel>Objective</InputLabel>
          <TextField
            label="Objective"
            variant="outlined"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            required
          />
        </div>
        <div>
          <InputLabel>Skills</InputLabel>
          <TextField
            label="Skills"
            variant="outlined"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <div>
          <InputLabel>Job Title</InputLabel>
          <TextField
            label="Job Title"
            variant="outlined"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div>
          <InputLabel>Job Description</InputLabel>
          <TextField
            label="Job Description"
            variant="outlined"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      <div className="response">
        <Typography variant="body1">
          {JSON.stringify(cv, null, 2)}
        </Typography>
       
      </div>
    </div>
  );
};

// Define the main component for the app
const App = () => {
  // Return the JSX code for the app
  return (
    <Container>
      <Typography variant="h4">React Form with Material UI</Typography>
      <Form />
    </Container>
  );
};

// Export the app component
export default App;
