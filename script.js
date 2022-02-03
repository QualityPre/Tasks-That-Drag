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

console.log(onHoldList);

// Items
const arrayNames = ["backlog", "progress", "complete", "onHold"];
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
let dragging = false;
let currentListForDraggedItem;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = [];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];
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

  function setData(name, array) {
    localStorage.setItem(`${name}Items`, JSON.stringify(array));
  }

  allTheListsArray.forEach((arr, index) => {
    setData(arrayNames[index], arr);
  });
}

//removing any empty items from array

function filterArray(arr) {
  return arr.filter((item) => item != null || item.length !== 0);
}

// Create DOM Elements for each list item - index is the number of the array in that list
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag__item");
  listEl.textContent = item;
  // this is for the drag effect, need to select the element to drag
  listEl.draggable = true;

  //specify what happens when drag is used
  listEl.setAttribute("ondragstart", "drag(event)");
  // edit text
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();
  clearLists();
  // Backlog Column

  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column

  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 1, item, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column

  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 2, item, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column

  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 3, item, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}
function clearLists() {
  backlogList.textContent = "";
  progressList.textContent = "";
  completeList.textContent = "";
  onHoldList.textContent = "";
}

// For drag - when item starts to be dragged

function drag(event) {
  draggedItem = event.target;
  dragging = true;
  // console.log("This is the dragged item", draggedItem);
}

//this allows for the column to allow item to drop

function allowDrop(e) {
  e.preventDefault();
}

// When item enters a column area-giving a visual indication

function dragEnter(column) {
  allTheItemLists[column].classList.add("drag__over");
  // console.log(allTheItemLists[column]);
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
  // Dragging complete
  dragging = false;
  updateArrayOnDrag();
}

// Update Item

function updateItem(id, column) {
  const correctArray = allTheListsArray[column];

  const selectedListEl = allTheItemLists[column].children;
  if (!dragging) {
    if (!selectedListEl[id].textContent) {
      delete correctArray[id];
    } else {
      correctArray[id] = selectedListEl[id].textContent;
    }

    updateDOM();
  }
}

//adding text to list and cleaning text box

function addToList(column) {
  const userText = addItems[column].textContent;
  if (!userText) return;

  const correctArray = allTheListsArray[column];
  correctArray.push(userText);
  addItems[column].textContent = "";
  updateDOM();
}

// Adding items via item input box

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// removed item input box

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToList(column);
}

// update the arrays when items have been moved

function updateArrayOnDrag() {
  backlogListArray = Array.from(backlogList.children).map(
    (item) => item.textContent
  );
  progressListArray = Array.from(progressList.children).map(
    (item) => item.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (item) => item.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map(
    (item) => item.textContent
  );

  updateDOM();
}
//on initial load

updateDOM();
