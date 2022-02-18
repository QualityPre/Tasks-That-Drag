const addBtns = document.querySelectorAll(".drag__add-btn:not(.drag__solid)");
const saveItemBtns = document.querySelectorAll(".drag__solid");
const addItemContainers = document.querySelectorAll(".drag__add-container");
const addItems = document.querySelectorAll(".drag__add-item");
// Item Lists
const allTheItemLists = document.querySelectorAll(".drag__item-list");
const columnOneList = document.getElementById("col1-list");
const columnTwoList = document.getElementById("col2-list");
const columnThreeList = document.getElementById("col3-list");
const columnFourList = document.getElementById("col4-list");

// Items
const arrayNames = ["col1", "col2", "col3", "col4"];
// this is to load from local storage when page is loaded
let updatedOnLoad = false;

// Initialize Arrays
let columnOneArray = [];
let columnTwoArray = [];
let columnThreeArray = [];
let columnFourArray = [];
let allColumnsArray = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentListForDraggedItem;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("col1Items")) {
    columnOneArray = JSON.parse(localStorage.col1Items);
    columnTwoArray = JSON.parse(localStorage.col2Items);
    columnThreeArray = JSON.parse(localStorage.col3Items);
    columnFourArray = JSON.parse(localStorage.col4Items);
  } else {
    columnOneArray = [];
    columnTwoArray = [];
    columnThreeArray = [];
    columnFourArray = [];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  allColumnsArray = [
    columnOneArray,
    columnTwoArray,
    columnThreeArray,
    columnFourArray,
  ];

  function setData(name, array) {
    localStorage.setItem(`${name}Items`, JSON.stringify(array));
  }

  allColumnsArray.forEach((arr, index) => {
    setData(arrayNames[index], arr);
  });
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

  columnOneArray.forEach((item, index) => {
    createItemEl(columnOneList, 0, item, index);
  });
  // columnOneArray = filterArray(columnOneArray);

  columnTwoArray.forEach((item, index) => {
    createItemEl(columnTwoList, 1, item, index);
  });

  columnThreeArray.forEach((item, index) => {
    createItemEl(columnThreeList, 2, item, index);
  });

  columnFourArray.forEach((item, index) => {
    createItemEl(columnFourList, 3, item, index);
  });

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
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
  const correctArray = allColumnsArray[column];

  const selectedListEl = allTheItemLists[column].children;
  if (!dragging) {
    if (!selectedListEl[id].textContent) {
      correctArray.splice(id, 1);
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

  const correctArray = allColumnsArray[column];
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
  columnOneArray = Array.from(columnOneList.children).map(
    (item) => item.textContent
  );

  columnTwoArray = Array.from(columnTwoList.children).map(
    (item) => item.textContent
  );
  // columnThreeArray = Array.from(columnThreeList.children).map(
  //   (item) => item.textContent
  // );
  // columnFourArray = Array.from(columnFourList.children).map(
  //   (item) => item.textContent
  // );

  updateDOM();
}

// Helper functions
function clearLists() {
  columnOneList.textContent = "";
  columnTwoList.textContent = "";
  // columnThreeList.textContent = "";
  // columnFourList.textContent = "";
}

function filterArray(arr) {
  return arr.filter((item) => item != null);
}
//on initial load

updateDOM();
