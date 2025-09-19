// Typing Effect
const typing = document.querySelector(".typing");
const text = ["Web Developer", "Designer", "Programmer"];
let i = 0;
let j = 0;
let currentText = "";
let letter = "";

(function type() {
  if (i === text.length) {
    i = 0;
  }
  currentText = text[i];
  letter = currentText.slice(0, ++j);

  typing.textContent = letter;
  if (letter.length === currentText.length) {
    i++;
    j = 0;
    setTimeout(type, 1000);
  } else {
    setTimeout(type, 150);
  }
})();
