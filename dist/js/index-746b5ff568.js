$(function() {
    $.ajax({
        url: '/api/city',
        dataType: 'json',
        success: render
    })
})

function render(data) {
    console.log(typeof data);
    var citytitle = '';
    var citycont = '';
    $.each(data, function(i, v) {
        citytitle += `<span>${i}</span>`;
        citycont += `<h2>${i}</h2><ul>`;
        $.each(v.match(/[\u4e00-\u9fa5]+/g), function(i, v) {
            citycont += `<li>${v}</li>`;
        });
        citycont += `</ul>`;
    });
    $('.city-bar').append(citytitle);
    $('.city-cont').append(citycont);
}