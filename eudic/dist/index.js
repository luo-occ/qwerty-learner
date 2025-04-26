"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
// Get dirname equivalent in ESM
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
// Configuration
const CUSTOM_DICT_PATH = path_1.default.join(__dirname, '../public/dicts/my-custom-dict.json');
// Function to fetch words from Eudic API
async function fetchWordsFromEudic(apiUrl, apiKey) {
    try {
        if (!apiUrl || !apiKey) {
            console.error('Eudic API URL or API key is not configured');
            return null;
        }
        // This is a placeholder - you'll need to replace with actual Eudic API endpoints and parameters
        const response = await axios_1.default.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        // Process the response based on Eudic's API structure
        // This is an example - adjust according to the actual API response format
        const words = response.data.words.map((word) => ({
            name: word.term,
            trans: [word.definition],
        }));
        return words;
    }
    catch (error) {
        console.error('Error fetching words from Eudic:', error instanceof Error ? error.message : String(error));
        return null;
    }
}
// Function to update custom dictionary
async function updateCustomDictionary(newWords) {
    try {
        // Read existing dictionary
        let existingDict = [];
        try {
            const data = await fs_1.promises.readFile(CUSTOM_DICT_PATH, 'utf8');
            existingDict = JSON.parse(data);
        }
        catch (error) {
            // If file doesn't exist or is invalid, start with empty array
            console.log('Starting with empty dictionary');
        }
        // Add new words (avoiding duplicates)
        const existingTerms = new Set(existingDict.map((word) => word.name));
        const wordsToAdd = newWords.filter((word) => !existingTerms.has(word.name));
        const updatedDict = [...existingDict, ...wordsToAdd];
        // Write updated dictionary to file
        await fs_1.promises.writeFile(CUSTOM_DICT_PATH, JSON.stringify(updatedDict, null, 2), 'utf8');
        return {
            totalWords: updatedDict.length,
            newWordsAdded: wordsToAdd.length,
        };
    }
    catch (error) {
        console.error('Error updating custom dictionary:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
// Serverless function handler for Vercel
async function handler(req, res) {
    // Get API credentials from environment variables
    const apiUrl = process.env.EUDIC_API_URL;
    const apiKey = process.env.EUDIC_API_KEY;
    if (!apiUrl || !apiKey) {
        return res.status(500).json({
            success: false,
            message: 'API credentials not configured',
        });
    }
    try {
        console.log('Running dictionary update...');
        const newWords = await fetchWordsFromEudic(apiUrl, apiKey);
        if (!newWords) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch words from Eudic',
            });
        }
        const result = await updateCustomDictionary(newWords);
        return res.status(200).json({
            success: true,
            message: `Dictionary updated successfully. Total words: ${result.totalWords}, New words added: ${result.newWordsAdded}`,
            ...result,
        });
    }
    catch (error) {
        console.error('Error updating dictionary:', error instanceof Error ? error.message : String(error));
        return res.status(500).json({
            success: false,
            message: `Error updating dictionary: ${error instanceof Error ? error.message : String(error)}`,
        });
    }
}
exports.default = handler;
