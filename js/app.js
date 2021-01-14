'use strict';

const creatureKeywords = [];
const pageOneLink = 'data/page-1.json';
const pageTwoLink = 'data/page-2.json';
let pageOne = true;

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
    const creatures = [];
    creaturesJson.forEach(creature => {
      creatures.push(new Creatures(creature.title, creature.image_url, creature.description, creature.keyword, creature.horns));
    });

    const sortFunction = ((property) => {
      creatures.sort((left, right) => {
        if (left[property] > right[property]) {
          return 1;
        } else if (left[property] < right[property]) {
          return -1;
        } else {
          return 0;
        }
      });
    });

    sortFunction('title');

    if ($('#sort-alphabet:checked')) {
      sortFunction('title'); // Sorting by Title before they load
    } else if ($('#sort-horns:checked')) {
      sortFunction('horns');
    }

    $('#sort-horns').on('click', () => {
      console.log('this is working');
      sortFunction('horns');
      console.log('this is working 2');
      // sortFunction()
      // if ($('#sort-alphabet')){
      //   console.log('this is working blalblkjd');
      // }
      // if(pageOne === true){
      //   $('li').remove();
      //   updatePageData(pageOneLink);
      // } else if (pageOne === false){
      //   $('li').remove();
      //   updatePageData(pageTwoLink);
      // }
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
};

updatePageData(pageOneLink);

$('select').on('change', () => {
  const value = $('select').val();
  $('li').hide();
  $(`.${value}`).show();
});

$('#button-1').on('click', (updatePageData) => {
  $('li').remove();
  updatePageData(pageOneLink);
  pageOne = true;
});

$('#button-2').on('click', () => {
  $('li').remove();
  updatePageData(pageTwoLink);
  pageOne = false;
});


