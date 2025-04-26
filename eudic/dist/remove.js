"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDictionariesForArray = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
// Get dirname equivalent in ESM
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const PUBLIC_DICTS_PATH = path_1.default.resolve(__dirname, '../public/dicts');
// Function to delete dictionary JSON files for a specified array
async function deleteDictionariesForArray(dictionaries, arrayName) {
    try {
        // Extract URLs directly from the passed array object
        const dictionaryUrls = dictionaries
            .map((dict) => dict.url)
            .filter((url) => !!url && url.startsWith('/dicts/'))
            .map((url) => url.replace('/dicts/', ''));
        if (dictionaryUrls.length === 0) {
            console.log(`No dictionary URLs found to delete for ${arrayName}.`);
            return { count: 0, deletedFiles: [] };
        }
        console.log(`Found ${dictionaryUrls.length} dictionary files to delete for ${arrayName}...`);
        // Delete each file
        const deletedFiles = [];
        for (const url of dictionaryUrls) {
            try {
                const filePath = path_1.default.join(PUBLIC_DICTS_PATH, url);
                await fs_1.promises.access(filePath); // Check if file exists
                await fs_1.promises.unlink(filePath); // Delete the file
                deletedFiles.push(url);
                console.log(`Deleted: ${filePath}`);
            }
            catch (error) {
                // Log if the file doesn't exist or other error occurs
                if (error instanceof Error && error.code === 'ENOENT') {
                    console.log(`Skipped: ${url} (File not found)`);
                }
                else {
                    console.error(`Error deleting ${url}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        console.log('count', deletedFiles.length, deletedFiles);
        return { count: deletedFiles.length, deletedFiles };
    }
    catch (error) {
        console.error(`Error deleting dictionary files`, error instanceof Error ? error.message : String(error));
        return { count: 0, deletedFiles: [] };
    }
}
exports.deleteDictionariesForArray = deleteDictionariesForArray;
