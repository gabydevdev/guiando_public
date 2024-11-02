// src/helpers/getLinkActiveState.js
const Handlebars = require('handlebars');

module.exports = (itemUrl, pageUrl) => {
    let response = '';
    if (itemUrl === pageUrl) {
        response = ' aria-current="page"';
    }
    if (itemUrl.length > 1 && pageUrl && pageUrl.startsWith(itemUrl)) {
        response += ' data-state="active"';
    }
    return new Handlebars.SafeString(response);
};
