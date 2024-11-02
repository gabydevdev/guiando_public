// src/helpers/getLinkActiveState.js
const Handlebars = require('handlebars');

module.exports = (itemUrl, pageUrl) => {
    console.log("itemUrl:", itemUrl);  // Log item URL
    console.log("pageUrl:", pageUrl);  // Log current page URL

    let response = '';
    if (itemUrl === pageUrl) {
        response = ' aria-current="page"';
    }
    if (itemUrl.length > 1 && pageUrl && pageUrl.startsWith(itemUrl)) {
        response += ' data-state="active"';
    }
    return new Handlebars.SafeString(response);
};
