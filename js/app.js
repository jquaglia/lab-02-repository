'use strict';

function Creatures (title, url, description, keyword, horns){
  this.title = title;
  this.image_url = url;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
}

Creatures.prototype.render = function(){
  let $templateClone = $('#photo-template').html();
  $templateClone = $(`<li>${$templateClone}</li>`);
  // const $template = $template.find('template');
  // $template.replaceWith('<li></li>');
  // console.log($templateClone);
  const $h2 = $templateClone.find('h2');
  $h2.text(this.title);
  const $img = $templateClone.find('img');
  $img.attr('src', this.image_url);
  $img.attr('alt', this.description);

  $templateClone.find('p').text(this.description);
  $('ul').append($templateClone);

};


$.ajax('/data/page-1.json').then(creaturesJson => {
  const creatures = [];
  creaturesJson.forEach(creature => {
    creatures.push(new Creatures(creature.title, creature.image_url, creature.description));
  });
  console.log(creatures);

  creatures.forEach( creature => {
    creature.render();
  });


});
