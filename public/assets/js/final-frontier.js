/** final-frontier.js
 * JavaScript for the final frontier CMS app 
 * 
 * Place your custom JavaScript in this document 
 */

"use strict";

document.querySelectorAll('.close-article').forEach((btn) => {
    var articleId = btn.dataset.articleId
    var articleContent = document.getElementById(articleId)
    var readMoreBtn = document.getElementById(`read-more-${articleId}`)
    var card = readMoreBtn.closest('.card')
    
    btn.addEventListener('click', function () {
        articleContent.classList.remove('expanded')
        readMoreBtn.classList.remove('hide')
        btn.classList.add('hide')
        card.classList.remove('expanded')
    })
})

document.querySelectorAll('.read-more').forEach((btn) => {
    var articleId = btn.dataset.articleId
    var articleContent = document.getElementById(articleId)
    var closeBtn = document.getElementById(`close-${articleId}`)
    var card = closeBtn.closest('.card')
    
    btn.addEventListener('click', function () {
        articleContent.classList.add('expanded')
        closeBtn.classList.remove('hide')
        btn.classList.add('hide')
        card.classList.add('card')
    })
})


document.querySelectorAll('.close-gallery').forEach((btn) => {
    var galleryId = btn.dataset.galleryId
    var galleryContent = document.getElementById(galleryId)
    var seeGalleryBtn = document.getElementById(`see-gallery-${galleryId}`)
    var card = seeGalleryBtn.closest('.card')
    
    btn.addEventListener('click', function () {
        galleryContent.classList.remove('expanded')
        seeGalleryBtn.classList.remove('hide')
        btn.classList.add('hide')
        card.classList.remove('expanded')
    })
})

document.querySelectorAll('.see-gallery').forEach((btn) => {
    var galleryId = btn.dataset.galleryId
    var galleryContent = document.getElementById(galleryId)
    var closeGalleryBtn = document.getElementById(`close-${galleryId}`)
    var card = closeGalleryBtn.closest('.card')
    
    btn.addEventListener('click', function () {
        galleryContent.classList.add('expanded')
        closeGalleryBtn.classList.remove('hide')
        btn.classList.add('hide')
        card.classList.add('expanded')
    })
})
