const addBtns = document.querySelectorAll(".drag__add-btn:not(.drag__solid)");
const saveItemBtns = document.querySelectorAll(".drag__solid");
const addItemContainers = document.querySelectorAll(".drag__add-container");
const addItems = document.querySelectorAll(".drag__add-item");
// Item Lists
const allTheItemLists = document.querySelectorAll(".drag__item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("onHold-list");

// Items
// this is to load from local storage when page is loaded
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let allTheListsArray = [];

// Drag Functionality
let draggedItem;
let currentListForDraggedItem;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  allTheListsArray = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  function setData(name, array) {
    localStorage.setItem(`${name}Items`, JSON.stringify(array));
  }

  allTheListsArray.forEach((arr, index) => {
    setData(arrayNames[index], arr);
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag__item");
  listEl.textContent = item;
  // this is for the drag effect, need to select the element to drag
  listEl.draggable = true;

  //specify what happens when drag is used
  listEl.setAttribute("ondragstart", "drag(event)");
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 0, item, index);
  });
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 0, item, index);
  });
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 0, item, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// For drag - when item starts to be dragged

function drag(event) {
  draggedItem = event.target;
  console.log("This is the dragged item", draggedItem);
}

//this allows for the column to allow item to drop

function allowDrop(e) {
  e.preventDefault();
}

// When item enters a column area-giving a visual indication

function dragEnter(column) {
  allTheItemLists[column].classList.add("drag__over");
  console.log(allTheItemLists[column]);
  currentListForDraggedItem = column;
}

// Dropping the item into the column

function drop(event) {
  event.preventDefault();
  // Remove the classList drag_-over
  allTheItemLists.forEach((list) => {
    list.classList.remove("drag__over");
  });
  // Add the actual item to the list
  const parentEl = allTheItemLists[currentListForDraggedItem];
  parentEl.appendChild(draggedItem);
  updateArrayOnDrag();
}

//on initial load
updateDOM();

// update the arrays when items have been moved

function updateArrayOnDrag() {
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];

  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
}
