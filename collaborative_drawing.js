let brushImages = [];
let brushThumbs = [];
let currentBrush = 0;
const totalBrushes = 30;
let db;

function preload() {
  for (let i = 0; i < totalBrushes; i++) {
    brushImages[i] = loadImage(`brush${i + 1}.jpg`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  imageMode(CENTER);
  textFont('Arial');
  textSize(16);
  fill(0);
  noStroke();

  setupFirebase();
  createBrushButtons();
}

function setupFirebase() {
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.database();

  db.ref("strokes").on("child_added", (data) => {
    const s = data.val();
    drawFromData(s);
  });
}

function draw() {
  if (mouseIsPressed) {
    let img = brushImages[currentBrush];
    let size = random(20, 60);
    image(img, mouseX, mouseY, size, size);

    const stroke = {
      x: mouseX,
      y: mouseY,
      brush: currentBrush,
      size: size,
      timestamp: Date.now()
    };
    db.ref("strokes").push(stroke);
  }

  drawInstructions();
}

function drawInstructions() {
  fill(255, 255, 255, 200);
  rect(10, height - 40, 300, 30);
  fill(0);
  text(`Current Brush: ${currentBrush + 1}`, 20, height - 20);
}

function drawFromData(s) {
  let img = brushImages[s.brush];
  image(img, s.x, s.y, s.size, s.size);
}

function createBrushButtons() {
  const panel = document.getElementById("brush-panel");

  for (let i = 0; i < totalBrushes; i++) {
    let imgEl = document.createElement("img");
    imgEl.src = `brush${i + 1}.jpg`;
    imgEl.className = "brush-thumb";
    if (i === currentBrush) imgEl.classList.add("active");

    imgEl.onclick = () => {
      currentBrush = i;
      updateActiveButton();
    };

    brushThumbs.push(imgEl);
    panel.appendChild(imgEl);
  }
}

function updateActiveButton() {
  brushThumbs.forEach((el, index) => {
    if (index === currentBrush) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}
