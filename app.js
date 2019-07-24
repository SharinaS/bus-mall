'use strict';


var ShoppingContainerEl = document.getElementById('shopping-container');
var imageOneEl = document.getElementById('item-one');
var imageTwoEl = document.getElementById('item-two');
var imageThreeEl = document.getElementById('item-three');
var canvas1 = document.getElementById('graph-1');
var canvas2 = document.getElementById('graph-2');
var canvas3 = document.getElementById('graph-3');

var allItems = []; 
var itemNames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'sweep.png', 'usb.gif'];
var recentRandomNumbers = [];
var totalVotes = 0;

// chart making
var namesArray = [];
var itemVotes = [];
var voteToViewPerc = [];
var top3Votes = [];

//====== Local Storage ======

if(localStorage){  
  var allItemsStringed = localStorage.getItem('allTheItems');
  // store line 27 to a variable, then assign to allItems.
  var localStorageItems = JSON.parse(allItemsStringed);
  allItems = localStorageItems;
}


//====== Constructor Function ======
function Item(name){
  this.name = name.split('.')[0];
  this.filepath = `img/${name}`;
  this.votes = 0;
  this.views = 0;
  allItems.push(this);
}

//===== Instantiations ======
function instantiateAllItems(){
  if(localStorage.length < 1){
    for(var i = 0; i < itemNames.length; i++){
      new Item(itemNames[i]);
    }
  }
}


// ====== Event Handler ======
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

  if (totalVotes > 3 ){ // <------------------------------------ change back to 25
    // turn off event listener after 25 clicks, generate arrays
    ShoppingContainerEl.removeEventListener('click', handleClick);
    // arrays for graphs
    generateArrays();

    
    // add item to localStorage
    // var allItemsStringed = JSON.stringify(allItems);
    localStorage.setItem('allTheItems', JSON.stringify(allItems));


  }

  // make the canvas appear, since it was hidden prior to activation of handleClick()
  canvas1.removeAttribute('hidden');
  canvas2.removeAttribute('hidden');
  canvas3.removeAttribute('hidden');

  render();
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


// ===== Event Listener =======
ShoppingContainerEl.addEventListener('click', handleClick);


// ======= Functions =======
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

/////////// DRY
// function render(imageEl){  
//   // Render Image 1
//   var randomIndex = getUniqueIndex(); 
//   allItems[randomIndex].views++;
//   imageOneEl.src = allItems[randomIndex].filepath;
//   imageOneEl.alt = allItems[randomIndex].name;
//   imageOneEl.title = allItems[randomIndex].name;
//   /////////////
// Then call render below three times for each time it needs rendering (3 images)


function generateArrays(){
  for(var i = 0; i < allItems.length; i++){
    namesArray.push(allItems[i].name);
    itemVotes.push(allItems[i].votes);
    // percentage of votes for every view
    voteToViewPerc.push(allItems[i].votes / allItems[i].views * 100); 
  }
  // top 3 votes
  var sortedVotes = itemVotes.sort();
  sortedVotes.reverse();
  top3Votes.push(sortedVotes[0]);
  top3Votes.push(sortedVotes[1]);
  top3Votes.push(sortedVotes[2]);
  console.log('sorted votes in generateArray function', sortedVotes);

  generateChart1();
  generateChart2();
  generateChart3();
}

function generateChart1(){
  var ctx = document.getElementById('graph-1').getContext('2d');
  new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: namesArray,
      datasets: [{
        label: 'Number of Votes per Image Shown',
        data: itemVotes,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}


// Chart for percentages
function generateChart2(){
  var ctx = document.getElementById('graph-2').getContext('2d');
  new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: namesArray,
      datasets: [{
        label: 'Percentage of Votes for Each View',
        data: voteToViewPerc,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

// Pie Chart
function generateChart3(){
  var ctx = document.getElementById('graph-3').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: namesArray,
      datasets: [{
        label: 'Pie Graph',
        data: top3Votes,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}


// ===== Call Functions =====
instantiateAllItems();
render();



