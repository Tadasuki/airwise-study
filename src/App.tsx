import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, ChevronRight, CircleHelp,
  Clock3, ExternalLink, FileText, Flame, GraduationCap, Home, Library, ListChecks,
  Menu, Moon, NotebookTabs, Palette, RotateCcw, Search, Settings, SlidersHorizontal,
  Sparkles, Sun, Target, TrendingUp, X, Zap,
} from 'lucide-react'
import {
  Cell, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip,
} from 'recharts'
import { chapters, examBlueprint, groups, questions, type Chapter, type Question, type QuestionType } from './data/course'
import { homeworkProblems, lessons, outlineData, summaryData, textbookUrl, type HomeworkProblem } from './data/learning'

type View = 'today' | 'map' | 'library' | 'outline' | 'summary' | 'homework' | 'practice' | 'progress'
type ProgressState = {
  answered: Record<string, { correct: boolean; score: number; answer: string; at: number }>
  completedChapters: number[]
  studySeconds: number
  lastStudyDate?: string
  streak: number
}

const defaultProgress: ProgressState = { answered: {}, completedChapters: [], studySeconds: 0, streak: 1 }

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'today', label: '今日', icon: Home },
  { id: 'map', label: '知识图谱', icon: BrainCircuit },
  { id: 'library', label: '系统学习', icon: Library },
  { id: 'outline', label: '复习提纲', icon: FileText },
  { id: 'summary', label: '知识点总结', icon: NotebookTabs },
  { id: 'homework', label: '作业原题', icon: GraduationCap },
  { id: 'practice', label: '练习', icon: ListChecks },
  { id: 'progress', label: '进步', icon: TrendingUp },
]
const bottomNavItems = navItems.filter(item => ['today', 'library', 'homework', 'practice', 'progress'].includes(item.id))

type ThemeOption = { id: string; name: string; color: string; secondary: string; tertiary: string; base: string }
type Preferences = { examAt: string; themeId: string; paletteVersion: number }
const themeOptions = [
  { id:'pine', name:'松针绿', color:'#317F62', secondary:'#6D8FD5', tertiary:'#D19A42', base:'#F4F7F5' },
  { id:'sakura', name:'樱花粉', color:'#B65072', secondary:'#D98DA6', tertiary:'#8F7CC1', base:'#FFF5F8' },
  { id:'macaron', name:'马卡龙', color:'#588EA5', secondary:'#E99AAA', tertiary:'#E4B554', base:'#FFF9F3' },
  { id:'peach', name:'蜜桃奶油', color:'#C86E62', secondary:'#E5A97E', tertiary:'#8BA899', base:'#FFF7F2' },
  { id:'lavender', name:'薰衣草', color:'#7662AD', secondary:'#B47FA5', tertiary:'#719A98', base:'#F9F6FF' },
  { id:'mint', name:'薄荷苏打', color:'#2E8C82', secondary:'#75A8C5', tertiary:'#E0AA55', base:'#F2FAF8' },
  { id:'bay', name:'海湾蓝', color:'#3567C8', secondary:'#51A0B5', tertiary:'#D29A45', base:'#F3F7FF' },
  { id:'iris', name:'鸢尾紫', color:'#7656C7', secondary:'#B374A8', tertiary:'#5D91A8', base:'#F8F5FF' },
  { id:'camellia', name:'山茶红', color:'#B84B5E', secondary:'#CF7B72', tertiary:'#737FB4', base:'#FFF5F5' },
  { id:'clay', name:'陶土橙', color:'#C45F3E', secondary:'#D59658', tertiary:'#668E88', base:'#FFF7F1' },
  { id:'amber', name:'琥珀金', color:'#A87418', secondary:'#C48C55', tertiary:'#657FA9', base:'#FFFAEF' },
  { id:'lake', name:'湖水青', color:'#178795', secondary:'#5A91C4', tertiary:'#D59B55', base:'#F1FAFA' },
  { id:'indigo', name:'暮色靛青', color:'#4C59B4', secondary:'#8B6BAA', tertiary:'#C69055', base:'#F5F6FF' },
  { id:'plum', name:'梅子紫', color:'#925184', secondary:'#C07788', tertiary:'#6D9196', base:'#FCF5FA' },
  { id:'sage', name:'鼠尾草', color:'#657A4D', secondary:'#789695', tertiary:'#C2915D', base:'#F7F8F1' },
  { id:'cocoa', name:'可可摩卡', color:'#805B4E', secondary:'#A77B69', tertiary:'#6E8D91', base:'#FAF6F3' },
] satisfies ThemeOption[]
const defaultPreferences: Preferences = { examAt: '2026-10-12T18:00', themeId: 'macaron', paletteVersion: 2 }

function loadProgress(): ProgressState {
  try {
    const saved = localStorage.getItem('airwise-progress-v2')
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress
  } catch { return defaultProgress }
}

function loadPreferences(): Preferences {
  try {
    const saved = localStorage.getItem('airwise-preferences-v1')
    if (!saved) return defaultPreferences
    const parsed = JSON.parse(saved)
    const migratedTheme = themeOptions.find(theme => theme.color.toLowerCase() === String(parsed.accent ?? '').toLowerCase())
    return {
      ...defaultPreferences,
      ...parsed,
      themeId: parsed.paletteVersion === 2 ? (parsed.themeId ?? migratedTheme?.id ?? defaultPreferences.themeId) : defaultPreferences.themeId,
      paletteVersion: 2,
    }
  } catch { return defaultPreferences }
}

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[\s，。；、,.!！?？()（）\-]/g, '')
}

function keywordScore(answer: string, keywords: string[] = []) {
  const normalized = normalizeText(answer)
  const hits = keywords.filter(k => normalized.includes(normalizeText(k)))
  return { hits, missing: keywords.filter(k => !hits.includes(k)), ratio: keywords.length ? hits.length / keywords.length : 0 }
}

function SourceBadge({ type = 'teacher' }: { type?: 'teacher' | 'book' | 'web' | 'ai' }) {
  const labels = { teacher: '老师资料', book: '教材参考', web: '拓展资料', ai: 'AI 辅助' }
  return <span className={`source-badge ${type}`}>{labels[type]}</span>
}

function Ring({ value, size = 88, color = '#3AA67E', label }: { value: number; size?: number; color?: string; label?: string }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <circle className="ring-track" cx="44" cy="44" r={radius} />
        <circle className="ring-value" cx="44" cy="44" r={radius} style={{ stroke: color, strokeDasharray: circumference, strokeDashoffset: circumference * (1 - value / 100) }} />
      </svg>
      <div className="ring-label"><strong>{Math.round(value)}%</strong>{label && <span>{label}</span>}</div>
    </div>
  )
}

function App() {
  const [view, setView] = useState<View>('today')
  const [dark, setDark] = useState(() => localStorage.getItem('airwise-theme') === 'dark')
  const [progress, setProgress] = useState<ProgressState>(loadProgress)
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null)
  const [activeSectionId, setActiveSectionId] = useState<string>()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences)

  useEffect(() => {
    if (preferences.paletteVersion !== 2) setPreferences(current => ({ ...current, themeId:'macaron', paletteVersion:2 }))
  }, [preferences.paletteVersion])
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('airwise-theme', dark ? 'dark' : 'light')
  }, [dark])
  useEffect(() => localStorage.setItem('airwise-progress-v2', JSON.stringify(progress)), [progress])
  useEffect(() => {
    localStorage.setItem('airwise-preferences-v1', JSON.stringify(preferences))
    const theme = themeOptions.find(option => option.id === preferences.themeId) ?? themeOptions[0]
    document.documentElement.dataset.palette = theme.id
    document.documentElement.style.setProperty('--accent', theme.color)
    document.documentElement.style.setProperty('--accent-secondary', theme.secondary)
    document.documentElement.style.setProperty('--accent-tertiary', theme.tertiary)
    document.documentElement.style.setProperty('--theme-base', theme.base)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111318' : theme.color)
  }, [preferences, dark])

  const answered = Object.values(progress.answered)
  const accuracy = answered.length ? answered.filter(x => x.correct).length / answered.length * 100 : 0
  const mastery = Math.min(100, progress.completedChapters.length * 7 + answered.filter(x => x.correct).length * 1.5)
  const examHours = Math.max(0, Math.ceil((new Date(preferences.examAt).getTime() - Date.now()) / 3600000))

  const recordAnswer = (question: Question, correct: boolean, score: number, answer: string) => {
    setProgress(prev => ({ ...prev, answered: { ...prev.answered, [question.id]: { correct, score, answer, at: Date.now() } } }))
  }
  const openChapter = (chapter: Chapter, sectionId?: string) => {
    setActiveSectionId(sectionId)
    setActiveChapter(chapter)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'mobile-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><span /></div><div><strong>Airwise</strong><small>大气污染控制工程</small></div></div>
        <nav>
          {navItems.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => { setView(item.id); setMobileMenu(false) }}><item.icon size={19} /><span>{item.label}</span>{view === item.id && <motion.i layoutId="nav-pill" transition={{ type:'spring', bounce:0, duration:.32 }} />}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        <div className="exam-mini">
          <span>距离考试</span>
          <strong>{examHours} 小时</strong>
          <div><i style={{ width: `${Math.min(100, mastery)}%` }} /></div>
          <small>总体掌握度 {Math.round(mastery)}%</small>
        </div>
        <button className="theme-button" onClick={() => setSettingsOpen(true)}><Settings size={18} /><span>设置</span></button>
        <button className="theme-button" onClick={() => setDark(v => !v)}>{dark ? <Sun size={18} /> : <Moon size={18} />}<span>{dark ? '浅色模式' : '深色模式'}</span></button>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="打开菜单"><Menu /></button>
          <div className="breadcrumbs"><span>大气污染控制工程</span><ChevronRight size={14} /><strong>{navItems.find(n => n.id === view)?.label}</strong></div>
          <div className="top-actions"><button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="设置"><SlidersHorizontal size={18} /></button><button className="icon-button" onClick={() => setDark(v => !v)} aria-label="切换主题">{dark ? <Sun size={18} /> : <Moon size={18} />}</button></div>
        </header>
          <motion.div key={view} className="view-wrap" initial={{ opacity: .55, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', bounce: 0, duration: .28 }}>
            {view === 'today' && <TodayView progress={progress} mastery={mastery} accuracy={accuracy} examHours={examHours} onNavigate={setView} onChapter={openChapter} />}
            {view === 'map' && <MapView progress={progress} onChapter={openChapter} />}
            {view === 'library' && <LibraryView progress={progress} onChapter={openChapter} />}
            {view === 'outline' && <OutlineView onChapter={openChapter} />}
            {view === 'summary' && <SummaryView onChapter={openChapter} />}
            {view === 'homework' && <HomeworkView />}
            {view === 'practice' && <PracticeView recordAnswer={recordAnswer} saved={progress.answered} />}
            {view === 'progress' && <ProgressView progress={progress} accuracy={accuracy} mastery={mastery} setProgress={setProgress} />}
          </motion.div>
      </main>

      <nav className="bottom-nav">{bottomNavItems.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}>{view === item.id && <motion.i className="selection-slider" layoutId="bottom-nav-pill" transition={{ type:'spring', bounce:0, duration:.3 }} />}<item.icon size={20} /><span>{item.label}</span></button>)}</nav>
      {mobileMenu && <div className="scrim" onClick={() => setMobileMenu(false)} />}
      <AnimatePresence mode="wait">{activeChapter && <ImmersiveReader key={`${activeChapter.id}-${activeSectionId ?? 'start'}`} chapter={activeChapter} initialSectionId={activeSectionId} nextChapter={chapters[chapters.findIndex(c => c.id === activeChapter.id) + 1]} done={progress.completedChapters.includes(activeChapter.id)} onClose={() => { setActiveChapter(null); setActiveSectionId(undefined) }} onComplete={() => {
        setProgress(p => ({ ...p, completedChapters: p.completedChapters.includes(activeChapter.id) ? p.completedChapters : [...p.completedChapters, activeChapter.id] }))
        const nextChapter = chapters[chapters.findIndex(c => c.id === activeChapter.id) + 1]
        if (nextChapter) { setActiveSectionId(undefined); setActiveChapter(nextChapter) }
        else setActiveChapter(null)
      }} />}</AnimatePresence>
      {settingsOpen && <SettingsModal preferences={preferences} setPreferences={setPreferences} dark={dark} setDark={setDark} onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

function TodayView({ progress, mastery, accuracy, examHours, onNavigate, onChapter }: { progress: ProgressState; mastery: number; accuracy: number; examHours: number; onNavigate: (v: View) => void; onChapter: (c: Chapter, sectionId?: string) => void }) {
  const next = chapters.find(c => !progress.completedChapters.includes(c.id)) ?? chapters[0]
  return <div className="page">
    <section className="hero">
      <div><span className="eyebrow"><Sparkles size={15} /> 从零开始 · 第 1 轮</span><h1>今天，先把知识串起来</h1><p>按老师复习提纲推进。先理解，再用题目确认，最后只复习不会的部分。</p><div className="hero-actions"><button className="primary" onClick={() => onChapter(next)}>继续学习 <ArrowRight size={17} /></button><button className="secondary" onClick={() => onNavigate('practice')}>开始 10 题快测</button></div></div>
      <div className="hero-orbit"><Ring value={mastery} size={154} color="var(--accent)" label={`${examHours} 小时`} /><span className="orbit-dot one" /><span className="orbit-dot two" /></div>
    </section>

    <section className="metric-row">
      <div className="metric"><div className="metric-icon green"><Flame /></div><span>连续学习</span><strong>{progress.streak} 天</strong><small>保持节奏比突击更可靠</small></div>
      <div className="metric"><div className="metric-icon blue"><Target /></div><span>答题正确率</span><strong>{Math.round(accuracy)}%</strong><small>{Object.keys(progress.answered).length} 道题已有记录</small></div>
      <div className="metric"><div className="metric-icon amber"><BookOpen /></div><span>已学章节</span><strong>{progress.completedChapters.length} / 10</strong><small>完成章节后自动记录</small></div>
    </section>

    <div className="section-heading"><div><span className="eyebrow">今日路径</span><h2>从概念到得分</h2></div><button className="text-button" onClick={() => onNavigate('library')}>查看全部章节 <ArrowRight size={16} /></button></div>
    <section className="today-grid">
      <button className="next-lesson" onClick={() => onChapter(next)}>
        <div className="lesson-number" style={{ color: next.color }}>{next.number}</div><div className="lesson-copy"><span>{next.group} · {next.minutes} 分钟</span><h3>{next.title}</h3><p>{next.summary}</p><div className="lesson-tags">{next.keyPoints.slice(0, 3).map(x => <em key={x}>{x}</em>)}</div></div><div className="circle-arrow"><ArrowRight /></div>
      </button>
      <div className="quick-tool-card"><div className="quick-tool-head"><div><span>考前工具箱</span><h3>现在最有用的入口</h3></div><Zap /></div><div className="quick-tool-list"><button onClick={() => onNavigate('outline')}><FileText /><span><strong>提纲逐条查漏</strong><small>每个考点直达学习小节</small></span><ArrowRight /></button><button onClick={() => onNavigate('homework')}><GraduationCap /><span><strong>计算原题精讲</strong><small>展开考场式完整步骤</small></span><ArrowRight /></button><button onClick={() => onNavigate('practice')}><ListChecks /><span><strong>专项练习</strong><small>判断、简答与错题反馈</small></span><ArrowRight /></button></div></div>
    </section>

    <section className="blueprint-section"><div className="section-heading"><div><span className="eyebrow">老师给出的卷面结构</span><h2>100 分怎样组成</h2></div></div><div className="blueprint-bar">{examBlueprint.map(x => <div key={x.label} style={{ width: `${x.points}%`, background: x.color }}><strong>{x.points}</strong><span>{x.label}</span></div>)}</div><div className="blueprint-legend">{examBlueprint.map(x => <span key={x.label}><i style={{ background: x.color }} />{x.label} · {x.count} 题 / {x.points} 分</span>)}</div></section>
  </div>
}

function MapView({ progress, onChapter }: { progress: ProgressState; onChapter: (c: Chapter) => void }) {
  const [group, setGroup] = useState<(typeof groups)[number]>('全部')
  const shown = group === '全部' ? chapters : chapters.filter(c => c.group === group)
  return <div className="page map-page">
    <div className="page-title"><div><span className="eyebrow">可交互知识图谱</span><h1>一门课，四条主线</h1><p>点开节点查看“为什么、考什么、怎么记”。</p></div></div>
    <div className="segmented">{groups.map(g => <button key={g} onClick={() => setGroup(g)} className={group === g ? 'active' : ''}>{group === g && <motion.i className="selection-slider" layoutId="map-group-pill" transition={{ type:'spring', bounce:0, duration:.32 }} />}<span className="control-label">{g}</span></button>)}</div>
    <div className="map-canvas">
      <div className="map-center"><div className="brand-mark"><span /></div><strong>大气污染<br />控制工程</strong><small>点击任一节点</small></div>
      <div className="map-lines" aria-hidden="true" />
      <div className="node-grid">{shown.map((c, i) => <motion.button layout key={c.id} className="map-node" style={{ '--node-color': c.color } as React.CSSProperties} onClick={() => onChapter(c)} whileHover={{ y: -5 }} whileTap={{ scale: .97 }}><div className="node-top"><span>{c.number}</span>{progress.completedChapters.includes(c.id) && <i><Check size={12} /></i>}</div><strong>{c.title}</strong><small>{c.shortTitle}</small><em>{c.priority}</em></motion.button>)}</div>
    </div>
    <div className="map-key"><span><i className="dot material" />资料明确覆盖</span><span><i className="dot done" />已完成章节</span><span><i className="dot high" />高频考点</span></div>
  </div>
}

function LibraryView({ progress, onChapter }: { progress: ProgressState; onChapter: (c: Chapter) => void }) {
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState<(typeof groups)[number]>('全部')
  const filtered = chapters.filter(c => (group === '全部' || c.group === group) && [c.title, c.shortTitle, ...c.keyPoints].join('').includes(search))
  return <div className="page">
    <div className="page-title"><div><span className="eyebrow">10 个考试章节</span><h1>系统学习</h1><p>按章连续学习概念、公式、例题与随堂自测。</p></div><div className="search-box"><Search size={18} /><input placeholder="搜索概念、公式或章节" value={search} onChange={e => setSearch(e.target.value)} />{search && <button onClick={() => setSearch('')}><X size={16} /></button>}</div></div>
    <div className="filter-row">{groups.map(g => <button key={g} onClick={() => setGroup(g)} className={group === g ? 'active' : ''}>{group === g && <motion.i className="selection-slider" layoutId="library-group-pill" transition={{ type:'spring', bounce:0, duration:.32 }} />}<span className="control-label">{g}</span></button>)}</div>
    <div className="chapter-list">{filtered.map(c => <button key={c.id} className="chapter-row" onClick={() => onChapter(c)}><div className="chapter-index" style={{ background: `${c.color}18`, color: c.color }}>{c.number}</div><div className="chapter-main"><div><h3>{c.title}</h3><SourceBadge /><span className={`priority ${c.priority}`}>{c.priority}</span></div><p>{c.summary}</p><div className="chapter-meta"><span><Clock3 size={14} />{c.minutes} 分钟</span><span><BookOpen size={14} />{c.keyPoints.length} 个核心点</span></div></div><div className="row-status">{progress.completedChapters.includes(c.id) ? <span className="complete"><Check size={16} />已完成</span> : <span>未开始</span>}<ChevronRight /></div></button>)}</div>
    {!filtered.length && <div className="empty"><Search /><h3>没有找到相关知识点</h3><p>换一个关键词试试。</p></div>}
  </div>
}

function PracticeView({ recordAnswer, saved }: { recordAnswer: (q: Question, correct: boolean, score: number, answer: string) => void; saved: ProgressState['answered'] }) {
  const [mode, setMode] = useState<'menu' | 'quick' | 'exam' | 'wrong'>('menu')
  const [queue, setQueue] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<{ correct: boolean; score: number; hits?: string[]; missing?: string[] } | null>(null)
  const [sessionScore, setSessionScore] = useState(0)

  const start = (kind: 'quick' | 'exam' | 'wrong', type?: QuestionType) => {
    let selected: Question[]
    if (kind === 'wrong') selected = questions.filter(q => saved[q.id] && !saved[q.id].correct)
    else if (kind === 'exam') {
      const take = (t: QuestionType, n: number) => questions.filter(q => q.type === t).slice(0, n)
      selected = [...take('choice', 10), ...take('true_false', 10), ...take('short', 5), ...take('calculation', 2)]
    } else selected = questions.filter(q => !type || q.type === type).slice(0, 10)
    if (!selected.length) return
    setQueue(selected); setIndex(0); setAnswer(''); setChecked(false); setResult(null); setSessionScore(0); setMode(kind)
  }
  const question = queue[index]
  const submit = () => {
    if (!question || !answer.trim()) return
    let correct = false, score = 0, details: ReturnType<typeof keywordScore> | undefined
    if (question.type === 'short' || question.type === 'calculation') {
      details = keywordScore(answer, question.keywords)
      score = Math.round(details.ratio * question.points)
      correct = details.ratio >= .6
    } else {
      const target = String(question.answer)
      correct = answer === target
      score = correct ? question.points : 0
    }
    setChecked(true); setResult({ correct, score, hits: details?.hits, missing: details?.missing }); setSessionScore(s => s + score)
    recordAnswer(question, correct, score, answer)
  }
  const next = () => { if (index < queue.length - 1) { setIndex(i => i + 1); setAnswer(''); setChecked(false); setResult(null) } else setMode('menu') }

  if (mode !== 'menu' && question) return <div className="page quiz-page">
    <div className="quiz-top"><button className="back-button" onClick={() => setMode('menu')}><ArrowLeft />退出</button><div><span>{mode === 'exam' ? '模拟考试' : mode === 'wrong' ? '错题扫雷' : '快速练习'}</span><strong>{index + 1} / {queue.length}</strong></div><span>已得 {sessionScore} 分</span></div>
    <div className="quiz-progress"><i style={{ width: `${(index + (checked ? 1 : 0)) / queue.length * 100}%` }} /></div>
    <section className="question-card">
      <div className="question-meta"><span>{question.type === 'choice' ? '选择题' : question.type === 'true_false' ? '判断题' : question.type === 'short' ? '简答题' : '计算题'}</span><span>{question.points} 分</span><span>第 {question.chapter} 章</span><SourceBadge type={question.source} /></div>
      <h2>{question.prompt}</h2>
      {question.type === 'choice' && <div className="options">{question.options?.map((opt, i) => <button disabled={checked} key={opt} onClick={() => setAnswer(opt)} className={`${answer === opt ? 'selected' : ''} ${checked && opt === question.answer ? 'correct' : ''} ${checked && answer === opt && opt !== question.answer ? 'wrong' : ''}`}><span>{String.fromCharCode(65 + i)}</span>{opt}</button>)}</div>}
      {question.type === 'true_false' && <div className="tf-options"><button disabled={checked} className={`${answer === 'true' ? 'selected' : ''} ${checked && question.answer === true ? 'correct' : ''}`} onClick={() => setAnswer('true')}><Check />正确</button><button disabled={checked} className={`${answer === 'false' ? 'selected' : ''} ${checked && question.answer === false ? 'correct' : ''}`} onClick={() => setAnswer('false')}><X />错误</button></div>}
      {(question.type === 'short' || question.type === 'calculation') && <div className="subjective"><textarea disabled={checked} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="写下你的答案。系统会按得分点逐项反馈……" /><div className="answer-hint"><CircleHelp size={16} />不要求逐字一致，覆盖核心含义即可。</div></div>}
      <AnimatePresence>{checked && result && <motion.div className={`feedback ${result.correct ? 'good' : 'needs-work'}`} initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }}><div className="feedback-title"><span>{result.correct ? <Check /> : <CircleHelp />}</span><div><strong>{result.correct ? '答得不错' : '这里还可以补强'}</strong><p>本题获得 {result.score} / {question.points} 分</p></div></div>{result.hits && <div className="keyword-feedback"><div><span>已覆盖</span>{result.hits.length ? result.hits.map(x => <em key={x}>{x}</em>) : <small>暂未命中明确得分点</small>}</div><div><span>待补充</span>{result.missing?.map(x => <em key={x}>{x}</em>)}</div></div>}{question.type === 'calculation' && question.solutionSteps?.length ? <details className="calculation-solution"><summary><Sparkles />查看 AI 详细解题步骤<ChevronRight /></summary><ol>{question.solutionSteps.map((step, i) => <li key={step}><span>{i + 1}</span><p>{step}</p></li>)}</ol></details> : null}<div className="explanation"><strong>{question.type === 'calculation' ? '参考结论' : '参考答案'}</strong><p>{String(question.answer)}</p><small>{question.explanation}</small></div></motion.div>}</AnimatePresence>
      <div className="quiz-actions">{!checked ? <button className="primary" disabled={!answer.trim()} onClick={submit}>提交答案</button> : <button className="primary" onClick={next}>{index === queue.length - 1 ? '完成本组' : '下一题'}<ArrowRight /></button>}</div>
    </section>
  </div>

  const wrongCount = Object.values(saved).filter(x => !x.correct).length
  return <div className="page">
    <div className="page-title"><div><span className="eyebrow">即时反馈 · 得分点判定</span><h1>练习中心</h1><p>选择和判断立刻纠错，简答题显示已覆盖与遗漏的得分点。</p></div></div>
    <section className="practice-feature"><div><span className="eyebrow light"><GraduationCap size={15} /> 按老师题型组卷</span><h2>100 分模拟考试</h2><p>10 道选择、10 道判断、5 道简答、2 道计算。交卷后逐题回看。</p><button onClick={() => start('exam')} className="light-button">开始模拟 <ArrowRight /></button></div><div className="exam-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={examBlueprint} dataKey="points" nameKey="label" innerRadius={52} outerRadius={78} paddingAngle={3}>{examBlueprint.map(x => <Cell key={x.label} fill={x.color} />)}</Pie></PieChart></ResponsiveContainer><span><strong>100</strong>分</span></div></section>
    <h2 className="subheading">专项训练</h2>
    <div className="mode-grid">
      <button onClick={() => start('quick', 'true_false')}><div className="mode-icon green"><Check /></div><h3>判断题闪练</h3><p>专治概念偷换与绝对化表述</p><span>{questions.filter(q => q.type === 'true_false').length} 题 <ArrowRight /></span></button>
      <button onClick={() => start('quick', 'short')}><div className="mode-icon amber"><BookOpen /></div><h3>简答得分点</h3><p>按关键词逐项查看覆盖情况</p><span>{questions.filter(q => q.type === 'short').length} 题 <ArrowRight /></span></button>
      <button onClick={() => start('quick', 'choice')}><div className="mode-icon blue"><Zap /></div><h3>10 题快测</h3><p>快速定位尚未掌握的章节</p><span>约 6 分钟 <ArrowRight /></span></button>
      <button onClick={() => start('quick', 'calculation')}><div className="mode-icon violet"><BrainCircuit /></div><h3>计算题精讲</h3><p>提交后展开公式、代入与结果步骤</p><span>{questions.filter(q => q.type === 'calculation').length} 题 <ArrowRight /></span></button>
      <button disabled={!wrongCount} onClick={() => start('wrong')}><div className="mode-icon red"><RotateCcw /></div><h3>错题扫雷</h3><p>{wrongCount ? `还有 ${wrongCount} 道题等待复习` : '暂时没有错题，继续保持'}</p><span>{wrongCount ? '立即重练' : '尚未解锁'} <ArrowRight /></span></button>
    </div>
    <div className="source-note"><CircleHelp /><div><strong>关于答案来源</strong><p>绿色“老师资料”表示考点或题目直接来自本目录材料；黄色“AI 辅助”表示材料未给标准答案，系统只提供本科课程范围内的复习参考。</p></div></div>
  </div>
}

function OutlineView({ onChapter }: { onChapter: (c: Chapter, sectionId?: string) => void }) {
  return <div className="page document-page">
    <div className="page-title"><div><span className="eyebrow">忠于老师《复习提纲》</span><h1>复习提纲</h1><p>保留原有章节、页码和考试范围；点击章节直接进入系统学习。</p></div><div className="exam-structure-mini"><strong>100</strong><span>总分</span><small>选择 20 · 判断 20 · 简答 30 · 计算 30</small></div></div>
    <div className="outline-layout"><aside><strong>快速跳转</strong>{outlineData.map(x => <a key={x.chapter} href={`#outline-${x.chapter}`}>{x.title}</a>)}</aside><div className="outline-content">{outlineData.map((block, blockIndex) => { const chapter = chapters.find(c => c.id === block.chapter)!; return <section key={block.chapter} id={`outline-${block.chapter}`}><button className="outline-title" onClick={() => onChapter(chapter)}><span>{String(blockIndex + 1).padStart(2,'0')}</span><div><small>{chapter.group}</small><h2>{block.title}</h2></div><ArrowRight /></button><ol>{block.items.map((item, i) => { const target = lessons[block.chapter]?.find(section => section.id === item.lessonId); return <li key={`${item.lessonId}-${i}`}><span>{i + 1}</span><p>{item.label}{target && <small>对应小节：{target.title}</small>}</p><button onClick={() => onChapter(chapter, item.lessonId)}>开始学习 <ArrowRight /></button></li> })}</ol></section>})}</div></div>
  </div>
}

function SummaryView({ onChapter }: { onChapter: (c: Chapter) => void }) {
  return <div className="page document-page">
    <div className="page-title"><div><span className="eyebrow">忠于老师《知识点总结》</span><h1>知识点总结</h1><p>把串讲页中的内容按四条主线重新排版，不添加老师未列出的考试范围。</p></div><a className="textbook-link" href={textbookUrl} target="_blank" rel="noreferrer"><BookOpen />教材：第四版<ExternalLink /></a></div>
    <div className="summary-toc">{summaryData.map((group, gi) => <section key={group.group}><div className="summary-number">0{gi + 1}</div><div><span>复习主线</span><h2>{group.group}</h2><ul>{group.points.map(point => <li key={point}>{point}</li>)}</ul><div className="related-chapters">{chapters.filter(c => c.group === group.group || (group.group === '除尘技术' && c.group === '颗粒物控制') || (group.group === '气态污染物净化' && c.group === '气态污染物控制') || (group.group === '集气罩与管道设计' && c.group === '系统设计')).map(c => <button key={c.id} onClick={() => onChapter(c)}>第 {c.number} 章 {c.title}<ArrowRight /></button>)}</div></div></section>)}</div>
    <div className="faithful-note"><Check /><div><strong>整理原则</strong><p>重复条目已合并，页码和明确要求保留；没有把教材其他章节擅自加入老师考试范围。</p></div></div>
  </div>
}

function HomeworkView() {
  const [open, setOpen] = useState(homeworkProblems[0].id)
  return <div className="page homework-page">
    <div className="page-title"><div><span className="eyebrow">来自你提供的《参考试题》</span><h1>作业原题</h1><p>原题独立保留，每题均可展开查看考场式 AI 详细步骤与参考结论。</p></div><div className="homework-count"><strong>{homeworkProblems.length}</strong><span>道原题</span></div></div>
    <div className="homework-list">{homeworkProblems.map((problem, pi) => <HomeworkCard key={problem.id} problem={problem} index={pi + 1} open={open === problem.id} onToggle={() => setOpen(open === problem.id ? '' : problem.id)} />)}</div>
  </div>
}

function HomeworkCard({ problem, index, open, onToggle }: { problem: HomeworkProblem; index: number; open: boolean; onToggle: () => void }) {
  const [showSolution, setShowSolution] = useState(false)
  useEffect(() => { if (!open) setShowSolution(false) }, [open])
  return <article className={`homework-card ${open ? 'open' : ''}`}><button className="homework-head" onClick={onToggle}><span>{String(index).padStart(2,'0')}</span><div><small>第 {problem.chapter} 章 · 计算题</small><h2>{problem.title}</h2></div><ChevronRight /></button><AnimatePresence>{open && <motion.div className="homework-body" initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}><div className="original-question"><SourceBadge /><h3>题目</h3><p>{problem.prompt}</p><div>{problem.given.map(x => <span key={x}>{x}</span>)}</div><ol>{problem.tasks.map(x => <li key={x}>{x}</li>)}</ol></div><div className="ai-tutor"><div className="ai-tutor-title"><Sparkles /><div><strong>AI 解答辅导</strong><small>公式 → 代入 → 运算 → 结论</small></div></div><p className="solution-intro">先独立列式，再打开详细步骤逐项核对，更容易形成考场解题习惯。</p><button className="solution-toggle" onClick={() => setShowSolution(value => !value)}><span>{showSolution ? '收起详细步骤' : '查看 AI 详细步骤'}</span><ChevronRight className={showSolution ? 'rotated' : ''} /></button><AnimatePresence initial={false}>{showSolution && <motion.div className="solution-detail" initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}><ol>{problem.guide.map((step, i) => <li key={step}><span>{i + 1}</span><p>{step}</p></li>)}</ol><div className="homework-answer"><strong>参考结论</strong><p>{problem.answer}</p></div></motion.div>}</AnimatePresence></div></motion.div>}</AnimatePresence></article>
}

function ProgressView({ progress, accuracy, mastery, setProgress }: { progress: ProgressState; accuracy: number; mastery: number; setProgress: React.Dispatch<React.SetStateAction<ProgressState>> }) {
  const chapterStats = chapters.map(c => {
    const qs = questions.filter(q => q.chapter === c.id && progress.answered[q.id])
    const correct = qs.filter(q => progress.answered[q.id].correct).length
    return { ...c, attempted: qs.length, accuracy: qs.length ? correct / qs.length * 100 : 0 }
  })
  const weak = chapterStats.filter(x => x.attempted && x.accuracy < 70)
  return <div className="page">
    <div className="page-title"><div><span className="eyebrow">本机实时记录</span><h1>学习进步</h1><p>系统只记录掌握度、答题结果与错题，不上传个人数据。</p></div></div>
    <div className="progress-hero"><div><Ring value={mastery} size={150} color="var(--accent)" label="总体掌握" /><div><span>当前阶段</span><h2>{mastery < 30 ? '搭建知识骨架' : mastery < 70 ? '强化高频考点' : '进入模拟冲刺'}</h2><p>{mastery < 30 ? '先完成第 2、3、4、6 章的主线理解。' : mastery < 70 ? '用判断题和简答题补齐概念边界。' : '开始完整模拟，并集中清理错题。'}</p></div></div><div className="progress-stats"><div><strong>{Object.keys(progress.answered).length}</strong><span>累计答题</span></div><div><strong>{Math.round(accuracy)}%</strong><span>当前正确率</span></div><div><strong>{progress.completedChapters.length}/10</strong><span>已学章节</span></div></div></div>
    <div className="section-heading"><div><span className="eyebrow">章节雷达</span><h2>哪里已经稳，哪里需要补</h2></div></div>
    <div className="mastery-list">{chapterStats.map(c => <div key={c.id} className="mastery-row"><span className="mini-index" style={{ color: c.color }}>{c.number}</span><div><strong>{c.title}</strong><small>{c.attempted ? `已练 ${c.attempted} 题` : '尚未练习'}</small></div><div className="mastery-track"><i style={{ width: `${progress.completedChapters.includes(c.id) ? Math.max(30, c.accuracy) : c.accuracy}%`, background: c.color }} /></div><strong>{c.attempted ? `${Math.round(c.accuracy)}%` : '—'}</strong></div>)}</div>
    <div className="insight-grid"><div className="insight-card"><span className="eyebrow">下一步建议</span><h3>{weak.length ? `先补 ${weak[0].title}` : '先完成一组快速练习'}</h3><p>{weak.length ? `该章当前正确率 ${Math.round(weak[0].accuracy)}%，回到知识卡再做一次错题扫雷。` : '有答题记录后，系统会按章节指出薄弱点。'}</p></div><div className="insight-card subtle"><span className="eyebrow">数据控制</span><h3>进度保存在此设备</h3><p>清除后无法恢复。只有你明确操作时才会重置。</p><button className="danger-text" onClick={() => { if (confirm('确定清除全部学习进度吗？此操作无法撤销。')) setProgress(defaultProgress) }}>清除学习记录</button></div></div>
  </div>
}

function ImmersiveReader({ chapter, initialSectionId, nextChapter, done, onClose, onComplete }: { chapter: Chapter; initialSectionId?: string; nextChapter?: Chapter; done: boolean; onClose: () => void; onComplete: () => void }) {
  const sections = lessons[chapter.id] ?? []
  const [sectionIndex, setSectionIndex] = useState(() => Math.max(0, sections.findIndex(section => section.id === initialSectionId)))
  const section = sections[sectionIndex]
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { closeRef.current?.focus(); document.body.classList.add('reader-open'); return () => document.body.classList.remove('reader-open') }, [])
  useEffect(() => { document.querySelector('.reader-scroll')?.scrollTo({ top:0, behavior:'smooth' }) }, [sectionIndex])
  if (!section) return null
  const next = () => sectionIndex < sections.length - 1 ? setSectionIndex(i => i + 1) : onComplete()
  return <motion.div className="immersive-reader" initial={{ opacity:0, scale:.992 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.992 }} transition={{ type:'spring', bounce:0, duration:.35 }} role="dialog" aria-modal="true">
    <header className="reader-header"><button ref={closeRef} className="reader-close" onClick={onClose}><X />退出学习</button><div className="reader-title"><span>第 {chapter.number} 章</span><strong>{chapter.title}</strong></div><div className="reader-progress"><span>{sectionIndex + 1} / {sections.length}</span><div><i style={{ width:`${(sectionIndex + 1) / sections.length * 100}%`, background:chapter.color }} /></div></div></header>
    <div className="reader-layout">
      <aside className="reader-sidebar"><div className="reader-chapter" style={{ '--chapter-color': chapter.color } as React.CSSProperties}><span>{chapter.group}</span><strong>{chapter.number}</strong><p>{chapter.summary}</p></div><nav>{sections.map((s, i) => <button key={s.id} className={sectionIndex === i ? 'active' : ''} onClick={() => setSectionIndex(i)}><span>{i < sectionIndex ? <Check /> : i + 1}</span><div><small>{i < sectionIndex ? '已阅读' : `第 ${i + 1} 节`}</small><strong>{s.title}</strong></div></button>)}</nav><div className="reader-source-note"><BookOpen /><p>主线参考《大气污染控制工程（第四版）》对应章节，按老师提纲取舍。</p></div></aside>
      <main className="reader-scroll"><AnimatePresence mode="wait"><motion.article key={section.id} className="lesson-article" initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }} transition={{ type:'spring', bounce:0, duration:.28 }}><div className="lesson-kicker"><SourceBadge type={section.source === 'web' ? 'book' : section.source} /><span>{section.source === 'book' ? '教材内容整理' : section.sourceLabel}</span></div><h1>{section.title}</h1><p className="lesson-lead">{section.lead}</p><div className="analogy wide"><span><Sparkles /></span><div><strong>先抓住这一点</strong><p>{chapter.analogy}</p></div></div>{section.paragraphs.map((p, i) => <p className="lesson-paragraph" key={i}>{p}</p>)}{section.bullets && <ul className="lesson-bullets">{section.bullets.map(x => <li key={x}><Check />{x}</li>)}</ul>}{section.formula && <div className="lesson-formula"><span>公式拆解</span><strong>{section.formula.text}</strong><div>{section.formula.explain.map(x => <p key={x}>{x}</p>)}</div></div>}{section.example && <div className="lesson-example"><span>例题</span><h3>{section.example.title}</h3><ol>{section.example.steps.map(x => <li key={x}>{x}</li>)}</ol><strong>{section.example.result}</strong></div>}<div className="checkpoint"><div><CircleHelp /><span>学完即测</span></div><h3>{section.checkpoint.question}</h3><details><summary>查看答案与解释</summary><p>{section.checkpoint.answer}</p></details></div><div className="lesson-source"><span>本节依据</span><p>{section.source === 'book' ? '郝吉明、马广大、王书肖主编《大气污染控制工程（第四版）》对应章节，以及老师课件范围。' : section.sourceLabel}</p>{section.source === 'book' && <a href={textbookUrl} target="_blank" rel="noreferrer">查看高等教育出版社教材介绍 <ExternalLink /></a>}</div></motion.article></AnimatePresence></main>
    </div>
    <footer className="reader-footer"><button className="secondary" disabled={sectionIndex === 0} onClick={() => setSectionIndex(i => i - 1)}><ArrowLeft />上一节</button><span>{sectionIndex === sections.length - 1 && nextChapter ? `完成后进入第 ${nextChapter.number} 章` : `本章 ${sections.length} 节 · 约 ${chapter.minutes} 分钟`}</span><button className="primary" onClick={next}>{sectionIndex === sections.length - 1 ? (nextChapter ? (done ? '进入下一章' : '完成本章 · 下一章') : '完成全部学习') : '下一节'}{sectionIndex === sections.length - 1 && !nextChapter ? <Check /> : <ArrowRight />}</button></footer>
  </motion.div>
}

function SettingsModal({ preferences, setPreferences, dark, setDark, onClose }: { preferences: Preferences; setPreferences: React.Dispatch<React.SetStateAction<Preferences>>; dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>>; onClose: () => void }) {
  return <><motion.div className="sheet-scrim" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} /><motion.div className="settings-modal" initial={{ opacity:0, scale:.94, y:14 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.96, y:10 }} transition={{ type:'spring', bounce:.08, duration:.32 }}><header><div><span className="eyebrow">个性化</span><h2>学习设置</h2></div><button className="icon-button" onClick={onClose}><X /></button></header><section><label><span><Clock3 />考试时间</span><input type="datetime-local" value={preferences.examAt} onChange={e => setPreferences(p => ({ ...p, examAt:e.target.value }))} /></label><small>首页与侧栏会实时换算为剩余小时数。</small></section><section><div className="setting-label"><span><Palette />多彩主题</span></div><div className="accent-options">{themeOptions.map(theme => { const active = preferences.themeId === theme.id; return <button key={theme.id} aria-label={`使用${theme.name}主题`} title={theme.name} className={active ? 'active' : ''} onClick={() => setPreferences(p => ({ ...p, themeId:theme.id }))}>{active && <b className="theme-selection" aria-hidden="true" />}<i className="theme-swatch" style={{ background:theme.base }}><b style={{ background:theme.color }} /><b style={{ background:theme.secondary }} /><b style={{ background:theme.tertiary }} />{active && <Check />}</i><span>{theme.name}</span></button> })}</div><small>每套主题同时搭配主色、辅助色与背景色，页面整体会同步变化。</small></section><section><div className="setting-label"><span>{dark ? <Moon /> : <Sun />}显示模式</span></div><div className="appearance-toggle"><button className={!dark ? 'active' : ''} onClick={() => setDark(false)}>{!dark && <motion.i className="selection-slider" layoutId="appearance-pill" transition={{ type:'spring', bounce:0, duration:.3 }} />}<Sun /><span>浅色</span></button><button className={dark ? 'active' : ''} onClick={() => setDark(true)}>{dark && <motion.i className="selection-slider" layoutId="appearance-pill" transition={{ type:'spring', bounce:0, duration:.3 }} />}<Moon /><span>深色</span></button></div></section><button className="primary settings-done" onClick={onClose}>完成</button></motion.div></>
}

export default App
