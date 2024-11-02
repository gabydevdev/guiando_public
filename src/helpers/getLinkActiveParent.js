// src/helpers/getLinkActiveParent.js
const Handlebars = require('handlebars');

module.exports = (block, pageUrl, logical = true) => {
    const isActive = block.items.some((item) => item.url === pageUrl) || block.expanded;
    return logical ? isActive : (isActive ? 'open' : 'closed');
};
