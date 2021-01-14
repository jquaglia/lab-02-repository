'use strict';

let creatures = [];//storing instantiation
let creatureKeywords = []; //storing filtered keywords
const pageOneLink = 'data/page-1.json';
const pageTwoLink = 'data/page-2.json';

function Creatures(title, url, description, keyword, horns) {
  this.title = title;
  this.image_url = url;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
}

//funtion render our json data to the page
Creatures.prototype.render = function () {
  let $templateClone = $('#photo-template').html();
  const object = this;

  const renderHtml = $(`<li class="${this.keyword} ${this.horns}">${Mustache.render($templateClone, object)}</li>`);
  $('ul').append(renderHtml);
};

//function to create the select options for drop down menu called in updatePageData
const dropDown = keyword => {
  const $menu = $(`<option value = "${keyword}">${keyword}</option>`);
  $('select').append($menu);
};

//function to call in click events to dry them out. Removing li, removing options from select list, clearing the creatures and creatureKeywords array to be reloaded when we retrun updatePageData and pass in the pageLink parameter.
const updateOnClick = pageLink => {
  $('li').remove();
  $('option').not(':first').remove();
  creatures = [];
  creatureKeywords = [];
  updatePageData(pageLink);
};

const updatePageData = url => {
  $.ajax(url).then(creaturesJson => { //getting the json data

    creaturesJson.forEach(creature => {
      //pushing each object from the json into the array
      creatures.push(new Creatures(creature.title, creature.image_url, creature.description, creature.keyword, creature.horns));
    });

    sortFunction('title'); //sorting the images by alphabet order on load

    //pushing keywords into creatureKeywords array for flitering. 
    creatures.forEach(creature => {
      if (!creatureKeywords.includes(creature.keyword)) {
        creatureKeywords.push(creature.keyword);
      }
    });

    //creating each of the options for the select dropdown menu
    creatureKeywords.forEach(keyword => {
      dropDown(keyword);
    });
  });
};

updatePageData(pageOneLink); //populating the html wtih the json data

$('form').on('change', () => {
  if ($('#sort-alphabet').is(':checked')) {
    sortFunction('title'); // Sorting by Title before they load
  } else if ($('#sort-horns').is(':checked')) {
    sortFunction('horns');
  }
});

//dynamic sorting to use to sort title and sort number of horns.
const sortFunction = (property => {
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
  //removing all the li elements to resort them
  $('li').remove();
  creatures.forEach(creature => {
    creature.render();
  });
});

//filtering from select dropdown menu
$('select').on('change', () => {
  const value = $('select').val();//storing the dropdown keyword to pass
  $('li').hide();
  $(`.${value}`).show();
});

$('#button-1').on('click', () => {
  updateOnClick(pageOneLink);
});

$('#button-2').on('click', () => {
  updateOnClick(pageTwoLink);
});


