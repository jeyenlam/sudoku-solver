const PORT = 8000;

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
app.use(cors());
app.use(express.json());

app.post('/solve', (req, res) => {
  console.log(req.body.numbers);
  console.log('________________');
  const options = {
    method: "POST",
    url: "https://solve-sudoku.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "solve-sudoku.p.rapidapi.com",
    },
    data: {
      puzzle: req.body.numbers,
    },
  };

  axios.request(options).then((response) => {
    console.log(response.data);
    res.json(response.data)
  }). catch((error) => {
    console.error(error)
  })
})

app.listen(PORT, () => console.log(`Listening to PORT: ${PORT}`))