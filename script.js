document.addEventListener("DOMContentLoaded", function () {
  const childNameInput = document.getElementById("childName");
  const mainColorInput = document.getElementById("mainColor");
  const textColorInput = document.getElementById("textColor");
  const titleTextInput = document.getElementById("titleText");

  const emojiChoices = document.querySelectorAll(".emoji-choice");
  const demoBtn = document.getElementById("demoBtn");
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");

  const previewImage = document.getElementById("previewImage");
  const codeOutput = document.getElementById("codeOutput");

  let selectedShape = "sun";

  const previewMap = {
    sun: {
      title: "Сонечко",
      image: "sun.png"
    },
    star: {
      title: "Зірка",
      image: "star.png"
    },
    smile: {
      title: "Смайлик",
      image: "smile.png"
    },
    heart: {
      title: "Сердечко",
      image: "heart.png"
    }
  };

  function escapePythonString(text) {
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
  }

  function updatePreview(shape) {
    const preview = previewMap[shape];

    previewImage.innerHTML = `
      <img src="${preview.image}" alt="${preview.title}" class="preview-real-image">
    `;
  }

  emojiChoices.forEach(function (button) {
    button.addEventListener("click", function () {
      emojiChoices.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");
      selectedShape = button.dataset.shape;
      updatePreview(selectedShape);
    });
  });

  function getShapeCode(shape) {
    if (shape === "sun") {
      return `
t.penup()
t.goto(0, -40)
t.pendown()
t.begin_fill()
t.circle(40)
t.end_fill()

for angle in range(12):
    t.penup()
    t.goto(0, 0)
    t.setheading(angle * 30)
    t.forward(55)
    t.pendown()
    t.forward(25)
`;
    }

    if (shape === "star") {
      return `
t.penup()
t.goto(0, -30)
t.pendown()
t.begin_fill()
for _ in range(5):
    t.forward(140)
    t.right(144)
t.end_fill()
`;
    }

    if (shape === "smile") {
      return `
t.penup()
t.goto(0, -80)
t.pendown()
t.begin_fill()
t.circle(80)
t.end_fill()

t.color("black")
t.penup()
t.goto(-28, 30)
t.pendown()
t.begin_fill()
t.circle(8)
t.end_fill()

t.penup()
t.goto(28, 30)
t.pendown()
t.begin_fill()
t.circle(8)
t.end_fill()

t.penup()
t.goto(-35, -10)
t.setheading(-60)
t.pendown()
t.circle(40, 120)
`;
    }

    return `
# Сердечко
t.penup()
t.goto(0, -120)
t.pendown()
t.begin_fill()

t.left(140)
t.forward(112)
for _ in range(200):
    t.right(1)
    t.forward(1)

t.left(120)
for _ in range(200):
    t.right(1)
    t.forward(1)

t.forward(112)
t.end_fill()
`;
  }

  function buildPythonCode() {
    const childName = escapePythonString(childNameInput.value.trim() || "Марко");
    const mainColor = escapePythonString(mainColorInput.value);
    const textColor = escapePythonString(textColorInput.value);

    const defaultTitle =
      selectedShape === "sun"
        ? "Моє сонечко"
        : selectedShape === "star"
        ? "Моя зірка"
        : selectedShape === "smile"
        ? "Мій смайлик"
        : "Моє сердечко";

    const titleText = escapePythonString(titleTextInput.value.trim() || defaultTitle);
    const shapeCode = getShapeCode(selectedShape);

    return `import turtle

child_name = "${childName}"
main_color = "${mainColor}"

t = turtle.Turtle()
t.speed(0)
t.pensize(3)
t.color(main_color)

writer = turtle.Turtle()
writer.hideturtle()
writer.penup()
writer.color("${textColor}")

writer.goto(0, 150)
writer.write(child_name, align="center", font=("Arial", 20, "bold"))

writer.goto(0, 100)
writer.write("${titleText}", align="center", font=("Arial", 14, "normal"))

${shapeCode}

t.hideturtle()

writer.goto(0, -190)
writer.color("${textColor}")
writer.write("Запишись на перший безкоштовний урок", align="center", font=("Arial", 14, "bold"))`;
  }

  function renderResult() {
    const code = buildPythonCode();
    codeOutput.textContent = code;
    updatePreview(selectedShape);
  }

  demoBtn.addEventListener("click", function () {
    childNameInput.value = "Марко";
    mainColorInput.value = "gold";
    textColorInput.value = "purple";
    titleTextInput.value = "Моє сонечко";
    selectedShape = "sun";

    emojiChoices.forEach(function (item) {
      item.classList.remove("active");
      if (item.dataset.shape === "sun") {
        item.classList.add("active");
      }
    });

    renderResult();
  });

  generateBtn.addEventListener("click", function () {
    renderResult();
  });

  copyBtn.addEventListener("click", async function () {
    const textToCopy = codeOutput.textContent.trim();

    if (!textToCopy || textToCopy.includes("Тут з’явиться")) {
      copyBtn.textContent = "Спочатку створіть код";
      setTimeout(function () {
        copyBtn.textContent = "Скопіювати код";
      }, 1800);
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      copyBtn.textContent = "Код скопійовано";
      setTimeout(function () {
        copyBtn.textContent = "Скопіювати код";
      }, 1800);
    } catch (error) {
      copyBtn.textContent = "Не вдалося скопіювати";
      setTimeout(function () {
        copyBtn.textContent = "Скопіювати код";
      }, 1800);
    }
  });

  renderResult();
});