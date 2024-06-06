/* href of the page: localhost:5500?fileName=mon_KtLt.xlsx&from=1&to=10
fileName: tên file excel
from: câu hỏi bắt đầu
to: câu hỏi kết thúc
- nếu không có from và to thì lấy tất cả câu hỏi
- nếu không có fileName thì lấy file mặc định mon_KtLt.xlsx
- nếu người dùng chọn đáp án đúng thì sẽ chuyển qua câu kế tiếp
- nếu người dùng chọn đáp án sai thì sẽ hiện thông báo và chờ người dùng chọn lại
- nếu người dùng chọn đáp án đúng ở câu cuối cùng thì hiện thông báo "Bạn đã hoàn thành bài thi"
khi render ra đáp án thì sẽ ngẫu nhiên vị trí của đáp án đúng
mẫu dữ liệu:
{
    question: "Câu 1: Câu hỏi 1",
    answerA: "A. Đáp án A",
    answerB: "B. Đáp án B",
    answerC: "C. Đáp án C",
    answerD: "D. Đáp án D",
    answer: 1
}
- answer: 1 là đáp án A, 2 là đáp án B, 3 là đáp án C, 4 là đáp án D
*/

const eleQuestion = $(".question");
const eleAnswerA = $(".answerA");
const eleAnswerB = $(".answerB");
const eleAnswerC = $(".answerC");
const eleAnswerD = $(".answerD");
const eleAnswer = $(".answerTrue");
let countError = 0;

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

fetch(`/excel/${queryParams.fileName}`)
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    let data = new Uint8Array(arrayBuffer);
    let workbook = XLSX.read(data, { type: "array" });

    // Lấy tên của sheet đầu tiên
    let firstSheetName = workbook.SheetNames[0];

    // Sử dụng sheet đầu tiên
    let worksheet = workbook.Sheets[firstSheetName];

    // Chuyển đổi sheet thành JSON
    let json = XLSX.utils.sheet_to_json(worksheet);
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
    let mistaskQuestion = [];
    for (let i = from - 1; i < to; i++) {
      randomQuestion.push(json[i]);
    }
    let currentQuestion = from - 1;
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
        if (currentQuestion < to) {
          if (countError >= 1) {
            setTimeout(() => {
              $(".answers").css("background-color", "");
              countError = 0;
              renderQuestion(currentQuestion);
            }, 3000);
          } else {
            $(".answers").css("background-color", "");
            countError = 0;
            renderQuestion(currentQuestion);
          }
        } else {
          alert("Bạn đã hoàn thành bài thi");
        }
      } else {
        countError++;
        if (countError === 1) {
          mistaskQuestion.push(randomQuestion[currentQuestion]);
        }
        e.target.style.backgroundColor = "red";
      }
    });
  })
  .catch((error) => console.error("Error:", error));
