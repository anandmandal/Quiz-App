const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};
let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#number-question"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value,
    diff = difficulty.value;

  //api url
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
      
    });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answerWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number");
  console.log(question);
  questionText.innerHTML = question.question;

  //correct and wrong answer are separeted, lets mix them
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];

  //correct answer will be always at last, lets shuffle the array
  answers.sort(() => Math.random() - 0.5);
  answerWrapper.innerHTML = "";
  answers.forEach((answer) => {
    answerWrapper.innerHTML += `
    <div class="answer">
        <span class="text ">${answer}</span>
        <span class="checkbox">
            <i class=" icon fa fa-check"></i>
        </span>
    </div>`;
  });

  questionNumber.innerHTML = `
  Question <span class="current">${
    questions.indexOf(question) + 1
  }</span><span class="total">/${questions.length}</span>`;

  //add event listener on answers
  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      //if answer not already submitted
      if (!answer.classList.contains("checked")) {
        answerDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        //add selected on currently clicked
        answer.classList.add("selected");
        //after any answer is selected enable submit btn
        submitBtn.disbled = false;
      }
    });
  });

  //after updating question start timer
  time = timePerQuestion.value;
  console.log(time);
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time >= 0) {
      //if timer is more than 0 means time remaining
      //move progress
      progress(time);
      time--;
    } else {
      //if time finishes means less than 0
      checkAnswer();
    }
  }, 1000);
};

//submit btn
const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

//submit btn click call check answer;
submitBtn.addEventListener("click", () => {
  checkAnswer();
});

//on next button click show next question
nextBtn.addEventListener("click", () => {
  nextQuestion();
  //also show submit btn on next question and hide next btn again
  nextBtn.style.display = "none";
  submitBtn.style.display = "block";
});

//check answer method
const checkAnswer = () => {
  //firstclear interval when check answer triggred
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  //any answer selected
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    console.log(answer);
    if (answer === questions[currentQuestion - 1].correct_answer) {
      //if answer matched with current question correct answer
      score++;

      //add correct class on selected
      selectedAnswer.classList.add("correct");
    } else {
      //if wrong selected then add wrong class on selected but also add the correct class
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            //only add correct class to correct answer
            answer.classList.add("correct");
          }
        });
    }
  } else {
    const correctAnswer = document
      .querySelectorAll(".answer")
      .forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          //only add correct class to correct answer
          answer.classList.add("correct");
        }
      });
  }

  //lets block user to select further answer
  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach((answer) => {
    answer.classList.add("checked");
    //add checked class on all answer as we check for it when on click anser if its present do nothing
    //also when checked lets dont add hover effect on checkbox;
  });
  //after submit show next btn to go to next question
  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

//nex question
const nextQuestion = () => {
  //if there is remaining question
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    //if no questions remaining then show score:
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  //reload page o click
  window.location.reload();
});
