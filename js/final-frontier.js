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
    var content = document.getElementById('content')
    
    btn.addEventListener('click', function () {
        articleContent.classList.remove('expanded')
        readMoreBtn.classList.remove('hide')
        btn.classList.add('hide')
        content.classList.remove('expanded')
    })
})

document.querySelectorAll('.read-more').forEach((btn) => {
    var articleId = btn.dataset.articleId
    var articleContent = document.getElementById(articleId)
    var closeBtn = document.getElementById(`close-${articleId}`)
    var content = document.getElementById('content')
    
    btn.addEventListener('click', function () {
        articleContent.classList.add('expanded')
        closeBtn.classList.remove('hide')
        btn.classList.add('hide')
        content.classList.add('expanded')
    })
})


document.querySelectorAll('.close-gallery').forEach((btn) => {
    var galleryId = btn.dataset.galleryId
    var galleryContent = document.getElementById(galleryId)
    var seeGalleryBtn = document.getElementById(`see-gallery-${galleryId}`)
    var content = document.getElementById('content')
    
    btn.addEventListener('click', function () {
        galleryContent.classList.remove('expanded')
        seeGalleryBtn.classList.remove('hide')
        btn.classList.add('hide')
        content.classList.remove('expanded')
    })
})

document.querySelectorAll('.see-gallery').forEach((btn) => {
    var galleryId = btn.dataset.galleryId
    var galleryContent = document.getElementById(galleryId)
    var closeGalleryBtn = document.getElementById(`close-${galleryId}`)
    var content = document.getElementById('content')
    
    btn.addEventListener('click', function () {
        galleryContent.classList.add('expanded')
        closeGalleryBtn.classList.remove('hide')
        btn.classList.add('hide')
        content.classList.add('expanded')
    })
})
