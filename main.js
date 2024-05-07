// variables of elements
let countspan = document.querySelector(".quiz-app .count .total");
let mainspan = document.querySelector(".bullets .spans");
let qArea = document.querySelector(".question-area");
let ansArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit");
let bulletscont = document.querySelector(".bullets");
let finalresult = document.querySelector(".result");
let contercontainer = document.querySelector(".countdown");
//set options
let countdownInterval;
let current = 0;
let rightanswers = 0;

//fetch function
async function getdata() {
  try {
    let mydata = await fetch("html_questions.json");
    let htmlObjects = await mydata.json();

    let questioncount = htmlObjects.length;
    createbullets(questioncount);
    addquestions(htmlObjects[current], questioncount);

    submit.onclick = () => {
      let therightanswer = htmlObjects[current]["right_answer"];
      current++;
      checkanswer(therightanswer, questioncount);
      qArea.innerHTML = "";
      ansArea.innerHTML = "";
      addquestions(htmlObjects[current], questioncount);
      handlebullets();
      clearInterval(countdownInterval);
      countdown(3, questioncount);
      showResults(questioncount);
    };
  } catch (error) {}
}

getdata();

function createbullets(num) {
  countspan.innerHTML = num;
  for (let i = 1; i <= num; i++) {
    let bullet = document.createElement("span");

    mainspan.appendChild(bullet);
    if (i === 1) {
      bullet.classList.add("on");
    }
  }
}

//add data to html
function addquestions(obj, qcount) {
  if (current < qcount) {
    let h2 = document.createElement("h2");
    let h2text = document.createTextNode(obj["title"]);
    h2.appendChild(h2text);
    h2.setAttribute("class", "question");
    qArea.appendChild(h2);
    for (let i = 1; i <= 4; i++) {
      let div = document.createElement("div");
      div.setAttribute("class", "answer");
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "questions";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let answertxt = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(answertxt);
      div.appendChild(input);
      div.appendChild(label);
      ansArea.appendChild(div);
      if (i === 1) {
        input.checked = true;
      }
    }
  }
}

//check function
function checkanswer(rightAnswer, questionNo) {
  let answers = document.getElementsByName("questions");
  let chosenAnswer;

  for (i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if (chosenAnswer === rightAnswer) {
    rightanswers++;
  }
}

// handlebullets
function handlebullets() {
  let allspans = document.querySelectorAll(".bullets .spans span");
  let arrayofspans = Array.from(allspans);
  arrayofspans.forEach((span, index) => {
    if (current === index) {
      span.className = "on";
    }
  });
}

//      showResults
function showResults(count) {
  let resultspan;
  if (current === count) {
    qArea.remove();
    ansArea.remove();
    submit.remove();
    bulletscont.remove();

    if (rightanswers === count) {
      resultspan = `<span class="perfect">Perfect</span> your result is ${rightanswers} from ${count}`;
    } else if (rightanswers > count / 2 && rightanswers < count) {
      resultspan = `<span class="good">good</span> your result is ${rightanswers} from ${count}`;
    } else {
      resultspan = `<span class="pass">not Pass</span> your result is ${rightanswers} from ${count}`;
    }
    finalresult.innerHTML = resultspan;
  }
}

//countdown

function countdown(duration, qcount) {
  if (current < qcount) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      contercontainer.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submit.click();
      }
    }, 1000);
  }
}
