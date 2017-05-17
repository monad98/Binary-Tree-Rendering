function BTree() {
  this.root = null;
}

function Node(val) {
  this.val = val;
  this.left = this.right = null;
}

BTree.prototype.insert = function (val) {
  if (this.root === null) this.root = new Node(val);
  else {
    if (val < this.root.val) this.root.left = this.insertNode(this.root.left, val);
    else this.root.right = this.insertNode(this.root.right, val);
  }
};
BTree.prototype.insertNode = function (node, val) {
  if (!node) return new Node(val);

  //else
  if (val < node.val) node.left = this.insertNode(node.left, val);
  else node.right = this.insertNode(node.right, val);
  return node;
}

//calculate a height of tree
function getHeightOfTree(tree) {
  if(tree.root === null) return 0;
  else return getHeightOfNode(tree.root);
}

//calculate a height of node
function getHeightOfNode(node) {
  let lHeight = 1,
    rHeight = 1;
  if (node.left) lHeight = getHeightOfNode(node.left) + 1;
  if (node.right) rHeight = getHeightOfNode(node.right) + 1;

  return Math.max(lHeight, rHeight);
}
function countNodesWithOneOrNoChild(tree) {
  if(tree.root === null) return 0;
  else return countEndNodes(tree.root);
}


//count nodes which has 1 or 0 child)
function countEndNodes(node) {
  let left = 0, right = 0;
  if (node.left === null && node.right === null) return 1;
  else if(node.left && node.right === null) left = 1 + countEndNodes(node.left);
  else if(node.right && node.left === null) right = 1 + countEndNodes(node.right);
  else {
    if (node.left) left = countEndNodes(node.left);
    if (node.right) right = countEndNodes(node.right);
  }
  return left + right;
}

function makeBinaryTree(arr, tree) {
  if (!tree) tree = new BTree();
  arr.forEach(elem => {
    tree.insert(elem);
  });

  return tree;
}

function makeBalancedBinaryTree(arr, tree) {
  if (!tree) tree = new BTree();
  arr = arr.sort((a, b) => a - b)
  const length = arr.length;
  const middle = Math.floor(length / 2);
  const left = arr.slice(0, middle);
  const lLength = left.length;
  const right = arr.slice(middle + 1);
  const rLength = right.length;
  tree.insert(arr[middle]);

  if (left.length) makeBalancedBinaryTree(left, tree);
  if (right.length) makeBalancedBinaryTree(right, tree);
  return tree;
}

function drawBinaryTree(tree, selectorString, title, dataString) {
  let root = tree.root
  if (root === null) return;

  //title
  if (title && typeof title === 'string') {
    const titleElem = document.createElement('h1');
    titleElem.innerHTML = title;
    document.querySelector(selectorString).appendChild(titleElem);
  }

  //data
  if (dataString && typeof dataString === 'string') {
    const dataElem = document.createElement('p');
    dataElem.innerHTML = dataString;
    document.querySelector(selectorString).appendChild(dataElem);
  }

  //first we calculate height of root node;
  const rootHeight = getHeightOfTree(tree);
  //then calculate maximum width possible at the bottom of tree
  // const numOfNodeAtBottom = Math.max(countNodesAtBottomOfTree(tree)+1, rootHeight);
  // const numOfNodeAtBottom = Math.pow(2, rootHeight - 1);
  
  const numOfHorizontalGrid =  Math.min(Math.pow(2, rootHeight - 1), countNodesWithOneOrNoChild(tree));

  //canvas
  const container = document.querySelector(selectorString || 'body');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', '1000');
  canvas.setAttribute('height', '400');
  container.appendChild(canvas);
  const context = canvas.getContext('2d');

  //fixed variable
  const width = canvas.width;
  const height = canvas.height;
  const nodeHeight = height / rootHeight;
  const radius = Math.min(width / numOfHorizontalGrid * 0.4, nodeHeight * 0.4);
  // const radius = width / numOfNodeAtBottom * 0.25;

  //initial parameters for drawing node
  let parent = null;
  let parentX, parentY;
  
  //draw nodes from root
  let rootCenterX;
  if(root.left && root.right) rootCenterX = width / 2;
  else if(root.left) rootCenterX = width * 3 / 4;
  else if(root.right) rootCenterX = width /4;
  drawNodes(root, width, nodeHeight, radius, rootCenterX, nodeHeight / 2, context);

}

//draw nodes
function drawNodes(node, nodeWidth, nodeHeight, radius, centerX, centerY, context, parent = null) {
  if(node.left && node.right) {
    //left
    drawLine(centerX, centerY, centerX - (nodeWidth / 4), centerY + nodeHeight, context);
    drawNodes(node.left, nodeWidth / 2, nodeHeight, radius, centerX - (nodeWidth / 4), centerY + nodeHeight, context, node);
    //right
    drawLine(centerX, centerY, centerX + (nodeWidth / 4), centerY + nodeHeight, context);
    drawNodes(node.right, nodeWidth / 2, nodeHeight, radius, centerX + (nodeWidth / 4), centerY + nodeHeight, context, node);
  }
  else if (node.left) {
    drawLine(centerX, centerY, centerX - (nodeWidth / 8), centerY + nodeHeight, context);
    drawNodes(node.left, nodeWidth / 4 * 3, nodeHeight, radius, centerX - (nodeWidth / 8), centerY + nodeHeight, context, node);
  }
  else if (node.right) {
    drawLine(centerX, centerY, centerX + (nodeWidth / 8), centerY + nodeHeight, context);
    drawNodes(node.right, nodeWidth / 4 * 3, nodeHeight, radius, centerX + (nodeWidth / 8), centerY + nodeHeight, context, node);
  }
  drawNode(node, radius, centerX, centerY, context, parent);
}

//draw node
function drawNode(node, radius, centerX, centerY, context, parent = null) {
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.stroke();
  context.textAlign = 'center';
  context.fillStyle = "#4cae4c";
  context.fill();
  context.fillStyle = "white";
  context.font = Math.round(radius) + 'px Ariel';
  context.fillText(node.val, centerX, centerY + radius / 5);
}

//draw line from parent node to children nodes
function drawLine(pCenterX, pCenterY, cCenterX, cCenterY, context) {
  context.beginPath();
  context.moveTo(pCenterX, pCenterY);
  context.lineTo(cCenterX, cCenterY);
  context.strokeStyle = "black";
  context.stroke();
}



//rendering
let myArr1 = [];
for(var i = 1; i < 64; i++) {
  myArr1.push(i);
}
const myArr2 = [5, 4, 7, 2, 6, 3, 8];
const myArr3 = [1, 2, 3, 4, 5, 6, 7, 9, 8,10, -1 ,-2,-3,-4,-5,-6, -1.5];

drawBinaryTree(makeBinaryTree(myArr3), '#btree-box', 'Binary Search Tree Example', JSON.stringify(myArr3));
drawBinaryTree(makeBalancedBinaryTree(myArr3), '#btree-box', 'Balanced Search Binary Tree Example', JSON.stringify(myArr3));


const input = document.querySelector('#btree-input');
const form = document.querySelector('#btree-form');
form.addEventListener('submit', function(ev) {
  ev.preventDefault();
  
  //input validation
  const inputStr = input.value.trim();
  let arr;
  try {
    arr = JSON.parse(inputStr);
    if(!Array.isArray(arr)) throw new Error();
    arr.forEach(number => {
      if(typeof number !== 'number') throw new Error();
    });
    const set = new Set(arr);
    arr = [...set];
    console.log(arr);

  } catch (error) {
    console.log(error);
    window.alert("Invalid Input.")
    return;
  }

  //clear previous tree
  const node = document.querySelector('#btree-box');
  while(node.hasChildNodes()) {
    node.removeChild(node.firstChild);
  }

  //draw new trees
  drawBinaryTree(makeBinaryTree(arr), '#btree-box', 'Binary Search Tree', JSON.stringify(arr));
  drawBinaryTree(makeBalancedBinaryTree(arr), '#btree-box', 'Balanced Binary Search Tree', "sorted: " + JSON.stringify(arr));
});