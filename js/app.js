'use strict';
const creatureKeywords = [];

function Creatures(title, url, description, keyword, horns) {
  this.title = title;
  this.image_url = url;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
}

Creatures.prototype.render = function () {
  let $templateClone = $('#photo-template').html();
  $templateClone = $(`<li class = "${this.keyword}">${$templateClone}</li>`);

  const $h2 = $templateClone.find('h2');
  $h2.text(this.title);

  const $img = $templateClone.find('img');
  $img.attr('src', this.image_url);
  $img.attr('alt', this.description);

  $templateClone.find('p').text(this.description);
  $('ul').append($templateClone);
};

const dropDown = keyword => {
  const $menu = $(`<option value = "${keyword}">${keyword}</option>`);
  $('select').append($menu);
};

$.ajax('/data/page-1.json').then(creaturesJson => {
  const creatures = [];

  creaturesJson.forEach(creature => {
    creatures.push(new Creatures(creature.title, creature.image_url, creature.description, creature.keyword, creature.horns));
  });

  creatures.forEach(creature => {
    if (!creatureKeywords.includes(creature.keyword)) {
      creatureKeywords.push(creature.keyword);
    }
  });

  creatures.forEach(creature => {
    creature.render();
  });

  creatureKeywords.forEach(keyword => {
    dropDown(keyword);
  });

});

$('select').on('change', () => {
  let value = $('select').val();
  $('li').hide();
  $(`.${value}`).show();
});

