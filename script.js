const flow = [
  { label: "INPUT", title: "描述作物與實際症狀", copy: "問題越具體，檢索越有機會找出符合情境的手冊段落。系統將自然語言提問送入後端，不把模型金鑰放在手機端。" },
  { label: "EMBEDDING", title: "把問題轉為語意向量", copy: "系統使用 Gemini embedding 將提問轉成向量，再與知識庫內 277 個手冊段落的向量比較語意相似度。" },
  { label: "RETRIEVAL", title: "取回相似度較高的段落", copy: "目前文字問答會取回前五個較相關段落，並保留作物、原始文件與頁碼，作為後續生成及回查的依據。" },
  { label: "GENERATION", title: "依檢索內容整理繁中回答", copy: "Groq 上的 Llama 3.3 依取回內容整理回答；Tavily 可提供網路補充。若資料不足，回答應保留不確定性。" },
  { label: "CITATION", title: "把手冊頁碼與網路來源一起呈現", copy: "來源標示讓使用者能回到原文查核，也讓測試人員檢查回答是否忠於依據；引用本身不等於農業診斷已獲驗證。" }
];

const setSelected = (selector, selected) => {
  document.querySelectorAll(selector).forEach(item => {
    const active = item === selected;
    item.classList.toggle("selected", active);
    item.setAttribute("aria-pressed", String(active));
  });
};

document.querySelectorAll("[data-flow]").forEach(button => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.flow);
    const item = flow[index];
    if (!item) return;
    setSelected("[data-flow]", button);
    document.querySelector("#flow-no").textContent = String(index + 1).padStart(2, "0");
    document.querySelector("#flow-label").textContent = item.label;
    document.querySelector("#flow-title").textContent = item.title;
    document.querySelector("#flow-copy").textContent = item.copy;
  });
});

const screens = {
  home: { image: "phone-home.webp", alt: "智慧植栽專家系統手機首頁", title: "首頁提供清楚的任務入口", copy: "使用者可由首頁進入症狀查詢、檢視紀錄，並查看所在地的天氣資訊。" },
  answer: { image: "phone-answer.webp", alt: "系統問答與來源顯示畫面", title: "回答與資料來源一起閱讀", copy: "繁體中文建議下方分別列出手冊頁碼與網路補充，方便使用者回到原始資料查核。" },
  history: { image: "phone-history.webp", alt: "系統查詢紀錄畫面", title: "文字與照片諮詢都能回看", copy: "紀錄頁保留過去提問，協助追蹤不同時間的狀況；再次採用建議前仍需核對當下情境。" },
  weather: { image: "phone-weather.webp", alt: "系統天氣與環境資訊畫面", title: "把天氣資訊放回栽培情境", copy: "定位與天氣可協助補充環境背景。介面中的農場感測趨勢目前仍為示範資料。" }
};

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", () => {
    const screen = screens[button.dataset.screen];
    if (!screen) return;
    setSelected("[data-screen]", button);
    const image = document.querySelector("#screen-image");
    image.src = `./assets/${screen.image}`;
    image.alt = screen.alt;
    document.querySelector("#screen-title").textContent = screen.title;
    document.querySelector("#screen-copy").textContent = screen.copy;
  });
});

document.querySelectorAll("[data-video]").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.video;
    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = button.getAttribute("aria-label") || "RAG 概念影片";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    button.closest(".video-stage").replaceChildren(iframe);
  });
});

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
if (menuButton && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  };
  menuButton.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}

const progress = document.querySelector(".reading-progress i");
if (progress) {
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = available > 0 ? Math.min(window.scrollY / available, 1) : 1;
    progress.style.width = `${ratio * 100}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}
