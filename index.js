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
function countNodesAtBottomOfTree(tree) {
  if(tree.root === null) return 0;
  else return countEndNodes(tree.root);
}


//count nodes at bottom (which has no child)
function countEndNodes(node) {
  let left = 0, right = 0;
  if (node.left === null && node.right === null) return 1;
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

const myArr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
// const myArr2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const myArr2 = [5, 4, 7, 2, 6, 3, 8];
const myArr3 = [1, 2, 3, 4, 5, 6, 7];

drawBinaryTree(makeBinaryTree(myArr2), '.container', 'Binary Tree Example', JSON.stringify(myArr2));
drawBinaryTree(makeBalancedBinaryTree(myArr1), '.container', 'Balanced Binary Tree Example', JSON.stringify(myArr1));
console.log(countNodesAtBottomOfTree(makeBinaryTree(myArr3)));
console.log(countNodesAtBottomOfTree(makeBalancedBinaryTree(myArr1)));

function drawBinaryTree(tree, selectorString, title, dataString) {
  let root = tree.root
  if (root === null) return;

  //first we calculate height of root node;
  const rootHeight = getHeightOfTree(tree);
  //then calculate maximum width possible at the bottom of tree
  const numOfNodeAtBottom = Math.pow(2, rootHeight - 1);
  // const numOfNodeAtBottom = countNodesAtBottomOfTree(tree);

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


  //canvas
  const container = document.querySelector(selectorString || 'body');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', '800');
  canvas.setAttribute('height', '300');
  container.appendChild(canvas);

  const width = canvas.width;
  const height = canvas.height;
  console.log(width, " ", height)
  const context = canvas.getContext('2d');

  //initial parameters for drawing node
  let parent = null;
  const nodeHeight = height / rootHeight;
  let parentX, parentY;
  const radius = width / numOfNodeAtBottom * 0.25;

  //draw nodes from root
  drawNodes(root, width, nodeHeight, radius, width / 2, nodeHeight / 2, context);

}

//draw nodes
function drawNodes(node, nodeWidth, nodeHeight, radius, centerX, centerY, context, parent = null) {
  if (node.left) {
    drawLine(centerX, centerY, centerX - (nodeWidth / 4), centerY + nodeHeight, context);
    drawNodes(node.left, nodeWidth / 2, nodeHeight, radius, centerX - (nodeWidth / 4), centerY + nodeHeight, context, node);
  }
  if (node.right) {
    drawLine(centerX, centerY, centerX + (nodeWidth / 4), centerY + nodeHeight, context);
    drawNodes(node.right, nodeWidth / 2, nodeHeight, radius, centerX + (nodeWidth / 4), centerY + nodeHeight, context, node);
  }
  drawNode(node, nodeWidth, nodeHeight, radius, centerX, centerY, context, parent);
}

//draw node
function drawNode(node, nodeWidth, nodeHeight, radius, centerX, centerY, context, parent = null) {
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
