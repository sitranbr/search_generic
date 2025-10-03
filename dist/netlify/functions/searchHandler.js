// searchHandler.js
function getFullArticleByNumber(articleNumber, data) {
    let fullArticle = null;
    function searchInContent(contentArray) {
        if (!contentArray) return;
        for (let item of contentArray) {
            if (item.type === 'article' && String(item.number) === String(articleNumber)) {
                fullArticle = item;
                break;
            }
            if (item.content && Array.isArray(item.content)) {
                searchInContent(item.content);
                if (fullArticle) break;
            }
        }
    }
    searchInContent(data.content);
    return fullArticle;
}

module.exports = { getFullArticleByNumber };