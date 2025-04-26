"use strict";
/**
 * Eudic API Module
 * API for interacting with Eudic vocabulary lists
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWordsFromStudyList = exports.addWordsToStudyList = exports.getStudyListWords = exports.deleteStudyListCategory = exports.renameStudyListCategory = exports.addStudyListCategory = exports.getStudyListCategories = void 0;
/**
 * Create headers with auth token for API requests
 */
function createHeaders(contentType = false) {
    const headers = {
        Authorization: process.env.EUDIC_AUTH_TOKEN || '',
    };
    if (contentType) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
}
/**
 * Get all vocabulary lists
 * @param language Language code (en/fr/de/es)
 */
async function getStudyListCategories(language) {
    const response = await fetch(`https://api.frdic.com/api/open/v1/studylist/category?language=${language}`, {
        method: 'GET',
        headers: createHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch study list categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
}
exports.getStudyListCategories = getStudyListCategories;
/**
 * Add a new vocabulary list
 * @param language Language code (en/fr/de/es)
 * @param name Name of the new vocabulary list
 */
async function addStudyListCategory(language, name) {
    const response = await fetch('https://api.frdic.com/api/open/v1/studylist/category', {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify({
            language,
            name,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to add study list category: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
}
exports.addStudyListCategory = addStudyListCategory;
/**
 * Rename a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param name New name for the vocabulary list
 */
async function renameStudyListCategory(id, language, name) {
    const response = await fetch('https://api.frdic.com/api/open/v1/studylist/category', {
        method: 'PATCH',
        headers: createHeaders(true),
        body: JSON.stringify({
            id,
            language,
            name,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to rename study list category: ${response.statusText}`);
    }
    const data = await response.json();
    return data.message;
}
exports.renameStudyListCategory = renameStudyListCategory;
/**
 * Delete a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param name Name of the vocabulary list
 */
async function deleteStudyListCategory(id, language, name) {
    const response = await fetch('https://api.frdic.com/api/open/v1/studylist/category', {
        method: 'DELETE',
        headers: createHeaders(true),
        body: JSON.stringify({
            id,
            language,
            name,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to delete study list category: ${response.statusText}`);
    }
    return;
}
exports.deleteStudyListCategory = deleteStudyListCategory;
/**
 * Get words from a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param page Page number (optional)
 * @param pageSize Number of words per page (optional, default 100)
 */
async function getStudyListWords(id, language, page, pageSize) {
    let url = `https://api.frdic.com/api/open/v1/studylist/words/${id}?language=${language}`;
    if (page !== undefined) {
        url += `&page=${page}`;
    }
    if (pageSize !== undefined) {
        url += `&page_size=${pageSize}`;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch study list words: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
}
exports.getStudyListWords = getStudyListWords;
/**
 * Add words to a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param words Array of words to add
 */
async function addWordsToStudyList(id, language, words) {
    const response = await fetch('https://api.frdic.com/api/open/v1/studylist/words', {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify({
            id,
            language,
            words,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to add words to study list: ${response.statusText}`);
    }
    const data = await response.json();
    return data.message;
}
exports.addWordsToStudyList = addWordsToStudyList;
/**
 * Delete words from a vocabulary list
 * @param id Vocabulary list ID
 * @param language Language code (en/fr/de/es)
 * @param words Array of words to delete
 */
async function deleteWordsFromStudyList(id, language, words) {
    const response = await fetch('https://api.frdic.com/api/open/v1/studylist/words', {
        method: 'DELETE',
        headers: createHeaders(true),
        body: JSON.stringify({
            id,
            language,
            words,
        }),
    });
    if (!response.ok) {
        throw new Error(`Failed to delete words from study list: ${response.statusText}`);
    }
    return;
}
exports.deleteWordsFromStudyList = deleteWordsFromStudyList;
