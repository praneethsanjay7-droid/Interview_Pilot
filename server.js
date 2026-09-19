require("dotenv").config();
const fs=require("fs");
const express = require("express");
const { GoogleGenAI,createUserContent,createPartFromUri } = require("@google/genai");
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");

const connectDB = require("./config/db");
const User = require("./Models/User");
const Interview = require("./Models/Interview");
const PreparationPlan=require("./Models/PreparationPlan");

const app = express();

const PORT = process.env.PORT || 8900;
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "frontend")));
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

});

const upload = multer({
    storage: storage
});


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect("/login.html?info=exists");
        }
        const user = new User({ name, email, password });
        await user.save();
        res.redirect("/dashboard.html");
    } catch (err) {
        console.log(err.message);
        res.redirect("/register.html?error=failed");
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.redirect("/login.html?error=invalid");
        }
        return res.redirect("/dashboard.html");
    } catch (err) {
        console.log(err.message);
        res.redirect("/login.html?error=failed");
    }
});

let uploadedResumePath = null;
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.redirect("/profile.html?error=no_file");
        }

        uploadedResumePath = path.resolve(req.file.path);

        if (!fs.existsSync(uploadedResumePath)) {
            return res.redirect("/profile.html?error=not_found");
        }

        console.log("Resume uploaded:", req.file.originalname);
        res.redirect("/profile.html?status=uploaded");
    } catch (err) {
        console.log(err.message);
        res.redirect("/profile.html?error=failed");
    }
});
app.post("/add-interview", async (req, res) => {
    try {

        const { company, date, round } = req.body;

        const interview = new Interview({
            company,
            date,
            round
        });

        await interview.save();

        res.redirect("/interviews.html");

    } catch (error) {

        console.log(error.message);

        res.status(500).send("Failed to add interview");
    }
});


app.use(express.static(path.join(__dirname, "frontend")));

app.get("/interviews", async (req, res) => {
    try {
        const interviews = await Interview.find()
            .sort({ date: 1 });

        res.json(interviews);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Failed to load interviews"
        });
    }
});

app.get("/next-interview", async (req, res) => {
    try {

        const interview = await Interview.findOne({
            date: { $gte: new Date() }
        }).sort({ date: 1 });

        if (!interview) {
            return res.json(null);
        }

        res.json(interview);

    } catch (error) {

        console.log(error.message);

        res.status(500).json({
            message: "Failed to load next interview"
        });
    }
});


app.get("/create-test-plan", async (req, res) => {
    try {
        const { id, company } = req.query;
        let interview = null;
        if (id) {
            interview = await Interview.findById(id).catch(() => null);
        }
        if (!interview && company) {
            interview = await Interview.findOne({ company: new RegExp("^" + company + "$", "i") });
        }
        if (!interview) {
            interview = await Interview.findOne().sort({ date: 1 });
        }

        if (!interview) {
            return res.redirect("/interviews.html?info=add_interview_first");
        }

        const testPlan = new PreparationPlan({
            interviewId: interview._id,
            company: interview.company,
            plan: `
Interview Preparation Plan

Target Company: ${interview.company}
Round: ${interview.round || "Technical"}

1. Technical Preparation
- Revise core programming concepts relevant to ${interview.company}
- Practice top SQL queries (JOINs, Aggregation, Grouping)
- Revise Data Structures & Algorithm patterns

2. Project Preparation
- Prepare a 2-minute architectural explanation of your projects
- Highlight your individual contribution and technical stack
- Prepare to discuss challenges faced and trade-offs made

3. HR Preparation
- "Tell me about yourself" tailored for ${interview.company}
- Research ${interview.company}'s core products, values, and recent news
- Prepare clear answers for strengths, weaknesses, and career goals

4. Final Preparation
- Conduct a mock technical interview practice
- Review your resume line by line
- Prepare 2 thoughtful questions to ask your interviewer
`
        });

        await testPlan.save();

        res.redirect(`/plan.html?company=${encodeURIComponent(interview.company)}&id=${interview._id}`);
    } catch (error) {
        console.log(error.message);
        res.redirect("/plan.html?error=create_failed");
    }
});
app.get("/plan", async (req, res) => {
    try {
        const { id, company } = req.query;
        let query = {};
        if (id) {
            query = { interviewId: id };
        } else if (company) {
            query = { company: new RegExp("^" + company + "$", "i") };
        }

        let plan = await PreparationPlan.findOne(query).sort({ generatedDate: -1 });

        if (!plan) {
            // Find target interview matching query or latest
            let interview = null;
            if (id) {
                interview = await Interview.findById(id).catch(() => null);
            }
            if (!interview && company) {
                interview = await Interview.findOne({ company: new RegExp("^" + company + "$", "i") });
            }
            if (!interview) {
                interview = await Interview.findOne().sort({ date: 1 });
            }

            if (!interview) {
                return res.json(null);
            }

            // Create customized matching template plan for this company
            plan = new PreparationPlan({
                interviewId: interview._id,
                company: interview.company,
                plan: `
Interview Preparation Plan

Target Company: ${interview.company}
Round: ${interview.round || "Technical"}

1. Technical Preparation
- Revise core programming concepts relevant to ${interview.company}
- Practice top SQL queries (JOINs, Aggregation, Grouping)
- Revise Data Structures & Algorithm patterns

2. Project Preparation
- Prepare a 2-minute architectural explanation of your projects
- Highlight your individual contribution and technical stack
- Prepare to discuss challenges faced and trade-offs made

3. HR Preparation
- "Tell me about yourself" tailored for ${interview.company}
- Research ${interview.company}'s core products, values, and recent news
- Prepare clear answers for strengths, weaknesses, and career goals

4. Final Preparation
- Conduct a mock technical interview practice
- Review your resume line by line
- Prepare 2 thoughtful questions to ask your interviewer
`
            });
            await plan.save();
        }

        res.json(plan);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Failed to load preparation plan"
        });
    }
});


const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

app.get("/test-gemini", async (req, res) => {
    if (!ai) {
        return res.status(503).json({
            success: false,
            error: "Gemini is not configured. Please set GEMINI_API_KEY in your local .env file."
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {
                    role: "user",
                    parts: [{ text: "Say hello to Interview Pilot in one sentence." }],
                },
            ],
        });

        const text = response?.text || response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "Hello from Gemini!";
        res.json({
            success: true,
            model: GEMINI_MODEL,
            message: text
        });
    } catch (err) {
        console.error("Gemini request failed:", err?.message || "Unknown error");
        res.status(500).json({
            success: false,
            error: "Failed to communicate with Gemini AI",
            details: err?.message || "Internal server error"
        });
    }
});


app.get("/generate-plan", async (req, res) => {
    try {
        if (!ai) {
            return res.status(503).json({
                error: "Gemini API key is not configured. Add GEMINI_API_KEY to your local .env file before generating a plan."
            });
        }

        if (!uploadedResumePath) {
            return res.redirect("/profile.html?error=no_resume");
        }

        const { id, company } = req.query;
        let interview = null;
        if (id) {
            interview = await Interview.findById(id).catch(() => null);
        }
        if (!interview && company) {
            interview = await Interview.findOne({ company: new RegExp("^" + company + "$", "i") });
        }
        if (!interview) {
            interview = await Interview.findOne().sort({ date: 1 });
        }

        if (!interview) {
            return res.redirect("/interviews.html?error=no_interview");
        }

        const resumeFile = await ai.files.upload({
            file: uploadedResumePath,
            config: {
                mimeType: "application/pdf"
            }
        });




        const prompt = `
You are an interview preparation assistant.

Analyze the candidate's resume and upcoming interview.

Interview details:

Company: ${interview.company}
Date: ${interview.date}
Round: ${interview.round}

Create a simple personalized interview preparation plan.

Include:

1. Resume strengths relevant to the interview at ${interview.company}
2. Important topics to revise
3. Technical preparation
4. Project preparation
5. HR preparation
6. A day-wise preparation plan
7. Final interview tips

Keep the plan practical and concise.
`;

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: createUserContent([
                createPartFromUri(resumeFile.uri, resumeFile.mimeType),
                prompt
            ])
        });

        const text = response?.text || response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "No response returned";

        const preparationPlan = new PreparationPlan({
            interviewId: interview._id,
            company: interview.company,
            plan: text
        });

        await preparationPlan.save();

        res.redirect(`/plan.html?company=${encodeURIComponent(interview.company)}&id=${interview._id}`);

    } catch (error) {

    console.log("========== GEMINI ERROR ==========");
    console.log(error);
    console.log("==================================");

    res.status(500).send(`
        <h2>Failed to generate preparation plan</h2>
        <pre>${error.message}</pre>
    `);
}
});
app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});