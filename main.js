const domainFile = "/excel/";
const eleQuestion = $(".question");
const eleAnswerA = $(".answerA");
const eleAnswerB = $(".answerB");
const eleAnswerC = $(".answerC");
const eleAnswerD = $(".answerD");
const eleAnswer = $(".answerTrue");
let countError = 0;
let countTrue = 0;

document.addEventListener("keydown", function (event) {
  let key = event.key;
  switch (key) {
    case "1":
      $(".answerA").click();
      break;
    case "2":
      $(".answerB").click();
      break;
    case "3":
      $(".answerC").click();
      break;
    case "4":
      $(".answerD").click();
      break;
  }
});

function getQueryParamsAsObject() {
  const queryParams = new URLSearchParams(window.location.search);
  const paramsObj = {};
  queryParams.forEach((value, key) => {
    // Kiểm tra nếu key đã tồn tại trong object, nếu có, chuyển giá trị thành một mảng
    if (paramsObj.hasOwnProperty(key)) {
      if (!Array.isArray(paramsObj[key])) {
        paramsObj[key] = [paramsObj[key]];
      }
      paramsObj[key].push(value);
    } else {
      paramsObj[key] = value;
    }
  });
  return paramsObj;
}

// Sử dụng hàm
const queryParams = getQueryParamsAsObject();

const sheetId = queryParams.sheetId;

const sheetName = encodeURIComponent(queryParams.sheetName);
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

$.ajax({
  type: "GET",
  url: sheetURL,
  dataType: "text",
  success: function (response) {
    // var data = $.csv.toArrays(response);
    var json = $.csv.toObjects(response);
    let countQuestion = json.length;
    let from = queryParams.from ? parseInt(queryParams.from) : 1;
    let to = queryParams.to ? parseInt(queryParams.to) : countQuestion;
    if (from < 1) {
      from = 1;
    }
    if (to > countQuestion) {
      to = countQuestion;
    }
    console.log("from", from);
    console.log("to", to);
    console.log("countQuestion", countQuestion);
    // random câu hỏi
    let randomQuestion = [];
    let mistaskQuestion = [];
    for (let i = from - 1; i < to; i++) {
      randomQuestion.push(json[i]);
    }
    let totalQuestion = randomQuestion.length;
    console.log("randomQuestion", randomQuestion);
    let currentQuestion = 0;
    function renderQuestion(currentQuestion, questions = randomQuestion) {
      let question = questions[currentQuestion];
      eleQuestion.text(question.question);
      eleAnswerA.text(question.answerA);
      eleAnswerB.text(question.answerB);
      eleAnswerC.text(question.answerC);
      eleAnswerD.text(question.answerD);
      eleAnswer.text(question.answer);
    }
    renderQuestion(currentQuestion);
    $(".answers").click(function (e) {
      let id = parseInt($(e.target).attr("data-id"));
      let idAnwer = parseInt(eleAnswer.text());

      if (id === idAnwer) {
        currentQuestion++;
        e.target.style.backgroundColor = "green";
        if (currentQuestion < totalQuestion) {
          countTrue++;
          if (countError >= 1 && countTrue >= 2) {
            $(".answers").css("background-color", "");
            countError = 0;
            countTrue = 0;
            renderQuestion(currentQuestion);
          } else if (countError === 0) {
            $(".answers").css("background-color", "");
            countError = 0;
            countTrue = 0;
            renderQuestion(currentQuestion);
          }
        } else {
          randomQuestion = mistaskQuestion;
          mistaskQuestion = [];
          if (randomQuestion.length === 0) {
            alert("Bạn đã hoàn thành bài thi");
            return;
          }
          currentQuestion = 0;
        }
      } else {
        countError++;
        if (countError === 1) {
          mistaskQuestion.push(randomQuestion[currentQuestion]);
        }
        e.target.style.backgroundColor = "red";
      }
    });
  },
});
