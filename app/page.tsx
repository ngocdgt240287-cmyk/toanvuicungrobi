"use client";

import { useMemo, useState } from "react";
import { lessons, questions, strandLabels, type Strand } from "@/lib/curriculum";

const gradeList = [1, 2, 3, 4, 5] as const;
type WidgetName = "numberline" | "dienes" | "fraction" | "clock" | "shapes" | "cutpaste";
type FractionOperation = "add" | "subtract" | "multiply" | "divide";

export default function HomePage() {
  const [grade, setGrade] = useState<number>(2);
  const [strand, setStrand] = useState<Strand | "ALL">("ALL");
  const [lessonId, setLessonId] = useState("g2-add");
  const [widget, setWidget] = useState<WidgetName>("numberline");
  const [number, setNumber] = useState(37);
  const [addA, setAddA] = useState(278);
  const [addB, setAddB] = useState(145);
  const [showDienesAnswer, setShowDienesAnswer] = useState(false);
  const [fractionDen, setFractionDen] = useState(4);
  const [fractionNum, setFractionNum] = useState(3);
  const [fractionDenB, setFractionDenB] = useState(5);
  const [fractionNumB, setFractionNumB] = useState(2);
  const [fractionOperation, setFractionOperation] = useState<FractionOperation>("add");
  const [shapeLength, setShapeLength] = useState(6);
  const [shapeWidth, setShapeWidth] = useState(4);
  const [shapeHeight, setShapeHeight] = useState(3);
  const [resizeHandle, setResizeHandle] = useState<"length" | "width" | "square" | null>(null);
  const [planeShape, setPlaneShape] = useState<"rectangle" | "square" | "triangle" | "trapezoid" | "cuboid" | "cube">("rectangle");
  const [cutOrder, setCutOrder] = useState(["A", "B", "C"]);
  const [dragPiece, setDragPiece] = useState("");
  const [cutSlots, setCutSlots] = useState<string[]>(["", ""]);
  const [shapeMode, setShapeMode] = useState<"perimeter" | "area" | "volume">("perimeter");
  const [wordProblems, setWordProblems] = useState<Array<{story:string;question:string;solution:string;answer:string;unit:string}>>([]);
  const [problemVisible, setProblemVisible] = useState(false);
  const [clockHour, setClockHour] = useState(3);
  const [clockMinute, setClockMinute] = useState(30);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [ask, setAsk] = useState("");
  const [answer, setAnswer] = useState("");
  const [aiMode, setAiMode] = useState<"concept" | "hint" | "review" | "practice">("concept");
  const [busy, setBusy] = useState(false);
  const [aiError, setAiError] = useState("");

  const gradeLessons = useMemo(() => lessons.filter(l => l.grade === grade && (strand === "ALL" || l.strand === strand)), [grade, strand]);
  const currentLesson = gradeLessons.find(l => l.id === lessonId) ?? gradeLessons[0];
  const gradeQuestions = useMemo(() => questions.filter(q => q.grade === grade && (strand === "ALL" || q.strand === strand)), [grade, strand]);
  const question = gradeQuestions.length ? gradeQuestions[questionIndex % gradeQuestions.length] : null;

  function resetQuiz(nextGrade = grade, nextStrand: Strand | "ALL" = strand) {
    setQuestionIndex(0); setSelected(""); setChecked(false); setHintOpen(false);
  }
  function chooseGrade(g: number) {
    setGrade(g); setStrand("ALL"); setQuestionIndex(0); setSelected(""); setChecked(false); setHintOpen(false);
    const first = lessons.find(l => l.grade === g);
    if (first) setLessonId(first.id);
  }
  function chooseStrand(s: Strand | "ALL") {
    setStrand(s); setQuestionIndex(0); setSelected(""); setChecked(false); setHintOpen(false);
    const first = lessons.find(l => l.grade === grade && (s === "ALL" || l.strand === s));
    if (first) setLessonId(first.id);
  }
  function checkAnswer() {
    if (!question || !selected || checked) return;
    setChecked(true);
    if (selected === question.answer && !doneIds.includes(question.id)) {
      setScore(n => n + 1);
      setDoneIds(ids => [...ids, question.id]);
    }
  }
  function nextQuestion() {
    setQuestionIndex(i => i + 1); setSelected(""); setChecked(false); setHintOpen(false);
  }
  async function askRobi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ask.trim() || busy) return;
    setBusy(true); setAiError(""); setAnswer("");
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: ask.trim(), grade, mode: aiMode })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Robi chưa trả lời được.");
      setAnswer(data.answer);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally { setBusy(false); }
  }

  const tens = Math.floor(addA / 10) + Math.floor(addB / 10);
  const units = (addA % 10) + (addB % 10);
  const regroupedTens = tens + Math.floor(units / 10);
  const regroupedUnits = units % 10;
  const sum = addA + addB;
  const placeValue = (n: number) => ({ hundreds: Math.floor(n / 100), tens: Math.floor((n % 100) / 10), units: n % 10 });
  const placeA = placeValue(addA), placeB = placeValue(addB), placeSum = placeValue(sum);
  const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
  const fractionRaw = (() => {
    if (fractionOperation === "add") return [fractionNum * fractionDenB + fractionNumB * fractionDen, fractionDen * fractionDenB];
    if (fractionOperation === "subtract") return [fractionNum * fractionDenB - fractionNumB * fractionDen, fractionDen * fractionDenB];
    if (fractionOperation === "multiply") return [fractionNum * fractionNumB, fractionDen * fractionDenB];
    if (fractionNumB === 0) return [0, 1];
    return [fractionNum * fractionDenB, fractionDen * fractionNumB];
  })();
  const fractionDivisor = gcd(fractionRaw[0], fractionRaw[1]) || 1;
  const fractionResultNum = fractionRaw[0] / fractionDivisor;
  const fractionResultDen = fractionRaw[1] / fractionDivisor;
  function createWordProblems() {
    const rand = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const tasks: Array<{story:string;question:string;solution:string;answer:string;unit:string;difficulty:string}> = [];
    const isSquare = planeShape === "square";
    const mode = shapeMode;
    const unit = isSquare && mode === "area" ? "cm²" : mode === "area" ? "m²" : "cm";
    // Mỗi lượt gồm đủ 5 câu theo tiến trình: 1 dễ, 2 vừa sức, 2 thử thách.
    // Thay đổi số liệu và ngữ cảnh ở mỗi lượt để hạn chế lặp nguyên câu.
    const levels = ["Dễ", "Vừa sức", "Vừa sức", "Thử thách", "Thử thách"];
    for (let i = 0; i < 5; i++) {
      const difficulty = levels[i];
      const max = difficulty === "Dễ" ? 12 : difficulty === "Vừa sức" ? 24 : 45;
      const a = rand(4, max);
      const b = isSquare ? a : rand(3, Math.max(4, difficulty === "Thử thách" ? 28 : max));
      const p = isSquare ? 4*a : 2*(a+b);
      const area = a*b;
      const context = ["khu vườn", "tấm bìa", "sân trường", "mảnh đất", "bảng trang trí", "thảm trải sàn"][rand(0,5)];
      let story = "";
      let question = "";
      let solution = "";
      let answer = 0;
      if (mode === "volume") {
        const length = rand(2, difficulty === "Thử thách" ? 12 : 8);
        const width = planeShape === "cube" ? length : rand(2, difficulty === "Thử thách" ? 10 : 7);
        const height = planeShape === "cube" ? length : rand(2, difficulty === "Thử thách" ? 9 : 6);
        const volume = length * width * height;
        story = planeShape === "cube" ? `Một hộp quà hình lập phương có cạnh ${length} cm.` : `Một bể cá hình hộp chữ nhật dài ${length} cm, rộng ${width} cm và cao ${height} cm.`;
        question = "Tính thể tích hình khối đó.";
        answer = volume;
        solution = `Thể tích là: ${length} × ${width} × ${height} = ${volume} (cm³).`;
      } else if (mode === "perimeter") {
        if (i === 0) {
          story = isSquare ? `Một ${context} hình vuông có cạnh ${a} cm.` : `Một ${context} hình chữ nhật dài ${a} cm, rộng ${b} cm.`;
          question = "Tính chu vi hình đã cho.";
          answer = p;
          solution = isSquare ? `Chu vi hình vuông là: ${a} × 4 = ${p} (cm).` : `Chu vi hình chữ nhật là: (${a} + ${b}) × 2 = ${p} (cm).`;
        } else if (i <= 2) {
          story = isSquare ? `Người ta viền dây quanh một ${context} hình vuông cạnh ${a} m.` : `Một ${context} hình chữ nhật dài ${a} m, rộng ${b} m cần được làm hàng rào xung quanh.`;
          question = "Cần bao nhiêu mét dây (hoặc hàng rào) để đi một vòng quanh hình?";
          answer = p;
          solution = isSquare ? `Chu vi là: ${a} × 4 = ${p} (m).` : `Chu vi là: (${a} + ${b}) × 2 = ${p} (m).`;
        } else if (i === 3) {
          const fence = p-rand(2, Math.min(8, Math.max(2,p-1)));
          story = isSquare ? `Một sân chơi hình vuông có cạnh ${a} cm. Người ta chừa một lối vào dài ${p-fence} m, phần còn lại được rào.` : `Một khu đất hình chữ nhật dài ${a} m, rộng ${b} m. Người ta chừa cổng rộng ${p-fence} m.`;
          question = "Tính chiều dài hàng rào cần dùng, không tính phần cổng.";
          answer = fence;
          solution = `Chu vi khu đất là ${isSquare?`${a} × 4`:`(${a} + ${b}) × 2`} = ${p} (m).\nHàng rào cần dùng: ${p} − ${p-fence} = ${fence} (cm).`;
        } else {
          const given = isSquare ? a : a;
          story = isSquare ? `Một hình vuông có chu vi ${p} cm.` : `Một hình chữ nhật có chiều dài ${a} cm và chu vi ${p} cm.`;
          question = isSquare ? "Tính độ dài cạnh hình vuông." : "Tính chiều rộng hình chữ nhật.";
          answer = isSquare ? a : b;
          solution = isSquare ? `Độ dài cạnh là: ${p} : 4 = ${a} (cm).` : `Nửa chu vi là: ${p} : 2 = ${a+b} (cm).\nChiều rộng là: ${a+b} − ${a} = ${b} (cm).`;
        }
      } else {
        if (i === 0) {
          story = isSquare ? `Một tấm bìa hình vuông có cạnh ${a} cm.` : `Một ${context} hình chữ nhật dài ${a} cm, rộng ${b} cm.`;
          question = "Tính diện tích hình đã cho.";
          answer = area;
          solution = `Diện tích là: ${a} × ${b} = ${area} (${unit}).`;
        } else if (i <= 2) {
          story = isSquare ? `Một nền trang trí hình vuông có cạnh ${a} cm.` : `Một nền nhà hình chữ nhật dài ${a} m và rộng ${b} m.`;
          question = "Cần bao nhiêu đơn vị diện tích để phủ kín bề mặt đó?";
          answer = area;
          solution = `Diện tích cần phủ là: ${a} × ${b} = ${area} (${unit}).`;
        } else if (i === 3) {
          const tiles = rand(2,8);
          story = `Một ${context} có diện tích ${area*tiles} ${unit} được chia thành ${tiles} phần bằng nhau.`;
          question = "Diện tích mỗi phần là bao nhiêu?";
          answer = area;
          solution = `Diện tích mỗi phần là: ${area*tiles} : ${tiles} = ${area} (${unit}).`;
        } else {
          story = isSquare ? `Một hình vuông có diện tích ${area} cm².` : `Một hình chữ nhật có diện tích ${area} m² và chiều dài ${a} m.`;
          question = isSquare ? "Tìm độ dài cạnh hình vuông." : "Tìm chiều rộng hình chữ nhật.";
          answer = isSquare ? a : b;
          solution = isSquare ? `Vì ${a} × ${a} = ${area}, cạnh hình vuông là ${a} cm.` : `Chiều rộng là: ${area} : ${a} = ${b} (m).`;
        }
      }
      tasks.push({story, question, solution:`${solution}\nĐáp số: ${answer} ${unit}.`, answer:String(answer), unit, difficulty});
    }
    setWordProblems(tasks);
  }

  const fractionOperationLabels: Record<FractionOperation, string> = { add: "Cộng", subtract: "Trừ", multiply: "Nhân", divide: "Chia" };
  const fractionSymbols: Record<FractionOperation, string> = { add: "+", subtract: "−", multiply: "×", divide: "÷" };

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#home"><span className="brand-icon">✦</span><span>Toán Vui <small>cùng Robi</small></span></a>
        <nav><a href="#bai-hoc">Bài học</a><a href="#thuc-hanh">Thực hành</a><a href="#luyen-tap">Luyện tập</a><a href="#hoi-robi">Hỏi Robi</a></nav>
        <div className="score">⭐ {score} điểm</div>
      </header>

      <section className="hero" id="home">
        <div className="hero-text">
          <span className="eyebrow">HỌC TOÁN QUA KHÁM PHÁ</span>
          <h1>Khám phá Toán học,<br/><em>vui mỗi ngày!</em></h1>
          <p>Cùng Robi học từng bước, thao tác với hình ảnh và luyện tập theo khối lớp của em.</p>
          <a className="button primary" href="#bai-hoc">Bắt đầu học <span>→</span></a>
          <div className="hero-check">✓ Bài học · Công cụ trực quan · Luyện tập · Trợ lý học tập</div>
        </div>
        <div className="hero-visual" aria-label="Hình minh họa robot học Toán">
          <div className="spark spark-a">✦</div><div className="spark spark-b">✧</div>
          <div className="robot"><div className="antenna"><i/></div><div className="head"><div className="ear left"/><div className="ear right"/><div className="eyes"><i/><i/></div><div className="mouth"/></div><div className="body"><b>R</b></div><div className="arm arm-left"/><div className="arm arm-right"/><div className="leg leg-left"/><div className="leg leg-right"/></div>
          <div className="bubble">Chào bạn! 👋<small>Mình học cùng nhau nhé!</small></div><div className="math-bubble">2 + 3 = <b>5</b></div><div className="shape-circle"/><div className="shape-triangle"/>
        </div>
      </section>

      <section className="section" id="bai-hoc">
        <div className="section-title"><div><span className="eyebrow">LỘ TRÌNH HỌC TẬP</span><h2>Em đang học lớp mấy?</h2></div><p>Chọn lớp để xem bài học và câu hỏi phù hợp.</p></div>
        <div className="grades">
          {gradeList.map((g, i) => <button key={g} onClick={() => chooseGrade(g)} className={`grade grade-${g} ${grade === g ? "active" : ""}`} aria-pressed={grade === g}><span>{["🧸","🚀","🦊","🪐","🦉"][i]}</span><b>Lớp {g}</b><small>{["Làm quen","Khám phá","Luyện tư duy","Mở rộng","Bứt phá"][i]}</small><i>↗</i></button>)}
        </div>
        <div className="filters"><span>Mạch kiến thức:</span><button className={strand === "ALL" ? "chosen" : ""} onClick={() => chooseStrand("ALL")}>Tất cả</button>{(Object.keys(strandLabels) as Strand[]).map(s => <button key={s} className={strand === s ? "chosen" : ""} onClick={() => chooseStrand(s)}>{strandLabels[s]}</button>)}</div>
        <div className="lesson-layout">
          <aside className="lesson-list">
            <div className="panel-heading"><div><span className="eyebrow">DANH SÁCH BÀI</span><h3>Bài học lớp {grade}</h3></div><span className="count">{gradeLessons.length} bài mẫu</span></div>
            {gradeLessons.map((l, i) => <button key={l.id} className={`lesson-item ${currentLesson?.id === l.id ? "selected" : ""}`} onClick={() => setLessonId(l.id)}><span className={`lesson-number n-${i % 4}`}>{String(i + 1).padStart(2,"0")}</span><span><b>{l.title}</b><small>{strandLabels[l.strand]}</small></span><span className="chevron">›</span></button>)}
            <p className="disclaimer">Các bài trong bản này là khung nội dung mẫu, cần giáo viên đối chiếu với SGK KNTT trước khi dùng chính thức.</p>
          </aside>
          <article className="lesson-detail">
            {currentLesson ? <>
              <div className="lesson-top"><span className="lesson-label">BÀI HỌC MẪU · LỚP {grade}</span><span className="status">● Sẵn sàng khám phá</span></div>
              <h3>{currentLesson.title}</h3>
              <div className="objective"><b>🎯 Mục tiêu</b><p>{currentLesson.objective}</p></div>
              <h4>Em cần nhớ</h4><p className="lesson-summary">{currentLesson.summary}</p>
              <div className="example"><span>Ví dụ</span><p>{currentLesson.example}</p></div>
              <h4>Cùng thực hiện</h4><ol className="steps">{currentLesson.steps.map((s,i)=><li key={s}><span>{i+1}</span>{s}</li>)}</ol>
              <button className="button primary" onClick={() => document.getElementById("luyen-tap")?.scrollIntoView({behavior:"smooth"})}>Làm bài luyện tập <span>→</span></button>
            </> : <p>Chưa có bài học trong bộ lọc này.</p>}
          </article>
        </div>
      </section>

      <section className="section practice-section" id="thuc-hanh">
        <div className="section-title"><div><span className="eyebrow">PHÒNG THỰC HÀNH</span><h2>Chạm, thử và khám phá</h2></div><p>Các mô phỏng nhỏ giúp em nhìn thấy ý tưởng Toán học.</p></div>
        <div className="widget-tabs" role="tablist" aria-label="Chọn công cụ trực quan">
          <button className={widget==="numberline"?"tab active":"tab"} onClick={()=>setWidget("numberline")} role="tab" aria-selected={widget==="numberline"}>↔ Tia số 0–100</button>
          <button className={widget==="dienes"?"tab active":"tab"} onClick={()=>setWidget("dienes")} role="tab" aria-selected={widget==="dienes"}>▦ Gộp đến hàng nghìn</button>
          <button className={widget==="fraction"?"tab active":"tab"} onClick={()=>setWidget("fraction")} role="tab" aria-selected={widget==="fraction"}>◕ Phân số & phép tính</button>
          <button className={widget==="clock"?"tab active":"tab"} onClick={()=>setWidget("clock")} role="tab" aria-selected={widget==="clock"}>◷ Đồng hồ</button>
          <button className={widget==="cutpaste"?"tab active":"tab"} onClick={()=>setWidget("cutpaste")} role="tab" aria-selected={widget==="cutpaste"}>✂ Cắt ghép hình</button>
          <button className={widget==="shapes"?"tab active":"tab"} onClick={()=>setWidget("shapes")} role="tab" aria-selected={widget==="shapes"}>▱ Chu vi · Diện tích · Thể tích</button>
        </div>
        <div className="widget-card">
          {widget==="numberline" && <div className="number-widget"><div className="widget-copy"><span className="eyebrow">MÔ PHỎNG 01</span><h3>Robi nhảy trên tia số 0–100</h3><p>Kéo thanh trượt hoặc chọn mốc chục. Robi luôn đứng theo đúng vị trí số trên tia.</p><div className="number-big">Robi đang ở số <b>{number}</b></div><label className="range-label">Vị trí của Robi: <b>{number}</b><input type="range" min="0" max="100" step="1" value={number} onChange={e=>setNumber(Number(e.target.value))}/></label><div className="button-row"><button className="button secondary" onClick={()=>setNumber(n=>Math.max(0,n-1))} disabled={number===0}>← Lùi 1</button><button className="button primary" onClick={()=>setNumber(n=>Math.min(100,n+1))} disabled={number===100}>Tiến 1 →</button><button className="button secondary" onClick={()=>setNumber(0)}>Về 0</button></div></div><div className="number-scene number-scene-wide"><div className="jumping-robot" style={{left:`${number}%`, transform:number===0?"translateX(0)":number===100?"translateX(-100%)":"translateX(-50%)"}}>🤖<span>{number}</span></div><div className="number-axis number-axis-100">{Array.from({length:11},(_,i)=><button key={i} style={{left:`${i*10}%`,transform:i===0?"translateX(0)":i===10?"translateX(-100%)":"translateX(-50%)"}} className={i*10===number?"current":""} onClick={()=>setNumber(i*10)} aria-label={`Chọn số ${i*10}`}><i/><b>{i*10}</b></button>)}</div><div className="number-current-note">Mốc gần nhất được đánh dấu theo từng chục; kéo thanh trượt để chọn số bất kỳ từ 0 đến 100.</div><div className="tip">💡 Tia số tăng dần từ trái sang phải. Số 0 ở đầu tia và số 100 ở cuối tia.</div></div></div>}
          {widget==="dienes" && <div className="dienes-widget"><div className="widget-copy"><span className="eyebrow">MÔ PHỎNG 02</span><h3>Gộp số đến hàng nghìn</h3><p>Nhập hai số từ 0 đến 999 để quan sát hàng trăm, hàng chục và hàng đơn vị khi cộng.</p><label className="range-label">Số thứ nhất (0–999): <b>{addA}</b><input type="range" min="0" max="999" value={addA} onChange={e=>{setAddA(Number(e.target.value));setShowDienesAnswer(false)}}/></label><label className="range-label">Số thứ hai (0–999): <b>{addB}</b><input type="range" min="0" max="999" value={addB} onChange={e=>{setAddB(Number(e.target.value));setShowDienesAnswer(false)}}/></label><button className="button primary" onClick={()=>setShowDienesAnswer(v=>!v)}>{showDienesAnswer?"Ẩn cách gộp":"Xem cách gộp"}</button></div><div className="place-value-scene"><div className="place-value-equation"><b>{addA}</b><span>+</span><b>{addB}</b><span>=</span><b>{showDienesAnswer?sum:"?"}</b></div><div className="place-columns"><div><strong>Hàng trăm</strong><div className="place-cubes">{Array.from({length:Math.min(9,placeA.hundreds)},(_,i)=><i key={'a-h'+i}/>)}</div><small>Số 1: {placeA.hundreds} trăm</small><div className="place-cubes">{Array.from({length:Math.min(9,placeB.hundreds)},(_,i)=><i key={'b-h'+i}/>)}</div><small>Số 2: {placeB.hundreds} trăm</small></div><div><strong>Hàng chục</strong><div className="place-rods">{Array.from({length:placeA.tens},(_,i)=><i key={'a-t'+i}/>)}</div><small>Số 1: {placeA.tens} chục</small><div className="place-rods">{Array.from({length:placeB.tens},(_,i)=><i key={'b-t'+i}/>)}</div><small>Số 2: {placeB.tens} chục</small></div><div><strong>Hàng đơn vị</strong><div className="place-units">{Array.from({length:placeA.units},(_,i)=><i key={'a-u'+i}/>)}</div><small>Số 1: {placeA.units} đơn vị</small><div className="place-units">{Array.from({length:placeB.units},(_,i)=><i key={'b-u'+i}/>)}</div><small>Số 2: {placeB.units} đơn vị</small></div></div>{showDienesAnswer&&<div className="answer-reveal"><b>Kết quả: {sum}</b><p>{addA} = {placeA.hundreds} trăm + {placeA.tens} chục + {placeA.units} đơn vị.</p><p>{addB} = {placeB.hundreds} trăm + {placeB.tens} chục + {placeB.units} đơn vị.</p><p>Tổng {sum} gồm {placeSum.hundreds} trăm, {placeSum.tens} chục và {placeSum.units} đơn vị. Nếu tổng từ 1 000 trở lên, ta có thể xuất hiện hàng nghìn.</p></div>}<p className="tip">Các ô và thanh màu là mô hình minh họa theo giá trị hàng; số lượng khối được rút gọn để hình không quá rối.</p></div></div>}
          {widget==="fraction" && <div className="fraction-widget fraction-widget-expanded"><div className="widget-copy"><span className="eyebrow">MÔ PHỎNG 03</span><h3>Phân số và bốn phép tính</h3><p>Điều chỉnh tử số, mẫu số từ 1 đến 100. Chọn phép tính để xem kết quả; kết quả được rút gọn khi có thể.</p><label className="range-label">Tử số phân số A: <b>{fractionNum}</b><input type="range" min="0" max="100" value={fractionNum} onChange={e=>setFractionNum(Number(e.target.value))}/></label><label className="range-label">Mẫu số phân số A: <b>{fractionDen}</b><input type="range" min="1" max="100" value={fractionDen} onChange={e=>setFractionDen(Number(e.target.value))}/></label><label className="range-label">Tử số phân số B: <b>{fractionNumB}</b><input type="range" min="0" max="100" value={fractionNumB} onChange={e=>setFractionNumB(Number(e.target.value))}/></label><label className="range-label">Mẫu số phân số B: <b>{fractionDenB}</b><input type="range" min="1" max="100" value={fractionDenB} onChange={e=>setFractionDenB(Number(e.target.value))}/></label><label className="range-label">Phép tính<select className="operation-select" value={fractionOperation} onChange={e=>setFractionOperation(e.target.value as FractionOperation)}><option value="add">Cộng (+)</option><option value="subtract">Trừ (−)</option><option value="multiply">Nhân (×)</option><option value="divide">Chia (÷)</option></select></label></div><div className="fraction-visual"><div className="fraction-pair"><div><strong>Phân số A</strong><div className="fraction-large"><span>{fractionNum}</span><i></i><span>{fractionDen}</span></div><div className="fraction-grid fraction-grid-100" style={{gridTemplateColumns:`repeat(10,minmax(8px,1fr))`}}>{Array.from({length:100},(_,i)=><div key={i} className={`fraction-cell ${i<Math.round(fractionNum/fractionDen*100)?"filled":""}`} aria-label={`Ô ${i+1}`}/>)}</div><small>Hình minh họa tỉ lệ phần đã tô.</small></div><div className="fraction-op-symbol">{fractionSymbols[fractionOperation]}</div><div><strong>Phân số B</strong><div className="fraction-large"><span>{fractionNumB}</span><i></i><span>{fractionDenB}</span></div><div className="fraction-grid fraction-grid-100" style={{gridTemplateColumns:`repeat(10,minmax(8px,1fr))`}}>{Array.from({length:100},(_,i)=><div key={i} className={`fraction-cell ${i<Math.round(fractionNumB/fractionDenB*100)?"filled":""}`} aria-label={`Ô ${i+1}`}/>)}</div><small>Hình minh họa tỉ lệ phần đã tô.</small></div></div><div className="fraction-result"><span>Kết quả {fractionOperationLabels[fractionOperation].toLowerCase()}</span><strong>{fractionOperation === "divide" && fractionNumB === 0 ? "Không xác định" : <span className="fraction-stacked"><span>{fractionResultNum}</span><i></i><span>{fractionResultDen}</span></span>}</strong><p><span className="fraction-inline">{fractionNum}<i></i>{fractionDen}</span> {fractionSymbols[fractionOperation]} <span className="fraction-inline">{fractionNumB}<i></i>{fractionDenB}</span> = {fractionOperation === "divide" && fractionNumB === 0 ? "không xác định (không thể chia cho 0)" : <span className="fraction-inline result-inline">{fractionResultNum}<i></i>{fractionResultDen}</span>}</p><small>Phép chia cho phân số bằng 0 không xác định. Hãy chọn tử số B lớn hơn 0 để thực hiện phép chia.</small></div><p className="tip">Mỗi hình lưới 10 × 10 minh họa tỉ lệ phần trăm của một đơn vị. Kết quả phép tính được tính theo quy tắc phân số; hình lưới chỉ là minh họa tỉ lệ, không phải hình biểu diễn chính xác mọi phân số.</p></div></div>}
          {widget==="clock" && <div className="clock-widget"><div className="widget-copy"><span className="eyebrow">MÔ PHỎNG 04</span><h3>Khám phá mặt đồng hồ</h3><p>Điều chỉnh giờ và phút rồi quan sát kim đồng hồ thay đổi.</p><label className="range-label">Giờ: <b>{clockHour}</b><input type="range" min="1" max="12" value={clockHour} onChange={e=>setClockHour(Number(e.target.value))}/></label><label className="range-label">Phút: <b>{String(clockMinute).padStart(2,"0")}</b><input type="range" min="0" max="55" step="5" value={clockMinute} onChange={e=>setClockMinute(Number(e.target.value))}/></label><div className="clock-readout">🕒 {clockHour}:{String(clockMinute).padStart(2,"0")}</div></div><div className="clock-stage"><div className="clock-face">{Array.from({length:12},(_,i)=><span key={i} className="clock-number" style={{transform:`translate(-50%,-50%) rotate(${i*30}deg) translateY(-112px) rotate(${-i*30}deg)`}}>{i===0?12:i}</span>)}<div className="clock-hand hour-hand" style={{transform:`translateX(-50%) rotate(${clockHour%12*30+clockMinute/2}deg)`}}/><div className="clock-hand minute-hand" style={{transform:`translateX(-50%) rotate(${clockMinute*6}deg)`}}/><div className="clock-pin"/></div><p className="tip">Kim phút quay một vòng trong 60 phút. Kim giờ di chuyển chậm hơn.</p></div></div>}
          {widget==="shapes" && <div className="shapes-widget">
            <div className="widget-copy">
              <span className="eyebrow">MÔ PHỎNG 05 · HÌNH HỌC VÀ ĐO LƯỜNG</span>
              <h3>Khám phá chu vi, diện tích và thể tích</h3>
              <p>Điều chỉnh số đo, quan sát hình và tạo nhiều bài toán có lời văn để luyện tập.</p>
              <label className="range-label">Nội dung cần học:
                <select className="operation-select" value={shapeMode} onChange={e=>{const v=e.target.value as typeof shapeMode;setShapeMode(v);setWordProblems([]);if(v==="volume")setPlaneShape("cuboid");else if(planeShape==="cube"||planeShape==="cuboid")setPlaneShape("rectangle");}}><option value="perimeter">Chu vi</option><option value="area">Diện tích</option><option value="volume">Thể tích hình khối</option></select>
              </label>
              <label className="range-label">Chọn hình:
                <select className="operation-select" value={planeShape} onChange={e=>{setPlaneShape(e.target.value as typeof planeShape);setWordProblems([]);}}>
                  {shapeMode==="volume" ? <><option value="cuboid">Hình hộp chữ nhật</option><option value="cube">Hình lập phương</option></> : <><option value="rectangle">Hình chữ nhật</option><option value="square">Hình vuông</option><option value="triangle">Hình tam giác (quan sát cạnh)</option><option value="trapezoid">Hình tứ giác (minh họa cạnh)</option></>}
                </select>
              </label>
              {shapeMode==="volume" ? <>
                <label className="range-label">{planeShape==="cube"?"Độ dài cạnh":"Chiều dài"}: <b>{shapeLength} cm</b><input type="range" min="1" max="100" value={shapeLength} onChange={e=>setShapeLength(Number(e.target.value))}/></label>
                {planeShape==="cuboid" && <label className="range-label">Chiều rộng: <b>{shapeWidth} cm</b><input type="range" min="1" max="100" value={shapeWidth} onChange={e=>setShapeWidth(Number(e.target.value))}/></label>}
                {planeShape==="cuboid" && <label className="range-label">Chiều cao: <b>{shapeHeight} cm</b><input type="range" min="1" max="100" value={shapeHeight} onChange={e=>setShapeHeight(Number(e.target.value))}/></label>}
              </> : <>
                <label className="range-label">{planeShape==="square"?"Độ dài một cạnh":"Chiều dài"}: <b>{shapeLength} cm</b><input type="range" min="1" max="100" value={shapeLength} onChange={e=>{const v=Number(e.target.value);setShapeLength(v);if(planeShape==="square")setShapeWidth(v);}}/></label>
                {planeShape!=="square" && <label className="range-label">Chiều rộng: <b>{shapeWidth} cm</b><input type="range" min="1" max="100" value={shapeWidth} onChange={e=>setShapeWidth(Number(e.target.value))}/></label>}
                {planeShape==="triangle" && <label className="range-label">Cạnh thứ ba: <b>{shapeHeight} cm</b><input type="range" min="1" max="100" value={shapeHeight} onChange={e=>setShapeHeight(Number(e.target.value))}/></label>}
                {(planeShape==="rectangle" || planeShape==="square") && <small className="drag-hint">Em cũng có thể kéo các nút tròn trên hình để thay đổi độ dài cạnh.</small>}
              </>}
              <button className="button primary" onClick={createWordProblems} disabled={shapeMode!=="volume" && planeShape!=="square" && planeShape!=="rectangle"}>🎲 Tạo 5 câu hỏi mới</button>
            </div>
            <div className="shape-visuals">
              <div className="shape-panel geometry-panel"><strong>{shapeMode==="volume"?(planeShape==="cube"?"Hình lập phương":"Hình hộp chữ nhật"):({rectangle:"Hình chữ nhật",square:"Hình vuông",triangle:"Hình tam giác",trapezoid:"Hình tứ giác",cuboid:"Hình hộp chữ nhật",cube:"Hình lập phương"})[planeShape]}</strong>
                {shapeMode==="volume" ? <svg viewBox="0 0 420 300" role="img" aria-label="Hình khối có chiều dài, chiều rộng và chiều cao"><polygon points="95,95 245,95 315,55 165,55" fill="#e5efff" stroke="#5274d8" strokeWidth="3"/><polygon points="245,95 315,55 315,205 245,245" fill="#d7e7ff" stroke="#5274d8" strokeWidth="3"/><polygon points="95,95 245,95 245,245 95,245" fill="#f0f6ff" stroke="#5274d8" strokeWidth="3"/><text x="170" y="82" textAnchor="middle">{shapeLength} cm</text>{planeShape==="cuboid"&&<text x="290" y="165">{shapeWidth} cm</text>}<text x="75" y="175">{planeShape==="cube"?shapeLength:shapeHeight} cm</text></svg> : <svg viewBox="0 0 420 300" role="img" aria-label="Hình hình học có thể kéo nút để thay đổi số đo cạnh" onPointerMove={e=>{if(!resizeHandle)return;const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*420;const y=(e.clientY-r.top)/r.height*300;if(resizeHandle==="length"||resizeHandle==="square"){const v=Math.max(1,Math.min(100,Math.round(((2*x-420)-60)/3)));setShapeLength(v);if(resizeHandle==="square")setShapeWidth(v);}if(resizeHandle==="width")setShapeWidth(Math.max(1,Math.min(100,Math.round(((2*y-300)-40)/2))));}} onPointerUp={()=>setResizeHandle(null)} onPointerCancel={()=>setResizeHandle(null)}><defs><pattern id="geometryGrid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M 12 0 L 0 0 0 12" fill="none" stroke="#dce8f2" strokeWidth="1"/></pattern></defs><rect x="0" y="0" width="420" height="300" fill="url(#geometryGrid)"/>{planeShape==="rectangle"&&(()=>{const w=60+shapeLength*3,h=40+shapeWidth*2,x=(420-w)/2,y=(300-h)/2;return <><rect x={x} y={y} width={w} height={h} rx="2" fill="#dff7ee" stroke="#239b78" strokeWidth="3"/><text x="210" y={y-12} textAnchor="middle">{shapeLength} cm</text><text x={x+w+10} y={y+h/2} dominantBaseline="middle">{shapeWidth} cm</text><text x="210" y={y+h+20} textAnchor="middle">{shapeLength} cm</text><text x={x-42} y={y+h/2} dominantBaseline="middle">{shapeWidth} cm</text><circle cx={x+w} cy={y+h/2} r="9" fill="#239b78" stroke="#fff" strokeWidth="3" style={{cursor:"ew-resize",touchAction:"none"}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setResizeHandle("length");}}/><circle cx={x+w/2} cy={y+h} r="9" fill="#239b78" stroke="#fff" strokeWidth="3" style={{cursor:"ns-resize",touchAction:"none"}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setResizeHandle("width");}}/></>;})()}{planeShape==="square"&&(()=>{const side=60+shapeLength*3,x=(420-side)/2,y=(300-side)/2;return <><rect x={x} y={y} width={side} height={side} rx="2" fill="#e3efff" stroke="#5274d8" strokeWidth="3"/><text x="210" y={y-12} textAnchor="middle">{shapeLength} cm</text><text x="210" y={y+side+20} textAnchor="middle">{shapeLength} cm</text><text x={x-42} y="150" dominantBaseline="middle">{shapeLength} cm</text><text x={x+side+10} y="150" dominantBaseline="middle">{shapeLength} cm</text><circle cx={x+side} cy={y+side/2} r="9" fill="#5274d8" stroke="#fff" strokeWidth="3" style={{cursor:"ew-resize",touchAction:"none"}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setResizeHandle("square");}}/></>;})()}{planeShape==="triangle"&&<polygon points="210,48 75,235 345,235" fill="#fff0d8" stroke="#d78b28" strokeWidth="3"/>}{planeShape==="trapezoid"&&<polygon points="135,65 285,65 350,225 70,225" fill="#f0e8ff" stroke="#8561c5" strokeWidth="3"/>}</svg>}
                <small>{shapeMode==="volume"?"Thể tích cho biết phần không gian mà hình khối chiếm chỗ.":"Kéo nút tròn ở cạnh phải để đổi chiều dài; kéo nút ở cạnh dưới để đổi chiều rộng. Các cạnh có thể điều chỉnh từ 1 đến 100 cm; số đo và kết quả cập nhật ngay."}</small>
              </div>
              <div className="shape-results"><div><span>{shapeMode==="volume"?"Thể tích":shapeMode==="area"?"Diện tích":"Chu vi"}</span><b>{shapeMode==="volume"?shapeLength*(planeShape==="cube"?shapeLength:shapeWidth)*(planeShape==="cube"?shapeLength:shapeHeight):planeShape==="square"?(shapeMode==="area"?shapeLength*shapeLength:4*shapeLength):planeShape==="rectangle"?(shapeMode==="area"?shapeLength*shapeWidth:2*(shapeLength+shapeWidth)):"Dùng để quan sát"} {shapeMode==="volume"?"cm³":shapeMode==="area"?(planeShape==="square"||planeShape==="rectangle"?"cm²":""):(planeShape==="square"||planeShape==="rectangle"?"cm":"")}</b></div></div>
              {wordProblems.length>0 && <div className="word-problem-list"><h4>5 câu hỏi dành cho em</h4><p className="question-level-guide">Lộ trình: 1 câu Dễ · 2 câu Vừa sức · 2 câu Thử thách</p>{wordProblems.map((problem,i)=><details className="word-problem" key={`${i}-${problem.answer}-${problem.story}`}><summary><b>Câu {i+1} · {problem.difficulty}:</b> {problem.story}</summary><p>{problem.question}</p><details className="solution-details"><summary>Xem lời giải và đáp số</summary><p style={{whiteSpace:"pre-line"}}>{problem.solution}</p></details></details>)}</div>}
              <p className="tip">Thể tích được giới thiệu qua hình lập phương và hình hộp chữ nhật, sử dụng số đo đơn giản và đơn vị cm³. Với chu vi, diện tích, hãy chọn hình vuông hoặc hình chữ nhật để tạo bài toán; tam giác và tứ giác hiện dùng để quan sát hình.</p>
            </div>
          </div>}
          {widget==="cutpaste" && <TangramWorkshop />}
        </div>
      </section>

      <section className="section quiz-section" id="luyen-tap">
        <div className="section-title"><div><span className="eyebrow">LUYỆN TẬP CỦNG CỐ</span><h2>Thử sức cùng Robi ✨</h2></div><p>Chọn đáp án, kiểm tra và đọc lời giải.</p></div>
        <div className="quiz-layout"><div className="quiz-side"><div className="quiz-star">⭐</div><h3>Em làm được mà!</h3><p>Mỗi lần thử là một cơ hội để hiểu bài hơn.</p><div className="progress"><span style={{width:`${Math.min(100,doneIds.length/questions.length*100)}%`}}/></div><small>Đã trả lời đúng {doneIds.length} câu khác nhau</small></div><div className="quiz-card">{question?<><div className="quiz-meta"><span>CÂU HỎI NHANH</span><b>Lớp {grade} · {question.difficulty}</b></div><h3>{question.prompt}</h3><div className="choices">{question.choices.map(c=><button key={c} className={`choice ${selected===c?"picked":""} ${checked&&c===question.answer?"right":""} ${checked&&selected===c&&c!==question.answer?"wrong":""}`} onClick={()=>!checked&&setSelected(c)} disabled={checked}>{c}{checked&&c===question.answer?<b>✓</b>:null}</button>)}</div><div className="quiz-controls"><button className="link-button" onClick={()=>setHintOpen(v=>!v)}>{hintOpen?"Ẩn gợi ý":"💡 Gợi ý"}</button>{!checked?<button className="button primary" onClick={checkAnswer} disabled={!selected}>Kiểm tra</button>:<button className="button primary" onClick={nextQuestion}>Câu tiếp theo →</button>}</div>{hintOpen&&<div className="feedback hint"><b>💡 Gợi ý:</b> {question.hint}</div>}{checked&&<div className={`feedback ${selected===question.answer?"correct-feedback":"wrong-feedback"}`} role="status"><b>{selected===question.answer?"Chính xác! Giỏi lắm! 🎉":"Chưa đúng lần này. Mình cùng xem nhé!"}</b><p>{question.explanation}</p></div>}</>:<p>Chưa có câu hỏi cho bộ lọc này. Hãy chọn mạch kiến thức khác.</p>}</div></div>
      </section>

      <section className="tutor-section" id="hoi-robi"><div className="tutor-avatar">🤖<span>Robi sẵn sàng!</span></div><div className="tutor-content"><span className="eyebrow">TRỢ LÝ HỌC TẬP</span><h2>Em muốn hỏi điều gì?</h2><p>Robi có thể giải thích khái niệm đơn giản, gợi ý từng bước hoặc giúp em ôn bài. Câu trả lời AI cần được giáo viên kiểm tra khi dùng trong học tập chính thức.</p><div className="mode-buttons"><button className={aiMode==="concept"?"active":""} onClick={()=>setAiMode("concept")}>Giải thích</button><button className={aiMode==="hint"?"active":""} onClick={()=>setAiMode("hint")}>Gợi ý bài</button><button className={aiMode==="review"?"active":""} onClick={()=>setAiMode("review")}>Ôn tập</button><button className={aiMode==="practice"?"active":""} onClick={()=>setAiMode("practice")}>Tạo bài toán</button></div><form className="ask-form" onSubmit={askRobi}><label className="sr-only" htmlFor="ask-robi">Nhập câu hỏi</label><input id="ask-robi" value={ask} onChange={e=>setAsk(e.target.value)} maxLength={500} placeholder={aiMode==="practice" ? "Ví dụ: Hãy tạo một bài toán cộng phù hợp lớp em." : "Ví dụ: Phân số là gì?"} /><button className="button primary" type="submit" disabled={busy||!ask.trim()}>{busy?"Robi đang nghĩ...":"Hỏi Robi ✨"}</button></form>{answer&&<div className="ai-answer" role="status"><b>🤖 Robi trả lời</b><p>{answer}</p></div>}{aiError&&<div className="feedback wrong-feedback" role="alert">{aiError}</div>}<p className="privacy">Đừng nhập tên đầy đủ, địa chỉ, số điện thoại hoặc thông tin riêng tư vào ô trò chuyện.</p></div></section>

      <footer className="footer"><a className="brand" href="#home"><span className="brand-icon">✦</span><span>Toán Vui <small>cùng Robi</small></span></a><p>Học từng chút · Hiểu thật chắc · Vui mỗi ngày 💛</p><small>Phiên bản phát triển thử nghiệm · Nội dung cần giáo viên rà soát</small></footer>
    </main>
  );
}


const tangramPieces = [
  { name: "Tam giác lớn 1", shape: "large", color: "#70b7df", clip: "polygon(0 0, 100% 100%, 0 100%)" },
  { name: "Tam giác lớn 2", shape: "large", color: "#4d9bc9", clip: "polygon(0 0, 100% 100%, 0 100%)" },
  { name: "Tam giác vừa", shape: "medium", color: "#f2bd65", clip: "polygon(0 0, 100% 100%, 0 100%)" },
  { name: "Tam giác nhỏ 1", shape: "small", color: "#b49ae8", clip: "polygon(0 0, 100% 100%, 0 100%)" },
  { name: "Tam giác nhỏ 2", shape: "small", color: "#9275d2", clip: "polygon(0 0, 100% 100%, 0 100%)" },
  { name: "Hình vuông", shape: "square", color: "#f08f8c", clip: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" },
  { name: "Hình bình hành", shape: "para", color: "#e6a8c7", clip: "polygon(25% 0, 100% 0, 75% 100%, 0 100%)" },
];
type TangramPose = { x:number; y:number; rotation:number; flipped:boolean; placed:boolean };
function TangramWorkshop() {
  const [poses,setPoses] = useState<Record<number,TangramPose>>({});
  const [selected,setSelected] = useState<number|null>(null);
  const [modelImage,setModelImage] = useState("");
  const [modelImageName,setModelImageName] = useState("");
  const [feedback,setFeedback] = useState("");
  const [showHint,setShowHint] = useState(false);
  const reset = () => { setPoses({}); setSelected(null); setFeedback(""); setShowHint(false); };
  const rotate = () => { if(selected===null)return; setPoses(old=>({...old,[selected]:{...(old[selected]??{x:50,y:50,flipped:false,placed:false}),rotation:((old[selected]?.rotation??0)+45)%360}})); setFeedback(""); };
  const flip = () => { if(selected===null)return; setPoses(old=>({...old,[selected]:{...(old[selected]??{x:50,y:50,rotation:0,placed:false}),flipped:!(old[selected]?.flipped??false)}})); setFeedback(""); };
  const placePiece = (id:number, event:React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect=event.currentTarget.getBoundingClientRect();
    const x=Math.max(5,Math.min(95,(event.clientX-rect.left)/rect.width*100));
    const y=Math.max(7,Math.min(93,(event.clientY-rect.top)/rect.height*100));
    setPoses(old=>({...old,[id]:{x,y,rotation:old[id]?.rotation??0,flipped:old[id]?.flipped??false,placed:true}}));
    setSelected(id);setFeedback("");
  };
  const checkAnswer = () => {
    const count=tangramPieces.filter((_,i)=>poses[i]?.placed).length;
    setFeedback(count===7?"Em đã đưa đủ 7 mảnh vào vùng ghép! Hãy quan sát hình mẫu và tự điều chỉnh vị trí, hướng xoay để hình em tạo ra giống mẫu. Hiện phần kiểm tra xác nhận đủ mảnh, chưa tự động nhận diện độ khớp hình học.":`Em đã đặt ${count}/7 mảnh. Hãy kéo đủ 7 mảnh vào vùng ghép rồi kiểm tra lại nhé!`);
  };
  const selectedPose=selected===null?null:poses[selected];
  return <div className="tangram-workshop tangram-free-workshop">
    <div className="tangram-intro">
      <span className="eyebrow">GÓC SÁNG TẠO · THỬ THÁCH TANGRAM</span>
      <h3>Thỏa sức sáng tạo với 7 mảnh Tangram ✨</h3>
      <p>Quan sát hình mẫu ở phía trên, sau đó kéo 7 mảnh vào vùng ghép rộng bên dưới. Em có thể đặt các mảnh ở bất cứ vị trí nào, chọn từng mảnh để xoay hoặc lật.</p>
      <div className="tangram-actions">
        <button className="button secondary" onClick={rotate} disabled={selected===null}>↻ Xoay mảnh 45°</button>
        <button className="button secondary" onClick={flip} disabled={selected===null}>⇋ Lật mảnh</button>
        <button className="button secondary" onClick={()=>{if(selected!==null){setPoses(old=>({...old,[selected]:{...(old[selected]??{x:50,y:50,rotation:0,flipped:false}),placed:false}}));setFeedback("");}}} disabled={selected===null}>↩ Trả mảnh về khay</button>
        <button className="button secondary" onClick={reset}>Làm lại</button>
      </div>
      <p className="tangram-progress">{selected===null?"Chọn một mảnh ở khay hoặc trên vùng ghép.":`Đang chọn: ${tangramPieces[selected].name}.`}</p>
    </div>
    <section className="tangram-models" aria-label="Tải hình mẫu Tangram">
      <div className="tangram-section-heading"><b>1. TẢI HÌNH MẪU TỪ THƯ VIỆN</b><small>Chọn ảnh có sẵn trong thiết bị của em</small></div>
      <label className="tangram-upload-control">
        <span>📁 Chọn ảnh mẫu</span>
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>{
          const input=e.currentTarget;
          const file=input.files?.[0];
          if(!file)return;
          if(!file.type.startsWith("image/")){setFeedback("Vui lòng chọn một tệp hình ảnh.");return;}
          if(file.size>10*1024*1024){setFeedback("Ảnh mẫu cần có dung lượng không quá 10 MB.");return;}
          const reader=new FileReader();
          reader.onload=()=>{if(typeof reader.result==="string"){setModelImage(reader.result);setModelImageName(file.name);setFeedback("");reset();}};
          reader.readAsDataURL(file);
          input.value="";
        }}/>
      </label>
      {modelImage ? <div className="tangram-uploaded-preview"><img src={modelImage} alt="Hình mẫu do người dùng tải lên"/><div><b>{modelImageName}</b><small>Ảnh mẫu đang được sử dụng. Em quan sát ảnh rồi tự do sắp xếp 7 mảnh ghép ở vùng bên dưới.</small><button type="button" className="button secondary" onClick={()=>{setModelImage("");setModelImageName("");reset();}}>Xóa ảnh mẫu</button></div></div> : <div className="tangram-empty-model"><span>🖼️</span><b>Chưa có hình mẫu</b><small>Nhấn “Chọn ảnh mẫu” để tải ảnh từ máy tính hoặc thư viện ảnh của thiết bị.</small></div>}
      <p className="tangram-progress">Có thể chọn ảnh PNG, JPG, WEBP hoặc GIF (tối đa 10 MB). Ảnh chỉ được hiển thị trong phiên làm việc hiện tại.</p>
    </section>
    <section className="tangram-board-wrap tangram-free-board-section">
      <div className="tangram-board-heading"><b>2. VÙNG GHÉP TỰ DO</b><small>{tangramPieces.filter((_,i)=>poses[i]?.placed).length}/7 mảnh đã kéo vào</small></div>\n      <div className="tangram-actions tangram-board-tools"><button className="button secondary" onClick={rotate} disabled={selected===null}>↻ Xoay mảnh 45°</button><button className="button secondary" onClick={flip} disabled={selected===null}>⇋ Lật mảnh</button><button className="button secondary" onClick={()=>{if(selected!==null){setPoses(old=>({...old,[selected]:{...(old[selected]??{x:50,y:50,rotation:0,flipped:false}),placed:false}}));setFeedback("");}}} disabled={selected===null}>↩ Trả mảnh về khay</button><button className="button secondary" onClick={reset}>Làm lại</button></div>
      <div className="tangram-free-board" onDragOver={e=>e.preventDefault()} onDrop={e=>{const id=Number(e.dataTransfer.getData("text/tangram-piece"));if(Number.isInteger(id))placePiece(id,e);}}>
        <span className="tangram-board-watermark">KÉO – XOAY – LẬT – GHÉP THEO CÁCH CỦA EM</span>
        {tangramPieces.map((piece,i)=>{const pose=poses[i];return pose?.placed?<div key={i} draggable onDragStart={e=>{e.dataTransfer.setData("text/tangram-piece",String(i));setSelected(i);}} onClick={()=>setSelected(i)} className={`tangram-free-piece ${selected===i?"selected-piece":""} ${piece.shape}`} style={{left:`${pose.x}%`,top:`${pose.y}%`,background:piece.color,clipPath:piece.clip,transform:`translate(-50%,-50%) rotate(${pose.rotation}deg) scaleX(${pose.flipped?-1:1})`}} title={`${piece.name} – kéo để di chuyển`} aria-label={piece.name}/> : null;})}
      </div>
      <div className="tangram-bank"><b>KHAY 7 MẢNH GHÉP</b><div className="tangram-pieces">{tangramPieces.map((piece,i)=><button key={piece.name} draggable onDragStart={e=>{e.dataTransfer.setData("text/tangram-piece",String(i));setSelected(i);}} onClick={()=>setSelected(i)} className={`tangram-piece-card ${selected===i?"selected-piece":""} ${poses[i]?.placed?"in-board":""}`}><span className={`tangram-shape ${piece.shape}`} style={{background:piece.color,clipPath:piece.clip,transform:`rotate(${poses[i]?.rotation??0}deg) scaleX(${poses[i]?.flipped?-1:1})`}}/><small>{piece.name}</small><small>{poses[i]?.placed?"Đã đưa vào vùng ghép":"Kéo vào vùng ghép"}</small></button>)}</div></div>
      <div className="tangram-actions"><button className="button primary" onClick={checkAnswer}>✓ Kiểm tra</button><button className="button secondary" onClick={()=>setShowHint(v=>!v)}>{showHint?"Ẩn gợi ý":"💡 Gợi ý ghép hình"}</button></div>
      {showHint&&<p className="tangram-hint">Hãy bắt đầu bằng những mảnh lớn để tạo phần chính của hình. Sau đó xoay hoặc lật các mảnh nhỏ để lấp vào khoảng trống. Em có thể kéo một mảnh nhiều lần để thay đổi vị trí.</p>}
      {feedback&&<div className={`tangram-feedback ${feedback.startsWith("Em đã đưa đủ")?"correct":"try-again"}`} role="status">{feedback}</div>}
      <p className="tangram-progress">Lưu ý: Em được tự do sắp xếp các mảnh, không có ô đích hoặc bố cục ghép cố định. Nút kiểm tra hiện xác nhận đã sử dụng đủ 7 mảnh; việc nhận diện chính xác hình ghép theo mẫu chưa được tự động hóa.</p>
    </section>
    <p className="tip">Gợi ý cho giáo viên: Khuyến khích học sinh thử nhiều cách sắp xếp, nêu tên các hình đã sử dụng và giải thích cách xoay, lật để tạo thành hình mới.</p>
  </div>;
}
