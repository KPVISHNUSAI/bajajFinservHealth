const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const cors = require('cors');
const mime = require('mime-types');
const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const isValidBase64File = (base64String) => {
    if (!base64String) return false;
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    return !!matches;
};

const getFileSizeInKB = (base64String) => {
    if (!base64String) return 0;
    const fileBuffer = Buffer.from(base64String, 'base64');
    return Math.ceil(fileBuffer.length / 1024);
};

app.post("/bfhl", async (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid input data: 'data' must be an array" });
        }

        const user_id = "KAMSALAPALLAVALI VISHNU SAI_11112003"; 
        const email = "kk4563@srmist.edu.in"; 
        const roll_number = "21110003011135";

        // Filter numbers and alphabets correctly
        const numbers = data.filter(item => typeof item === 'number' || (!isNaN(item) && typeof item === 'string' && item.trim() !== ""));
        const alphabets = data.filter(item => typeof item === 'string' && /^[a-zA-Z]$/.test(item)); 
        const lowercaseAlphabets = alphabets.filter(char => /[a-z]/.test(char));
        const highest_lowercase_alphabet = lowercaseAlphabets.length ? [lowercaseAlphabets.sort().reverse()[0]] : [];

        let file_valid = false;
        let file_mime_type = "";
        let file_size_kb = 0;

        // Validate base64 file
        if (file_b64) {
            file_valid = isValidBase64File(file_b64);
            if (file_valid) {
                const mimeTypeMatch = file_b64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                file_mime_type = mimeTypeMatch ? mimeTypeMatch[1] : "";
                file_size_kb = getFileSizeInKB(file_b64.split(',')[1]);
            }
        }

        return res.json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highest_lowercase_alphabet.length ? highest_lowercase_alphabet : [],
            file_valid,
            file_mime_type,
            file_size_kb
        });
    } catch (error) {
        return res.status(500).json({ is_success: false, message: "An error occurred", error: error.message });
    }
});

app.get("/bfhl", async (req, res) => {
    return res.json({ operation_code: 1 });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});