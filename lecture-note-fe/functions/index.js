const { FieldValue } = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();

// Set Gemini API Key: firebase functions:config:set gemini.key="YOUR_API_KEY"
const API_KEY = functions.config().gemini ? functions.config().gemini.key : "";
const genAI = new GoogleGenerativeAI(API_KEY);

const db = admin.firestore();

exports.summarize = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { notes, courseName, weekName } = req.body;
    if (!notes) {
      return res.status(400).send("Missing 'notes' in request body.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert academic assistant.
      Summarize the following lecture notes for the course "${courseName}", week "${weekName}".
      The summary should be concise and highlight the key concepts and learning objectives.
      Also, provide a list of 5-7 important keywords from the notes.

      Notes:
      ---
      ${notes}
      ---

      Output the result in JSON format with two keys: "summary" and "keywords".
      The "summary" should be a string.
      The "keywords" should be an array of strings.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the output to be valid JSON
    const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedResult = JSON.parse(cleanedJson);


    return res.status(200).send(parsedResult);
  } catch (error) {
    console.error("Error summarizing notes:", error);
    return res.status(500).send({ error: "Error summarizing notes." });
  }
});

// Create Note function
exports.createNote = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { userId, courseId, weekId, notes } = req.body;
    if (!userId || !courseId || !weekId || !notes) {
      return res.status(400).send("Missing required fields.");
    }

    const noteRef = await db.collection("notes").add({
      userId,
      courseId,
      weekId,
      notes,
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(201).send({ id: noteRef.id });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).send("Error creating note.");
  }
});

// Get Notes function
exports.getNotes = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { userId, courseId, weekId } = req.query;
    if (!userId || !courseId || !weekId) {
      return res.status(400).send("Missing required query parameters.");
    }

    const notesSnapshot = await db.collection("notes")
      .where("userId", "==", userId)
      .where("courseId", "==", courseId)
      .where("weekId", "==", weekId)
      .orderBy("createdAt", "desc")
      .get();

    const notes = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).send(notes);
  } catch (error) {
    console.error("Error getting notes:", error);
    return res.status(500).send("Error getting notes.");
  }
});
