import mongoose from "mongoose";
import dotenv from "dotenv";
import MockTest from "./model/mocktest.js";

dotenv.config();

const questions = [
  {
    title: "Cell Biology Fundamentals",
    subject: "Biotech",
    topic: "Cell Biology",
    duration: 30,
    questions: [
      {
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        correctAnswer: "Mitochondria"
      }
    ]
  },
  {
    title: "Genetics Quiz 1",
    subject: "Biotech",
    topic: "Genetics",
    duration: 20,
    questions: [
      {
        question: "Who is the father of genetics?",
        options: ["Charles Darwin", "Gregor Mendel", "Watson and Crick", "Lamarck"],
        correctAnswer: "Gregor Mendel"
      }
    ]
  },
  {
    title: "C Programming Basics",
    subject: "BCA",
    topic: "Programming Languages",
    duration: 45,
    questions: [
      {
        question: "Which keyword is used to return a value from a function in C?",
        options: ["back", "exit", "return", "send"],
        correctAnswer: "return"
      }
    ]
  },
  {
    title: "DBMS Introduction",
    subject: "BCA",
    topic: "Logical Subjects",
    duration: 30,
    questions: [
      {
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Query Language", "Sequential Query Language", "Standard Query Language"],
        correctAnswer: "Structured Query Language"
      }
    ]
  },
  {
    title: "Principles of Management Test",
    subject: "BBA",
    topic: "Management & Strategy",
    duration: 40,
    questions: [
      {
        question: "How many principles of management were given by Henri Fayol?",
        options: ["10", "12", "14", "16"],
        correctAnswer: "14"
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/monitor-lab");
    console.log("Connected to MongoDB...");

    // Clear existing tests to ensure fresh data with topics
    await MockTest.deleteMany({});

    await MockTest.insertMany(questions);
    console.log("Mock tests seeded successfully with topics!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
