const grid = document.querySelector(".grid");
const submitButton = document.querySelector(".submit-btn");
const refreshButton = document.querySelector(".refresh-btn");
const messageDiv = document.querySelector(".message");

/**
 * Draw a 9x9 grid of sudoku
 * @param {Array<number>} inputs 
 */
const drawGrid = (inputs) => {

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

    //assign tiles with corresponding value
    if (inputs.length > 0 && inputs[i] !== '.'){
      const newTile = document.getElementById(i);
      newTile.value = inputs[i]
      continue;
    }

    grid.appendChild(tile);;
  }

};

/**
 * Refresh function that will erase all values for new entries
 */
const refreshGrid = () => {

  for (let i = 0; i < 81; i++){
    const tile = document.getElementById(i);
    tile.value = '';
  }

  refreshButton.style.display = "none";
  submitButton.style.display = "block";
}

/**
 * getInput function that will capture inputs and
 * parse them to the compatible data type
 * @returns submission to the API endpoint
 */
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

  //check if input wasn't empty
  if (submission.filter(value => value !== '.').length == 0){
    messageDiv.innerHTML = "Invalid input"
    messageDiv.style.display = "block";
    console.error("Inputs are required!")
    return;
  }

  submission = submission.join("");

  return submission;
};

/**
 * distributeAnswer function that helps distribute the
 * solution once the sudoku input
 * is solvable and data succssfully retrieved and 
 * @param {*} isSolvable 
 * @param {*} answer 
 */
const distributeAnswer = (isSolvable, answer) => {
  if (isSolvable) {
    //convert a string of numbers into an array of numbers
    answer = Array.from(answer, Number);
    drawGrid(answer);
  }
};

/**
 * solveQuiz function that helps send out request and
 * receive response to the application
 */
const solveQuiz = () => {

  const parsedSubmission = getInputs();

  if (parsedSubmission == null){
    return;
  }

  //data to post a request along with
  fetch('http://localhost:8000/solve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({numbers: parsedSubmission})
  }).then (response => response.json())
    .then((data => {
      
      if (data.solvable){
        messageDiv.style.display = "none";

        distributeAnswer(data.solvable, data.solution);

        submitButton.style.display = "none";
        refreshButton.style.display = "block";
      }
      else {
        console.error("Not solvable!")
        messageDiv.innerHTML = "Not Solvable!"
        messageDiv.style.display = "block"
      }

    }))
    .catch ((error) => {
      messageDiv.innerHTML = "Something went wrong, try again."
      messageDiv.style.display = "block";
      console.error('Error: ', error)
    }) 
};

drawGrid([]);
submitButton.addEventListener("click", solveQuiz);
refreshButton.addEventListener("click", refreshGrid);
