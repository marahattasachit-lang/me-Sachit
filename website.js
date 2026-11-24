const lessons = {
  html: {
    eyebrow: "YOUR FIRST MINI LESSON · HTML",
    title: "Start with a hello.",
    description: "HTML gives a web page its structure. Start with a heading, then add a little introduction underneath it.",
    code: "<h1>Hello, world!</h1>\n<p>I'm learning to code.</p>",
    label: "TRY THIS · HTML",
    time: "5 MIN",
  },
  css: {
    eyebrow: "YOUR FIRST MINI LESSON · CSS",
    title: "Give it a little personality.",
    description: "CSS is how you style a page. Try changing its color, then see how a small detail can change the whole feeling.",
    code: "h1 {\n  color: seagreen;\n  margin-bottom: 1rem;\n}",
    label: "TRY THIS · CSS",
    time: "7 MIN",
  },
  python: {
    eyebrow: "YOUR FIRST MINI LESSON · PYTHON",
    title: "Make the computer say hi.",
    description: "Python uses clear instructions to get things done. Run this line and your computer will greet you.",
    code: 'name = "maker"\nprint(f"Hello, {name}!")',
    label: "TRY THIS · PYTHON",
    time: "8 MIN",
  },
};

const demoExamples = {
  html: {
    code: "<h1>Hello, world!</h1>\n<p>I'm learning to code.</p>",
    caption: "A tiny line of HTML can make a whole page.",
    kicker: "A LITTLE HELLO",
    title: "Hello, world!",
    description: "I'm learning to code.\nIt's nice to meet you.",
    previewClass: "",
  },
  css: {
    code: "h1 {\n  color: seagreen;\n  margin-bottom: 1rem;\n}",
    caption: "A few style rules can make a page feel like yours.",
    kicker: "A TOUCH OF STYLE",
    title: "A little more you.",
    description: "Try a new color.\nMake room to breathe.",
    previewClass: "preview-css",
  },
  python: {
    code: 'name = "maker"\nprint(f"Hello, {name}!")',
    caption: "Give your computer an instruction and see what happens.",
    kicker: "YOUR FIRST OUTPUT",
    title: "Hello, maker!",
    description: "That's Python saying hi.\nYou made that happen.",
    previewClass: "preview-python",
  },
};

const storageKey = "code-garden-completed";
const completeButton = document.querySelector("#complete-button");
const completeLabel = document.querySelector("#complete-label");
const lessonFeedback = document.querySelector("#lesson-feedback");
let activePath = "html";

function getCompletedLessons() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(stored) ? stored.filter((path) => path in lessons) : [];
  } catch (error) {
    console.warn("Could not read saved lesson progress.", error);
    return [];
  }
}

function renderProgress() {
  const completed = getCompletedLessons();
  const count = completed.length;
  document.querySelector("#progress-count").textContent = `${count} of 3`;
  document.querySelector("#mini-progress-fill").style.width = `${(count / 3) * 100}%`;

  document.querySelectorAll("[data-status]").forEach((status) => {
    const isComplete = completed.includes(status.dataset.status);
    status.textContent = isComplete ? "Lesson complete ✓" : "Ready when you are";
    status.classList.toggle("is-complete", isComplete);
  });

  const isActiveComplete = completed.includes(activePath);
  completeLabel.textContent = isActiveComplete ? "Completed — click to undo" : "Mark lesson complete";
  completeButton.classList.toggle("is-complete", isActiveComplete);
  completeButton.setAttribute("aria-pressed", String(isActiveComplete));
}

function selectLesson(path) {
  const lesson = lessons[path];
  if (!lesson) return;

  activePath = path;
  document.querySelector("#lesson-eyebrow").textContent = lesson.eyebrow;
  document.querySelector("#lesson-title").textContent = lesson.title;
  document.querySelector("#lesson-description").textContent = lesson.description;
  document.querySelector("#lesson-code").textContent = lesson.code;
  document.querySelector("#example-label").textContent = lesson.label;
  document.querySelector("#lesson-time").textContent = lesson.time;
  lessonFeedback.textContent = "";

  document.querySelectorAll("[data-course]").forEach((button) => {
    const isSelected = button.dataset.course === path;
    button.setAttribute("aria-pressed", String(isSelected));
    button.closest(".path-card").classList.toggle("is-selected", isSelected);
  });

  renderProgress();
  if (window.matchMedia("(max-width: 640px)").matches) {
    document.querySelector("#lesson-panel").scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

document.querySelectorAll("[data-course]").forEach((button) => {
  button.addEventListener("click", () => selectLesson(button.dataset.course));
});

completeButton.addEventListener("click", () => {
  const completed = getCompletedLessons();
  const alreadyComplete = completed.includes(activePath);
  const updated = alreadyComplete
    ? completed.filter((path) => path !== activePath)
    : [...completed, activePath];

  try {
    localStorage.setItem(storageKey, JSON.stringify(updated));
    lessonFeedback.textContent = alreadyComplete
      ? "Lesson moved back to your list."
      : "Lovely work — your progress is saved.";
  } catch (error) {
    console.warn("Could not save lesson progress.", error);
    lessonFeedback.textContent = "Progress could not be saved in this browser.";
  }
  renderProgress();
});

function selectDemoTab(tab, shouldFocus = false) {
  const example = demoExamples[tab.dataset.demo];
  if (!example) return;

  document.querySelectorAll("[data-demo]").forEach((item) => {
    const isSelected = item === tab;
    item.classList.toggle("is-active", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });

  document.querySelector("#demo-code-panel").setAttribute("aria-labelledby", tab.id);
  document.querySelector("#demo-code").textContent = example.code;
  document.querySelector("#demo-line-numbers").textContent = example.code
    .split("\n")
    .map((_, index) => index + 1)
    .join("\n");
  document.querySelector("#demo-caption").textContent = example.caption;
  document.querySelector("#preview-kicker").textContent = example.kicker;
  document.querySelector("#preview-title").textContent = example.title;
  document.querySelector("#preview-description").textContent = example.description;
  document.querySelector("#browser-preview").className = `browser-preview ${example.previewClass}`.trim();
  document.querySelectorAll(".step-dots i").forEach((dot, index) => {
    dot.classList.toggle("selected", index === [...document.querySelectorAll("[data-demo]")].indexOf(tab));
  });
  document.querySelector("#copy-feedback").textContent = "";
  if (shouldFocus) tab.focus();
}

document.querySelectorAll("[data-demo]").forEach((tab) => {
  tab.addEventListener("click", () => selectDemoTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll("[data-demo]")];
    const currentIndex = tabs.indexOf(tab);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    selectDemoTab(tabs[nextIndex], true);
  });
});

document.querySelector("#copy-code").addEventListener("click", async () => {
  const code = document.querySelector("#demo-code").textContent;
  const feedback = document.querySelector("#copy-feedback");
  try {
    await navigator.clipboard.writeText(code);
    feedback.textContent = "Example copied.";
  } catch (error) {
    console.warn("Could not copy the code example.", error);
    feedback.textContent = "Copy isn't available here. Select the code to copy it.";
  }
});

document.querySelectorAll("[data-demo]").forEach((tab, index) => {
  if (index === 0) return;
  tab.tabIndex = -1;
});

document.querySelector('[data-course="html"]').closest(".path-card").classList.add("is-selected");
renderProgress();
