'use strict';

// get the image to render it
var imageOneEl = document.getElementById('item-one');
var imageTwoEl = document.getElementById('item-two');
var imageThreeEl = document.getElementById('item-three');
var ShoppingContainerEl = document.getElementById('shopping-container');

var allItems = [];
var itemNames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'sweep.png', 'usb.gif'];
var recentRandomNumbers = [];

var totalVotes = 0;


var ulEl = document.getElementById('list');

//====== Constructor Function ======
function Item(name){
  this.name = name.split('.')[0];
  this.filepath = `img/${name}`;
  this.votes = 0;
  this.views = 0;
  this.results = '';
  allItems.push(this);
}

//===== Instantiations ======
for(var i = 0; i < itemNames.length; i++){
  new Item(itemNames[i]);
}


// =======Rendering =======
// make a render function for the randomized images 
function render(){  // <---------------------------- TODO: DRY
  // Render Image 1
  var randomIndex = getUniqueIndex(); 
  allItems[randomIndex].views++;
  imageOneEl.src = allItems[randomIndex].filepath;
  imageOneEl.alt = allItems[randomIndex].name;
  imageOneEl.title = allItems[randomIndex].name;
  // Render Image 2
  randomIndex = getUniqueIndex();
  allItems[randomIndex].views++;
  imageTwoEl.src = allItems[randomIndex].filepath;
  imageTwoEl.alt = allItems[randomIndex].name;
  imageTwoEl.title = allItems[randomIndex].name;

  // Render Image 3
  randomIndex = getUniqueIndex();
  allItems[randomIndex].views++;
  imageThreeEl.src = allItems[randomIndex].filepath;
  imageThreeEl.alt = allItems[randomIndex].name;
  imageThreeEl.title = allItems[randomIndex].name;
}

// ======= Helper Functions =======
// create a random number
function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get a random and unique index
function getUniqueIndex(){
  var randomIndex = randomNumber(0, allItems.length-1); // randomIndex gives a random # between 0 and length of items.

  while(recentRandomNumbers.includes(randomIndex)){ // includes asks "is this in the array?" returns true/false.
    randomIndex = randomNumber(0, allItems.length-1); // gets a new random value
  }
  if(recentRandomNumbers.length > 5) { // we only care about the last three images and the 2 on the page, otherwise we want repeated images. 
    recentRandomNumbers.shift(); 
  }
  recentRandomNumbers.push(randomIndex);
  return randomIndex;
}

// // render to HTML
// function addElement(childElType, childContent, parentEl){
//   var childEl = document.createElement(childElType);
//   childEl.textContent = childContent;
//   parentEl.appendChild(childEl);
// }

// ====== Event handler ======
function handleClick(){
  // Identify which image was clicked on
  var chosenImg = event.target.title;
  totalVotes++;
  console.log('my chosen image is ', chosenImg);

  for(var i = 0; i < allItems.length; i++){
    if(allItems[i].name === chosenImg){
      allItems[i].votes++;
    }
  }

  if (totalVotes > 24 ){
    // turn off event listener after 25 clicks
    ShoppingContainerEl.removeEventListener('click', handleClick, true); // <----- check later if true needed
    generateList();
  }
  render();
}

//===== Functions =====
Item.prototype.generateResults = function(){
  //combine string of this.votes + "votes for the " this.name
  this.results = `${this.votes} votes for ${this.name}`;
  var liEl = document.createElement('li');
  liEl.textContent = this.results;
  ulEl.appendChild(liEl);
};

function generateList(){
  for(var i = 0; i < allItems.length; i++){
    allItems[i].generateResults();
  }
}


// each object instance is only responsible for rendering its own <li>. Once the cutoff point of cicks is reached, function generateList is called, which then activates the prototype function. 

// ===== Event Listener =======
ShoppingContainerEl.addEventListener('click', handleClick, true);

// ===== Render =====
render();

