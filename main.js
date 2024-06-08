const domainFile = "/excel/";
const eleQuestion = $(".question");
const eleAnswerA = $(".answerA");
const eleAnswerB = $(".answerB");
const eleAnswerC = $(".answerC");
const eleAnswerD = $(".answerD");
const eleAnswer = $(".answerTrue");
const eleStreak = $(".streak");
const eleError = $(".error");
const eleCurrentQuestion = $(".currentQuestion");
const eleTotalQuestion = $(".totalQuestion");
const eleObjectTest = $(".objectTest");
const eleShowQuestions = $(".showQuestions");

let countErrorTime = 0;
let countTrue = 0;
let countStreak = 0;
let countErorr = 0;
let currentQuestion = 0;
let totalQuestion = 0;
let isObjectTest = true;
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
isObjectTest =
  queryParams.isObjectTest == undefined ? true : queryParams.isObjectTest;
isObjectTest = isObjectTest == "false" ? false : true;
const sheetId = queryParams.sheetId;

const sheetName = encodeURIComponent(queryParams.sheetName);
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

function objectTest() {
  $.ajax({
    type: "GET",
    url: sheetURL,
    dataType: "text",
    success: function (response) {
      // var data = $.csv.toArrays(response);

      var json = $.csv.toObjects(response);
      eleObjectTest.removeClass("hidden");
      let countQuestion = json.length;
      let from = queryParams.from ? parseInt(queryParams.from) : 1;
      let to = queryParams.to ? parseInt(queryParams.to) : countQuestion;
      if (from < 1) {
        from = 1;
      }
      if (to > countQuestion) {
        to = countQuestion;
      }
      let randomQuestion = [];
      let mistaskQuestion = [];
      for (let i = from - 1; i < to; i++) {
        randomQuestion.push(json[i]);
      }
      totalQuestion = randomQuestion.length;
      currentQuestion = 0;
      function renderCount() {
        eleStreak.text(countStreak);
        eleError.text(countErorr);
        eleCurrentQuestion.text(currentQuestion + 1);
        eleTotalQuestion.text(totalQuestion);
      }
      renderCount();
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
            if (countErrorTime >= 1 && countTrue >= 2) {
              $(".answers").css("background-color", "");
              countErrorTime = 0;
              countTrue = 0;
              renderQuestion(currentQuestion);
              countStreak++;
              renderCount();
            } else if (countErrorTime === 0) {
              $(".answers").css("background-color", "");
              countErrorTime = 0;
              countTrue = 0;
              renderQuestion(currentQuestion);
              countStreak++;
              renderCount();
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
          countErrorTime++;
          if (countErrorTime === 1) {
            mistaskQuestion.push(randomQuestion[currentQuestion]);
            countErorr++;
            countStreak = 0;
            renderCount();
          }
          e.target.style.backgroundColor = "red";
        }
      });
    },
  });
}
function showQuestions() {
  $.ajax({
    type: "GET",
    url: sheetURL,
    dataType: "text",
    success: function (response) {
      // var data = $.csv.toArrays(response);

      var json = $.csv.toObjects(response);
      eleShowQuestions.removeClass("hidden");
      let countQuestion = json.length;
      let from = queryParams.from ? parseInt(queryParams.from) : 1;
      let to = queryParams.to ? parseInt(queryParams.to) : countQuestion;
      if (from < 1) {
        from = 1;
      }
      if (to > countQuestion) {
        to = countQuestion;
      }
      // random câu hỏi
      let randomQuestion = [];
      for (let i = from - 1; i < to; i++) {
        randomQuestion.push(json[i]);
      }
      totalQuestion = randomQuestion.length;
      currentQuestion = 0;
      function renderQuestion(
        question,
        answer,
        answerA,
        answerB,
        answerC,
        answerD
      ) {
        return `
        <div
        class="question text-[14px] font-bold mb-4 mt-8"
      >${question}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-[600px]">
        <div
          class="${
            answer == 1 ? "bg-green-400" : ""
          } answers answerA option bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer flex justify-center items-center"
          data-id="1"
        >${he.encode(answerA)}</div>
        <div
          class="${
            answer == 2 ? "bg-green-400" : ""
          } answers answerB option bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer flex justify-center items-center"
          data-id="2"
        >${he.encode(answerB)}</div>
        <div
          class="${
            answer == 3 ? "bg-green-400" : ""
          } answers answerC option bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer flex justify-center items-center"
          data-id="3"
        >${he.encode(answerC)}</div>
        <div
          class="${
            answer == 4 ? "bg-green-400" : ""
          } answers answerD option bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer flex justify-center items-center"
          data-id="4"
        >${he.encode(answerD)}</div>
      </div>
        `;
      }
      for (let i = 0; i < totalQuestion; i++) {
        let question = randomQuestion[i];
        let html = renderQuestion(
          question.question,
          question.answer,
          question.answerA,
          question.answerB,
          question.answerC,
          question.answerD
        );
        eleShowQuestions.append(html);
      }
    },
  });
}

if (isObjectTest) {
  objectTest();
} else {
  showQuestions();
}
