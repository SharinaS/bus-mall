'use strict';

// get the image to render it
var imageOneEl = document.getElementById('item-one');
var imageTwoEl = document.getElementById('item-two');
var imageThreeEl = document.getElementById('item-three');
var ShoppingContainerEl = document.getElementById('shopping-container');
var listEl = document.getElementById('results');

var allItems = [];
var itemNames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'sweep.png', 'usb.gif'];
var recentRandomNumbers = [];
var totalVotes = 0;

//====== Constructor Function ======
function Item(name){
  this.name = name.split('.')[0];
  this.filepath = `img/${name}`;
  this.votes = 0;
  this.views = 0;

  allItems.push(this);
}

//====== Prototype Function ======
// Item.prototype.generateString = function(){
//   // combine string of this.votes + "votes for the " this.name
//   for(var i = 0; i < itemNames; i++){
//     this.resultString += this.name[i] + 'votes for the ' + this.name[i];
//   }
//   console.log('I am in the generateString protototype function');
// };



//===== Instantiations ======
for(var i = 0; i < itemNames.length; i++){
  new Item(itemNames[i]);
}


// =======Rendering =======
// make a render function for the randomized images
function render(){
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
// TODO: Write helper function for rendering

function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  // turn off event listener after 25 clicks
  if (totalVotes > 24 ){
    ShoppingContainerEl.removeEventListener('click', handleClick, true);

    // populate votes using prototype function 
    // this.generateString();  // <-----------------------------
    // for(var j = 0; j < allItems.length; j++){
    //   var liEl = document.createElement('li');
    //   liEl.textContent = this.resultString[j];
    //   listEl.appendChild(liEl);
    // }
  }

  //render again
  render();
}

// ===== Event Listener =======
ShoppingContainerEl.addEventListener('click', handleClick, true);

render();
