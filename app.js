'use strict';

var allItems = [];
var itemNames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg', 'sweep.png', 'usb.gif'];
var recentRandomNumbers = [];
var totalVotes = 0;

// variables for graphs 1 and 2
var namesArray = [];
var itemVotes = [];
var voteToViewPerc = [];
// variables for graph 3 - pie graph
var top3Votes = [];
var top3Labels = [];

// DOM-related variables
var ShoppingContainerEl = document.getElementById('shopping-container');
var imageOneEl = document.getElementById('item-one');
var imageTwoEl = document.getElementById('item-two');
var imageThreeEl = document.getElementById('item-three');
var canvas1 = document.getElementById('graph-1');
var canvas2 = document.getElementById('graph-2');
var canvas3 = document.getElementById('graph-3');

getFromLocalStorageIfItsFull();


//====== Constructor Function ======
function Item(name){
  this.name = name.split('.')[0];
  this.filepath = `img/${name}`;
  this.votes = 0;
  this.views = 0;
  allItems.push(this);
}


// ====== Event Handler ======
function handleClick(){
  targetImageAndVote();
  onceUserHasVoted();
  makeCanvasAppear();
  render();
}


// ======= Two Helper Functions =======
// creates a random number
function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// gets a random and unique index
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
// get data from local storage if there's anything there
function getFromLocalStorageIfItsFull(){
  if(localStorage.length > 0){
    var allItemsStringed = localStorage.getItem('allTheItems');
    var localStorageItems = JSON.parse(allItemsStringed);
    allItems = localStorageItems; // sets what is in the local storage to allItems array. 
  }
}


// Instantiation of constructor function
function instantiateAllItems(){
  if(localStorage.length < 1){
    for(var i = 0; i < itemNames.length; i++){
      new Item(itemNames[i]);
    }
  }
}


// Identify which image was clicked on and add a vote for that image
function targetImageAndVote(){
  var chosenImg = event.target.title;
  totalVotes++;
  console.log('my chosen image is ', chosenImg);

  for(var i = 0; i < allItems.length; i++){
    if(allItems[i].name === chosenImg){
      allItems[i].votes++;
    }
  }
}


// Events that occur once the user has submitted all their votes
function onceUserHasVoted(){
  if (totalVotes > 25){
    // turn off event listener after 25 clicks, generate arrays
    ShoppingContainerEl.removeEventListener('click', handleClick);
    // arrays for graphs
    generateArrays();

    // add item to localStorage
    var allItemsStringed = JSON.stringify(allItems);
    localStorage.setItem('allTheItems', allItemsStringed);
  }
}


// makes the canvas appear, since it was hidden prior to activation of handleClick()
function makeCanvasAppear(){
  canvas1.removeAttribute('hidden');
  canvas2.removeAttribute('hidden');
  canvas3.removeAttribute('hidden');  
}


// makes a render function for the randomized images
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


function generateArrays(){
  top3Labels = []; // clears the array so it can be repopulated 
  top3Votes = [];
  for(var i = 0; i < allItems.length; i++){
    namesArray.push(allItems[i].name);
    itemVotes.push(allItems[i].votes);
    // percentage of votes for every view
    voteToViewPerc.push(allItems[i].votes / allItems[i].views * 100);
  }
  // top 3 votes
  var sortedItems = allItems.concat();
  console.log('sorted items', sortedItems);
  sortedItems.sort(function(a,b){
    if(a.votes < b.votes){
      return 1;
    }else{
      return -1;
    }
  });


  var top3Obj = sortedItems.slice(0,3);
  console.log('top 3 objects', top3Obj);
  for(var j = 0; j < top3Obj.length; j++){
    top3Labels.push(top3Obj[j].name);
    top3Votes.push(top3Obj[j].votes);
  }
  console.log('top 3 votes', top3Votes);

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
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
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
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
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
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
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
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
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
      labels: top3Labels,
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



