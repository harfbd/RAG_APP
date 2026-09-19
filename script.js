const flow = [
  { kicker: "使用者輸入", title: "描述實際遇到的栽培問題", copy: "提問可包含作物、葉片顏色、生育階段及近期環境變化。描述越完整，檢索與回答就越有條件可參考。" },
  { kicker: "向量比對", title: "搜尋語意相近的手冊內容", copy: "系統把問題轉為向量，與知識庫段落比對相似度，選出較相關的內容。此步驟使用 Gemini embedding。" },
  { kicker: "取回依據", title: "帶出可回查的手冊段落", copy: "檢索結果保留作物、文件與頁碼。文字問答通常取前五個相關段落，讓後續回答有具體參考內容。" },
  { kicker: "整理成文", title: "模型根據資料組織回答", copy: "Groq 的 Llama 3.3 把檢索段落整理成繁體中文建議。系統也可查網路資料補充；若資料不足，應說明不確定並請使用者補充情境。" },
  { kicker: "來源回查", title: "讓農友知道答案從哪裡來", copy: "結果列出手冊頁碼與網路來源。引用可以幫助查核，但仍需要依現場症狀與專家意見判斷。" }
];

document.querySelectorAll("[data-flow]").forEach(button => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.flow);
    document.querySelectorAll("[data-flow]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    document.querySelector(".flow-symbol").textContent = String(index + 1).padStart(2, "0");
    document.querySelector("#flow-kicker").textContent = flow[index].kicker;
    document.querySelector("#flow-title").textContent = flow[index].title;
    document.querySelector("#flow-copy").textContent = flow[index].copy;
  });
});

const screens = {
  home: { image: "phone-home.webp", alt: "智慧植栽專家系統手機首頁截圖", title: "首頁提供明確的操作入口", copy: "農友可以從首頁選擇症狀提問、檢視紀錄，或查看當地天氣資訊。" },
  answer: { image: "phone-answer.webp", alt: "系統問答與手冊來源截圖", title: "閱讀回答，也看得到出處", copy: "回答以繁體中文整理，畫面下方分別列出手冊頁碼及網路參考資料。" },
  history: { image: "phone-history.webp", alt: "系統診斷紀錄畫面截圖", title: "保留過去的諮詢紀錄", copy: "可依文字問題或照片紀錄回看先前內容；重新使用建議時仍需核對當下情境。" },
  weather: { image: "phone-weather.webp", alt: "系統天氣與環境入口畫面截圖", title: "把天氣放回栽培情境", copy: "首頁能顯示天氣資訊；畫面中的農場感測趨勢目前還是示範資料。" }
};

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", () => {
    const screen = screens[button.dataset.screen];
    document.querySelectorAll("[data-screen]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    const image = document.querySelector("#demo-screen");
    image.src = `./assets/${screen.image}`;
    image.alt = screen.alt;
    document.querySelector("#screen-caption-title").textContent = screen.title;
    document.querySelector("#screen-caption-copy").textContent = screen.copy;
  });
});

document.querySelectorAll("[data-video]").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.video;
    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = button.getAttribute("aria-label");
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    button.parentElement.replaceChildren(iframe);
  });
});

const sections = [...document.querySelectorAll("main section[id^='chapter-']")];
const navLinks = [...document.querySelectorAll(".side-nav a")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-18% 0px -60% 0px", threshold: [0, .1, .35] });
  sections.forEach(section => observer.observe(section));
}
