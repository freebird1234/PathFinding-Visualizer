var totalRows = 25;
var totalCols = 40;
var table = document.getElementById("table-container");
var isMouseDown = false;
var inProgress = false;
startElement = [10, 5];
endElement = [10, 35];
var stack = [];
let dir = [-1, 0, 1, 0, -1];

//===========================Create Queue==================================//
class Queue extends Map {
  constructor() {
    super();
    this.insertionIndex = 0;
    this.removalIndex = 0;
    this.length = 0;
  }

  enqueue(element) {
    this.set(this.insertionIndex, element);
    this.insertionIndex++;
    this.length++;
  }

  dequeue() {
    const el = this.get(this.removalIndex);
    if (typeof el !== "undefined") {
      this.delete(this.removalIndex);
      this.removalIndex++;
      this.length--;
    }
    return el;
  }

  getSize() {
    return this.length;
  }
}
//===============================Queue Class Over======================================//

/*

Create Legend
*/

var colorList = {
  Unvisited: "whitesmoke",
  Wall: "black",
  Path: "Yellow",
  Visited: "Purple",
  Start: "Green",
  End: "Red",
};

colorize = function (colorList) {
  var container = document.getElementById("Legend");

  for (var key in colorList) {
    var boxContainer = document.createElement("div");
    boxContainer.className = "legend-box";
    var box = document.createElement("div");
    var label = document.createElement("span");
    //label.style ="height: 20px;width: 20px;margin: 10px 10px;"
    label.innerHTML = key;
    box.className = "box";
    box.style.backgroundColor = colorList[key];

    boxContainer.appendChild(box);
    boxContainer.appendChild(label);

    container.appendChild(boxContainer);
  }
};

colorize(colorList);

/*

Generating grid using HTML 'table' tag.
We are creating a HTML string.
And using insertAdjacentHTML() function to add the HTML string to table container

*/

function getIndex(indexArray) {
  return indexArray[0] * totalCols + indexArray[1];
}

function generateGrid(rows, cols) {
  var grid = "<table>";
  for (row = 1; row <= rows; row++) {
    grid += "<tr>";
    for (col = 1; col <= cols; col++) {
      grid += "<td></td>";
    }
    grid += "</tr>";
  }
  grid += "</table>";
  return grid;
}

var myGrid = generateGrid(totalRows, totalCols);
//console.log(myGrid);
table.insertAdjacentHTML("beforeend", myGrid);

let elementsArray = document.querySelectorAll("td");

//Mark Start element
let index = getIndex(startElement);
elementsArray[index].className = "start";

//Mark End Element
index = getIndex(endElement);
elementsArray[index].className = "end";

//Clear Board
function clearBoard(keepWalls) {
  if (inProgress) return;

  for (let i = 0; i < elementsArray.length; i++) {
    if (i != getIndex(startElement) && i != getIndex(endElement) && !keepWalls)
      elementsArray[i].className = "";
    else if (
      i != getIndex(startElement) &&
      i != getIndex(endElement) &&
      keepWalls
    ) {
      if (elementsArray[i].className != "Wall") {
        elementsArray[i].className = "";
      }
    }
  }
}

//======================================Mouse Events==========================================
elementsArray.forEach(function (elem) {
  elem.addEventListener("mousedown", function () {
    elem.className = "Wall";
    isMouseDown = true;
  });
});

elementsArray.forEach(function (elem) {
  elem.addEventListener("mousemove", function () {
    if (isMouseDown && elem.className != "start" && elem.className != "end")
      elem.className = "Wall";
  });
});

table.addEventListener("mouseup", function () {
  isMouseDown = false;
});

// ==========================MOUSE EVENTS OVER=======================================================================

/*

Let's do Pathfinding

*/

function DFS(elementsArray, startElement, visited) {
  let ind = getIndex(startElement);

  if (
    startElement[1] >= totalCols ||
    startElement[0] >= totalRows ||
    startElement[0] < 0 ||
    startElement[1] < 0 ||
    elementsArray[ind].className == "Wall" ||
    visited[startElement[0]][startElement[1]] == 1
  ) {
    return false;
  }

  if (startElement[0] == endElement[0] && startElement[1] == endElement[1]) {
    stack.push(ind);
    return true;
  }
  visited[startElement[0]][startElement[1]] = 1;

  toggleClass(startElement);

  for (let i = 0; i < 4; i++) {
    let nextCell = [0, 0];
    nextCell[0] = startElement[0] + dir[i];
    nextCell[1] = startElement[1] + dir[i + 1];
    let option1 = DFS(elementsArray, nextCell, visited);

    if (option1) {
      stack.push(ind);
      return true;
    }
  }

  return false;
}

async function getPath() {
  
  while(stack.length>0){
    await sleep(20);
  let i = stack.pop();
  if (
    elementsArray[i].className != "start" &&
    elementsArray[i].className != "end"
  ) {
    elementsArray[i].className = "path";
  }
}
inProgress=false;
  // var intervalId = setInterval(function () {
  //   if (stack.length <= 0) {
  //     inProgress = false;
  //     clearInterval(intervalId);
  //   }

  //   let i = stack.pop();
  //   if (
  //     elementsArray[i].className != "start" &&
  //     elementsArray[i].className != "end"
  //   ) {
  //     elementsArray[i].className = "path";
  //   }
  // }, 10);

  
}

async function DFSPathFinding() {
  if (inProgress) {
    return;
  }

  clearBoard(true);
  let visited = new Array(totalRows)
    .fill(0)
    .map(() => new Array(totalCols).fill(0));

  inProgress = true;
  DFS(elementsArray, startElement, visited);

  
  getPath();
}

function isSafe(visited, cell) {
  //console.log(cell);
  if (
    cell[0] < 0 ||
    cell[0] >= totalRows ||
    cell[1] < 0 ||
    cell[1] >= totalCols ||
    visited[cell[0]][cell[1]] == 1 ||
    getIndex(cell) < 0 ||
    getIndex(cell) >= totalCols * totalRows ||
    elementsArray[getIndex(cell)].className == "Wall"
  )
    return false;
  else return true;
}

async function toggleClass(ind) {
  await sleep(30);

  if (
    elementsArray[getIndex(ind)].className != "start" &&
    elementsArray[getIndex(ind)].className != "end"
  ) {
    elementsArray[getIndex(ind)].className = "visited";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function BFS(visited) {
  queue = new Queue();
  queue.enqueue(startElement);
  let parent = Array.from(Array(totalRows * totalCols).keys());

  while (queue.getSize() > 0) {
    let ind = queue.dequeue();

    visited[ind[0]][ind[1]] = 1;
  
    for (let i = 0; i < 4; i++) {
      let nextCell = [0, 0];
      nextCell[0] = ind[0] + dir[i];
      nextCell[1] = ind[1] + dir[i + 1];

      if (isSafe(visited, nextCell)) {
        toggleClass(ind);
        if (getIndex(nextCell) == getIndex(endElement)) {
          parent[getIndex(nextCell)] = getIndex(ind);
          return parent;
        }
        parent[getIndex(nextCell)] = getIndex(ind);
        queue.enqueue(nextCell);
        visited[nextCell[0]][nextCell[1]] = 1;
      }
    }
  }
  inProgress=false;
  return;
}

//BFS
async function BFSPathFinding() {
  if (inProgress) return;

  clearBoard(true);
  let visited = new Array(totalRows)
    .fill(0)
    .map(() => new Array(totalCols).fill(0));

  inProgress = true;
  let parent = BFS(visited);

  let ind = getIndex(endElement);
  stack = [];
  while (ind != getIndex(startElement)) {
    if (ind != getIndex(endElement)) stack.push(ind);
    ind = parent[ind];
  }
  await sleep(800);
  getPath();
 
}


////================================Drop Down For Algorithms==============================================

var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

//=====================================================================================================================




document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    let x=document.getElementsByClassName("select-selected");
    let node = x[0];
    htmlContent = node.innerHTML,
// htmlContent = "Some <span class="foo">sample</span> text."

    textContent = node.textContent;
    console.log(textContent);

    if(textContent=="DFS"){
      DFSPathFinding();
    }
    else if(textContent=="BFS"){
      BFSPathFinding();
    }
    
  }
});