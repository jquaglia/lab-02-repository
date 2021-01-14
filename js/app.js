'use strict';

let creatures = [];
let creatureKeywords = [];
const pageOneLink = 'data/page-1.json';
const pageTwoLink = 'data/page-2.json';

function Creatures(title, url, description, keyword, horns) {
  this.title = title;
  this.image_url = url;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
}

Creatures.prototype.render = function () {
  let $templateClone = $('#photo-template').html();
  const object = this;

  const renderHtml = $(`<li class="${this.keyword} ${this.horns}">${Mustache.render($templateClone, object)}</li>`);
  $('ul').append(renderHtml);
};

const dropDown = keyword => {
  const $menu = $(`<option value = "${keyword}">${keyword}</option>`);
  $('select').append($menu);
};

const updatePageData = url => {
  $.ajax(url).then(creaturesJson => {

    creaturesJson.forEach(creature => {
      creatures.push(new Creatures(creature.title, creature.image_url, creature.description, creature.keyword, creature.horns));
    });

    sortFunction('title');

    creatures.forEach(creature => {
      if (!creatureKeywords.includes(creature.keyword)) {
        creatureKeywords.push(creature.keyword);
      }
    });

    creatureKeywords.forEach(keyword => {
      dropDown(keyword);
    });
  });
};

updatePageData(pageOneLink);

$('form').on('change', () => {
  if ($('#sort-alphabet').is(':checked')) {
    sortFunction('title'); // Sorting by Title before they load
  } else if ($('#sort-horns').is(':checked')) {
    sortFunction('horns');
  }
});

const sortFunction = ((property) => {
  console.log(property);
  creatures.sort((left, right) => {
    console.log(left[property]);
    if (left[property] > right[property]) {
      return 1;
    } else if (left[property] < right[property]) {
      return -1;
    } else {
      return 0;
    }
  });

  $('li').remove();
  creatures.forEach(creature => {
    creature.render();
  });
});

$('select').on('change', () => {
  const value = $('select').val();
  $('li').hide();
  $(`.${value}`).show();
});

$('#button-1').on('click', () => {
  $('li').remove();
  $('option').not(':first').remove();
  creatures = [];
  creatureKeywords = [];
  updatePageData(pageOneLink);
});

$('#button-2').on('click', () => {
  $('li').remove();
  $('option').not(':first').remove();
  creatures = [];
  creatureKeywords = [];
  updatePageData(pageTwoLink);
});


