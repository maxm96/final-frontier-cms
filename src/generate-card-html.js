/** @module generateCardHTML 
 * Generates the appropriate HTML for the supplied card data 
 * @param {object} cardData - An object describing a card
 * @returns {string} the generated HTML 
 */
module.exports = function generateCardHTML(cardData) {
  switch (cardData.type) {
    case 'audio':
      return generateAudioCardHTML(cardData)
    case 'article':
      return generateArticleCardHTML(cardData)
    case 'gallery':
      return generateGalleryCardHTML(cardData)
    case 'video':
      return generateVideoCardHTML(cardData)
  }
}

/** @function generateAudioCardHTML
 * A helper function to generate audio card HTML 
 * @param {object} cardData - the audio card data 
 * @returns {string} the generated html 
 */
function generateAudioCardHTML(cardData) {
  return `
    <h2 class="card-title">${cardData.title}</h2>
    <audio controls>
      <source src="${cardData.source}" type="audio/mp3">
    </audio>
    <p class="audio-desc">${cardData.description}</p>
  `
}

/** @function generateArticleCardHTML
 * A helper function to generate article card HTML 
 * @param {object} cardData - the article card data 
 * @returns {string} the generated html 
 */
function generateArticleCardHTML(cardData) {
  return `
    <div class="article-content" id="article-${cardData.id}">
      <button class="close hide close-article" id="close-article-${cardData.id}" data-article-id="article-${cardData.id}">
        &times; Close
      </button>
      <h2 class="card-title">${cardData.title}</h2>
      <div class="article-body">${cardData.body}</div>
    </div>
    <div class="card-footer">
      <button class="read-more" id="read-more-article-${cardData.id}" data-article-id="article-${cardData.id}">
        Read More
      </button>
    </div>
  `
}

/** @function generateGalleryCardHTML
 * A helper function to generate gallery card HTML 
 * @param {object} cardData - the gallery card data 
 * @returns {string} the generated html 
 */
function generateGalleryCardHTML(cardData) {
  return `
    <div class="gallery-card">
      <button class="close hide close-gallery" id="close-gallery-${cardData.id}" data-gallery-id="gallery-${cardData.id}">
        &times; Close
      </button>
      <h2 class="card-title">${cardData.title}</h2>
      <div class="gallery-content" id="gallery-${cardData.id}">
        ${cardData.images.map((src, idx) => `<img src="${src}" alt="${idx}" class="gallery-${cardData.id}-image">`).join('')}
        <div class="gallery-desc">${cardData.description}</div>
      </div>
    </div>
    <div class="card-footer">
      <button class="see-gallery" id="see-gallery-gallery-${cardData.id}" data-gallery-id="gallery-${cardData.id}">
        See Gallery
      </button>
    </div>
  `
}

/** @function generateVideoCardHTML
 * A helper function to generate video card HTML 
 * @param {object} cardData - the video card data 
 * @returns {string} the generated html 
 */
function generateVideoCardHTML(cardData) {
  return `
    <h2 class="card-title">${cardData.title}</h2>
    <div class="video-content">
      <video controls>
        <source src="${cardData.source}" type="video/mp4">
      </video>
      <p class="video-desc">${cardData.description}</p>
    </div>
  `
}