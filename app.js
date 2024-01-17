const grid = document.querySelector(".grid");
const submitButton = document.querySelector(".submit-btn");
// let submission = [];

const drawGrid = (inputs) => {
  console.log('inputs: ', inputs)
  console.log('inputs.length: ', inputs.length)
  for (let i = 0; i < 81; i++) {
    const tile = document.createElement("input");
    tile.className = "tile";
    tile.id = i;
    tile.type = "number";
    tile.min = 1;
    tile.max = 9;
    //dividing sections and add color
    if (
      (((i % 9) == 0 || (i % 9) == 1 || (i % 9) == 2) && i <= 21) ||
      (((i % 9) == 6 || (i % 9) == 7 || (i % 9) == 8) && i <= 27) ||
      (((i % 9) == 3 || (i % 9) == 4 || (i % 9) == 5) && (i > 27 && i < 53)) ||
      (((i % 9) == 0 || (i % 9) == 1 || (i % 9) == 2) && i > 53) ||
      (((i % 9) == 6 || (i % 9) == 7 || (i % 9) == 8) && (i > 53))
     ){
      tile.className = 'odd-section'
    }
    //assign tile with according answer
    if (inputs.length > 0 && inputs[i] !== '.'){
      const newTile = document.getElementById(i);
      newTile.value = inputs[i]
      continue;
    }
    grid.appendChild(tile);;
  }
};

const getInputs = () => {
  let submission = [];
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value) {
      submission.push(input.value);
    } else {
      submission.push(".");
    }
  });
  submission = submission.join("");
  return submission;
};

const distributeAnswer = (isSolvable, answer) => {
  if (isSolvable) {
    //converting a string of numbers into an array of numbers
    answer = Array.from(answer, Number);
    console.log(answer);
    drawGrid(answer);
  }
};

const solveQuiz = () => {
  const submission = getInputs();

  //data to post a request along with
  fetch('http://localhost:8000/solve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({numbers: submission})
  }).then (response => response.json())
    .then((data => {
      console.log(data)
      if (data.solvable){
        distributeAnswer(data.solvable, data.solution);
        submission = [];
      }
      else {
        console.error("Not solvable!")
      }
    }))
    .catch ((error) => {
      console.error('Error: ', error.type)
    }) 
};

drawGrid([]);
submitButton.addEventListener("click", solveQuiz);
