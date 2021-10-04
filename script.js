var totalRows = 25;
var totalCols = 40;
var table = document.getElementById("table-container");
var isMouseDown = false;
var inProgress = false;
startElement = [10, 5];
endElement = [10, 35];
let dir = [-1, 0, 1, 0, -1];




/*

Create Legend
*/

var colorList = {Unvisited: 'whitesmoke', Wall: 'black', Path: 'Yellow' , Visited: 'Purple' , Start: 'Green' , End: 'Red'};

colorize = function(colorList) {
    var container = document.getElementById('Legend');
  
    for (var key in colorList) {
        var boxContainer = document.createElement("div");
        boxContainer.className="legend-box";
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
}

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

//Mouse Events
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

/*

Let's do Pathfinding

*/
let stack = [];

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
  
  if(elementsArray[ind].className!="start")
  elementsArray[ind].className = "visited";
 
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

function DFSPathFinding() {
  let visited = new Array(totalRows)
    .fill(0)
    .map(() => new Array(totalCols).fill(0));
  inProgress = true;
  DFS(elementsArray, startElement, visited);

  var intervalId = setInterval(function () {
    if (stack.length <= 0) {
      clearInterval(intervalId);
    }

    let i = stack.pop();
    if (
      elementsArray[i].className != "start" && elementsArray[i].className != "end"
    ) {
      elementsArray[i].className = "path";
    }
  }, 10 );
}

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    inProgress=true;
    DFSPathFinding();
    inProgress=false;
  }
});
