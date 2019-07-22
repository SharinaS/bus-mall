'use strict';

// get the image to render it
var imageOneEl = document.getElementById('item-one');
var imageTwoEl = document.getElementById('item-two');
var imageThreeEl = document.getElementById('item-two');
var ShoppingContainerEl = document.getElementById('shopping-container');

var allItems = [];
var itemNames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'sweep.png', 'usb.gif'];
var recentRandomNumbers = [];

// Constructor Function 
function Item(name){
  this.name = name.split('.')[0];
  this.filepath = `img/${name}`;
  this.votes = 0;
  this.views = 0;

  allItems.push(this);
}

// Instances of Items
for(var i = 0; i < itemNames.length; i++){
  new Item(itemNames[i]);
}

// make a render function for the randomized images
function render(){
  var randomIndex = getUniqueIndex();
  //allItems[randomIndex].views++;
  imageOneEl.src = allItems[randomIndex].filepath;
  imageOneEl.alt = allItems[randomIndex].name;
  imageOneEl.title = allItems[randomIndex].name;

  imageTwoEl.src = allItems[randomIndex].filepath;
  imageTwoEl.alt = allItems[randomIndex].name;
  imageTwoEl.title = allItems[randomIndex].name;

}

// ======= Helper Functions =======
// TODO: Write helper function for rendering

function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getUniqueIndex(){
  var randomIndex = randomNumber(0, allItems.length-1);

  while(recentRandomNumbers.includes(randomIndex)){
    randomIndex = randomNumber(0, allItems.length-1);
  }

  if(recentRandomNumbers.length > 3) {
    recentRandomNumbers.shift();
  }

  recentRandomNumbers.push(randomIndex);
  return randomIndex;
}

render();
