"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_js_1 = require("./api.js");
(0, api_js_1.addStudyListCategory)('en', 'qwerty')
    .then((result) => console.log('Category added:', result))
    .catch((error) => console.error('Error adding category:', error));
