export type Chapter = {
  id: number
  number: string
  title: string
  shortTitle: string
  group: '基础理论' | '颗粒物控制' | '气态污染物控制' | '系统设计'
  color: string
  priority: '高频' | '重点' | '基础'
  minutes: number
  summary: string
  analogy: string
  keyPoints: string[]
  formula?: { expression: string; note: string }
  examTip: string
  source: string
}

export type QuestionType = 'choice' | 'true_false' | 'short' | 'calculation'

export type Question = {
  id: string
  chapter: number
  type: QuestionType
  prompt: string
  options?: string[]
  answer: string | boolean
  keywords?: string[]
  solutionSteps?: string[]
  explanation: string
  points: number
  source: 'teacher' | 'ai'
}

export const chapters: Chapter[] = [
  {
    id: 1,
    number: '01',
    title: '绪论',
    shortTitle: '污染与控制',
    group: '基础理论',
    color: '#3AA67E',
    priority: '基础',
    minutes: 24,
    summary: '先建立全局坐标：污染物从哪里来、以什么形态存在、为什么需要全过程控制。',
    analogy: '把大气环境看成一间持续通风的房间。污染源不断加料，风负责搬运，化学反应会改变它，受体最终承受影响。',
    keyPoints: ['干洁空气的组成', '一次污染物与二次污染物', '颗粒污染物与气态污染物', '我国大气污染的特点与产生原因'],
    examTip: '判断题常把“一次/二次污染物”和“污染源/污染物”概念互换。',
    source: '复习提纲，第1章；第一章课件',
  },
  {
    id: 2,
    number: '02',
    title: '燃烧与大气污染',
    shortTitle: '燃烧计算',
    group: '基础理论',
    color: '#EC7A5A',
    priority: '高频',
    minutes: 55,
    summary: '以物料衡算为主线，掌握理论空气量、过剩空气和烟气量之间的关系。',
    analogy: '燃烧像配菜：理论空气量是“刚好够用”的配方，实际空气量多加的部分就是过剩空气。',
    keyPoints: ['煤的工业分析与元素分析', '完全燃烧的条件与“三 T”', '理论与实际空气量', '理论与实际烟气量', '标准状态换算'],
    formula: { expression: 'α = Vₐ / Vₐ⁰', note: 'α 为空气过剩系数；实际空气量等于 α 倍理论空气量。' },
    examTip: '计算先定基准，再逐元素列需氧量；最后统一干/湿基和标准状态。',
    source: '复习提纲，第2章；第二章例题；参考试题',
  },
  {
    id: 3,
    number: '03',
    title: '大气污染气象学',
    shortTitle: '稳定度与烟流',
    group: '基础理论',
    color: '#6B8DE3',
    priority: '高频',
    minutes: 45,
    summary: '气温层结决定空气团能不能继续上下运动，稳定度又决定污染物扩散得快还是慢。',
    analogy: '空气团像被轻推的气球：回到原位是稳定，继续远离是不稳定，停在新位置是中性。',
    keyPoints: ['气温垂直分布与逆温', '静力稳定度判据', '烟流基本形态', '地方性风场', '湍流扩散的热力与机械因素'],
    formula: { expression: 'Γ = −dT/dz', note: '环境温度递减率与干绝热递减率比较，用于判断大气稳定度。' },
    examTip: '辐射逆温是重点。夜间地面强烈冷却，近地层空气由下向上增温，抑制垂直扩散。',
    source: '复习提纲，第3章；第三章课件',
  },
  {
    id: 4,
    number: '04',
    title: '大气扩散浓度估算',
    shortTitle: '高斯模式',
    group: '基础理论',
    color: '#8B72D9',
    priority: '高频',
    minutes: 60,
    summary: '用高斯模式把源强、风速、有效烟囱高度和扩散参数连接成下风向浓度。',
    analogy: '像往流动的河里滴墨水：排得越多浓度越高，水流越快稀释越强，横向和竖向扩散决定墨迹铺多宽。',
    keyPoints: ['高斯模式四项假设', '地面轴线浓度', '地面最大浓度', '烟气抬升与有效源高', '帕斯奎尔稳定度与扩散参数', '烟囱高度设计'],
    formula: { expression: 'C(x,0,0)= Q/(πuσᵧσ𝓏) · exp[−H²/(2σ𝓏²)]', note: '地面轴线浓度。H 为有效烟囱高度，H = 几何高度 + 抬升高度。' },
    examTip: '计算顺序：有效高度 → 稳定度 → σᵧ、σ𝓏 → 代入浓度式，单位全程统一。',
    source: '复习提纲，第4章；第四章课件',
  },
  {
    id: 5,
    number: '05',
    title: '颗粒污染物控制基础',
    shortTitle: '粒径与效率',
    group: '颗粒物控制',
    color: '#D69A3A',
    priority: '重点',
    minutes: 45,
    summary: '理解粒径分布与粉尘性质，才能判断哪种捕集机理和装置有效。',
    analogy: '筛沙子不能只看平均粒径。细沙和粗沙各占多少，才决定筛网最后能截住多少。',
    keyPoints: ['斯托克斯径与空气动力学径', '中位径与分割粒径 d₅₀', '真密度与堆积密度', '比电阻、润湿性、安息角', '总效率、分级效率与多级串联效率'],
    formula: { expression: 'η = 1 − (Q₂C₂)/(Q₁C₁)', note: '有漏风时用质量流率计算效率，不能只比较进出口浓度。' },
    examTip: '“出口浓度更低”不必然等于效率高，先检查进出口流量是否相同。',
    source: '复习提纲，第5章；第五章课件；参考试题',
  },
  {
    id: 6,
    number: '06',
    title: '除尘装置',
    shortTitle: '四类除尘器',
    group: '颗粒物控制',
    color: '#4E9FA8',
    priority: '高频',
    minutes: 80,
    summary: '按“作用力 → 捕集对象 → 关键参数 → 优缺点”比较机械、电、袋式和湿式除尘。',
    analogy: '重力沉降像让石子自己落下；旋风像甩干机；电除尘像静电吸纸屑；袋式像高性能口罩。',
    keyPoints: ['重力、惯性与旋风除尘', '旋风分割粒径与压力损失', '电除尘的驱进速度与收尘面积', '反电晕与电晕闭塞', '袋式过滤风速、阻力和清灰', '湿式除尘与系统选择'],
    formula: { expression: 'η = 1 − exp(−ωA/Q)', note: '德意希公式。ω 为驱进速度，A 为收尘面积，Q 为处理气量。' },
    examTip: '比较题按“原理、效率、阻力、适用粒径、温湿度限制、二次污染”组织答案。',
    source: '复习提纲，第6章；第六章三份课件；参考试题',
  },
  {
    id: 7,
    number: '07',
    title: '气态污染物控制基础',
    shortTitle: '吸收吸附催化',
    group: '气态污染物控制',
    color: '#B96F9F',
    priority: '高频',
    minutes: 55,
    summary: '从相际传质、表面吸附和化学转化三条路径理解气态污染物净化。',
    analogy: '吸收像把气体“洗进”液体，吸附像让分子“坐到”固体表面，催化像开一条更省力的反应捷径。',
    keyPoints: ['双膜理论与传质阻力', '吸收设备与计算思路', '物理吸附和化学吸附', '穿透曲线与动/静活度', '希洛夫方程', '催化剂活性、选择性与稳定性'],
    examTip: '简答题先点明控制机理，再写设备/材料、关键操作参数和失效原因。',
    source: '复习提纲，第7章；知识点总结',
  },
  {
    id: 8,
    number: '08',
    title: '硫氧化物控制',
    shortTitle: '烟气脱硫',
    group: '气态污染物控制',
    color: '#5A9F67',
    priority: '重点',
    minutes: 40,
    summary: '围绕石灰石/石灰湿法，理解吸收、氧化、结晶和副产物处理的完整链条。',
    analogy: '湿法脱硫像给烟气洗澡：吸收液抓住 SO₂，再把它稳定成便于处理的固体。',
    keyPoints: ['石灰石/石灰湿法原理', '活性组分、吸收液和脱硫产物', '影响因素与运行问题', '喷雾干燥法', '新氨法', '干法喷钙'],
    examTip: '工艺比较至少写脱硫效率、耗水、投资运行、副产物和结垢腐蚀。',
    source: '复习提纲，第8章；知识点总结',
  },
  {
    id: 9,
    number: '09',
    title: '固定源氮氧化物控制',
    shortTitle: '低氮燃烧与脱硝',
    group: '气态污染物控制',
    color: '#CC7567',
    priority: '重点',
    minutes: 42,
    summary: '先从燃烧端减少 NOₓ 生成，再用 SCR 或 SNCR 处理已经生成的 NOₓ。',
    analogy: '像控制厨房油烟：先少产生，再处理已经跑出来的部分。',
    keyPoints: ['热力型、燃料型、快速型 NOₓ', '低氧燃烧与分级燃烧', '烟气再循环', 'SCR', 'SNCR', '电子束辐射法'],
    examTip: 'SCR 与 SNCR 的核心差异：是否使用催化剂、反应温度窗口、效率和成本。',
    source: '复习提纲，第9章；知识点总结',
  },
  {
    id: 13,
    number: '13',
    title: '净化系统设计',
    shortTitle: '集气罩与管道',
    group: '系统设计',
    color: '#61758A',
    priority: '重点',
    minutes: 50,
    summary: '从污染源捕集开始，经过管道输送和阻力平衡，形成完整的净化系统。',
    analogy: '集气罩像在污染物逃跑路径上布置吸尘器口，越贴近、越顺着运动方向，所需风量越小。',
    keyPoints: ['五类集气罩与设计注意事项', '点汇吸气速度与距离', '吸入气流与吹出气流差异', '侧吸罩计算', '管道阻力与压力分布', '截面、材料与布置原则'],
    examTip: '系统设计题先画流程，再分段编号，最后逐段算摩擦和局部阻力并找最不利环路。',
    source: '复习提纲，第13章；第十三章讲解',
  },
]

export const questions: Question[] = [
  { id: 'c1-1', chapter: 1, type: 'choice', prompt: '下列属于二次污染物的是', options: ['直接排出的烟尘', '燃烧生成的 CO', '由前体物反应形成的光化学氧化剂', '破碎过程产生的粉尘'], answer: '由前体物反应形成的光化学氧化剂', explanation: '二次污染物由一次污染物在大气中经过化学或光化学反应形成。', points: 2, source: 'ai' },
  { id: 'c1-2', chapter: 1, type: 'true_false', prompt: '一次污染物一定比二次污染物毒性更强。', answer: false, explanation: '“一次/二次”描述来源，不表示毒性强弱。', points: 2, source: 'ai' },
  { id: 'c1-3', chapter: 1, type: 'short', prompt: '简述大气污染物的两种常用分类方式。', answer: '可按存在状态分为颗粒污染物和气态污染物；按形成过程分为一次污染物和二次污染物。', keywords: ['颗粒', '气态', '一次', '二次'], explanation: '每写出一组分类及其两类对象即可形成一个得分点。', points: 6, source: 'ai' },

  { id: 'c2-1', chapter: 2, type: 'choice', prompt: '燃烧“三 T”条件通常不包括', options: ['温度 Temperature', '时间 Time', '湍流混合 Turbulence', '总压 Total pressure'], answer: '总压 Total pressure', explanation: '三 T 为足够高的温度、足够长的停留时间和充分的湍流混合。', points: 2, source: 'teacher' },
  { id: 'c2-2', chapter: 2, type: 'true_false', prompt: '空气过剩系数 α = 1 表示供给的空气量恰好等于理论空气量。', answer: true, explanation: 'α 是实际空气量与理论空气量之比。', points: 2, source: 'teacher' },
  { id: 'c2-3', chapter: 2, type: 'true_false', prompt: '空气过剩系数越大，燃烧一定越完全且热效率一定越高。', answer: false, explanation: '过量空气虽可能改善混合，却会增加排烟热损失；“一定越高”错误。', points: 2, source: 'ai' },
  { id: 'c2-4', chapter: 2, type: 'short', prompt: '燃烧计算为什么要先选取计算基准？', answer: '燃料组成通常以质量分数或体积分数给出，先规定 1 kg、100 kg 或 1 kmol 燃料，才能把各组分换成物质的量，逐项计算需氧量、空气量和烟气量，并保证量纲统一。', keywords: ['基准', '组分', '物质的量', '需氧量', '量纲'], explanation: '答出“把相对组成转为可计算的绝对量”和“保证物料衡算、单位一致”即可。', points: 6, source: 'ai' },
  { id: 'calc-2-1', chapter: 2, type: 'calculation', prompt: '老师参考题：给定干烟气 CO₂ 11%、O₂ 8%、CO 2%、SO₂ 120×10⁻⁶，颗粒物 30.0 g/m³，流量 5663.37 m³/min（700 mmHg、443 K），水汽 8%。计算过剩空气、SO₂ 浓度、标态干烟气体积和标态颗粒物浓度。', answer: '按 1 mol 干烟气计算，过剩空气约 50%；标态干烟气量约 2.96×10³ m³/min；SO₂ 工况干基约 0.192 g/m³、湿基约 0.177 g/m³；标态干基颗粒物浓度约 57.4 g/m³ₙ。', keywords: ['干湿基', '过剩空气', '理想气体', '标准状态', '质量守恒'], solutionSteps:['取 1 mol 干烟气为基准，N₂=1−0.11−0.08−0.02−0.00012=0.78988 mol。','由空气带入的 O₂=N₂/3.76≈0.2101 mol；把 CO 继续氧化所需的 0.5×0.02=0.01 mol O₂ 扣除，校正过剩 O₂=0.08−0.01=0.07 mol。','理论需氧量=0.2101−0.07=0.1401 mol，因此过剩空气率=0.07/0.1401≈50%。','标态干烟气量 Vₙ=5663.37×(1−0.08)×(700/760)×(273/443)≈2.96×10³ m³/min。','工况干烟气中 SO₂：C=120×10⁻⁶×P/(RT)×64≈0.192 g/m³；换成湿基再乘 0.92，约 0.177 g/m³。','颗粒物质量流率=5663.37×30≈1.699×10⁵ g/min；除以标态干烟气量，得到约 57.4 g/m³ₙ。'], explanation: '顺序固定为：选干烟气基准 → 求过剩空气 → 状态换算 → 质量守恒换浓度。', points: 15, source: 'teacher' },

  { id: 'c3-1', chapter: 3, type: 'choice', prompt: '近地层辐射逆温最常见于', options: ['晴朗少云、风速较小的夜间', '阴雨且大风的白天', '强对流午后', '锋面过境的大风时段'], answer: '晴朗少云、风速较小的夜间', explanation: '夜间地面辐射冷却强、弱风又不利于混合，易形成近地辐射逆温。', points: 2, source: 'teacher' },
  { id: 'c3-2', chapter: 3, type: 'true_false', prompt: '逆温层通常会抑制污染物的垂直扩散。', answer: true, explanation: '逆温层使大气层结稳定，像“盖子”一样限制向上混合。', points: 2, source: 'teacher' },
  { id: 'c3-3', chapter: 3, type: 'short', prompt: '说明大气静力稳定度的物理含义及基本判别思路。', answer: '将空气团作微小垂直位移，比较它按干绝热变化后的温度（或密度）与环境同高度空气。空气团受到回复作用为稳定，继续远离为不稳定，无继续运动趋势为中性。', keywords: ['空气团', '垂直位移', '干绝热', '环境', '回复', '稳定'], explanation: '简答结构：对象 → 扰动 → 比较 → 三种结果。', points: 6, source: 'teacher' },
  { id: 'c3-4', chapter: 3, type: 'short', prompt: '逆温为什么容易造成近地面污染累积？', answer: '逆温使上层空气温度高于下层，层结稳定，垂直湍流和对流受到抑制；污染物难以上升稀释，只能在较浅的近地层内积累。', keywords: ['层结稳定', '垂直', '湍流', '抑制', '近地', '累积'], explanation: '得分链条：逆温 → 稳定 → 混合弱 → 稀释空间小 → 浓度升高。', points: 6, source: 'ai' },

  { id: 'c4-1', chapter: 4, type: 'choice', prompt: '高架连续点源高斯模式中的有效源高 H 等于', options: ['烟囱几何高度', '烟气抬升高度', '几何高度与抬升高度之和', '几何高度减去抬升高度'], answer: '几何高度与抬升高度之和', explanation: 'H = Hₛ + ΔH。', points: 2, source: 'teacher' },
  { id: 'c4-2', chapter: 4, type: 'true_false', prompt: '在其他条件不变时，高斯模式中平均风速增大通常会使地面轴线浓度降低。', answer: true, explanation: '浓度表达式中风速位于分母；同时实际扩散参数也会受气象条件影响。', points: 2, source: 'teacher' },
  { id: 'c4-3', chapter: 4, type: 'true_false', prompt: '高斯模式假设污染物在扩散过程中发生显著化学转化。', answer: false, explanation: '基本高斯模式通常假设污染物守恒，不考虑转化。', points: 2, source: 'teacher' },
  { id: 'c4-4', chapter: 4, type: 'short', prompt: '写出高斯扩散模式的四项基本假设。', answer: '污染物在横向和竖向呈正态分布；风速均匀稳定；源强连续均匀稳定；扩散过程中污染物守恒、不考虑转化。', keywords: ['正态分布', '风速', '均匀稳定', '源强', '连续', '守恒'], explanation: '按四条列点作答，不要把“适用条件”与“基本假设”混写。', points: 6, source: 'teacher' },
  { id: 'c4-5', chapter: 4, type: 'calculation', prompt: '给定源强 Q、风速 u、有效高度 H、σᵧ 与 σ𝓏，写出地面轴线浓度的计算式并说明步骤。', answer: 'C(x,0,0)=Q/(πuσᵧσ𝓏)·exp[-H²/(2σ𝓏²)]。先统一单位，确认 H 为有效高度，再按稳定度与下风距离取得 σᵧ、σ𝓏，最后代入。', keywords: ['Q', 'u', 'σᵧ', 'σ𝓏', '有效高度', '单位'], solutionSteps:['把源强统一成质量/时间、风速统一成长度/时间，σᵧ、σ𝓏、H 使用同一长度单位。','若给出烟囱几何高度 Hs 和抬升高度 ΔH，先求有效高度 H=Hs+ΔH。','由稳定度等级和下风距离 x 查帕斯奎尔曲线，取得 σᵧ 与 σ𝓏。','计算指数项 exp[−H²/(2σ𝓏²)]，它反映烟羽中心离地越高，近地轴线浓度越低。','代入 C=Q/(πuσᵧσ𝓏)·exp[−H²/(2σ𝓏²)]，最后核对浓度单位。'], explanation: '公式、参数来源、单位检查各是独立得分点。', points: 15, source: 'teacher' },

  { id: 'c5-1', chapter: 5, type: 'choice', prompt: '分割粒径 d₅₀ 的定义是', options: ['质量累计达到 50% 的粒径', '数量累计达到 50% 的粒径', '分级除尘效率为 50% 的粒径', '除尘器能完全捕集的最小粒径'], answer: '分级除尘效率为 50% 的粒径', explanation: '中位径取决于粒径分布；分割粒径取决于除尘器性能。', points: 2, source: 'teacher' },
  { id: 'c5-2', chapter: 5, type: 'true_false', prompt: '粉尘真密度通常小于其堆积密度。', answer: false, explanation: '堆积密度包含颗粒间空隙，通常小于真密度。', points: 2, source: 'teacher' },
  { id: 'c5-3', chapter: 5, type: 'true_false', prompt: '进出口气体流量不同时，直接用 1−C₂/C₁ 计算除尘效率仍然正确。', answer: false, explanation: '有漏风或流量变化时必须按质量流率 Q·C 计算。', points: 2, source: 'teacher' },
  { id: 'c5-4', chapter: 5, type: 'short', prompt: '区分总除尘效率、分级效率和分割粒径。', answer: '总效率表示全部粒径颗粒的综合捕集比例；分级效率表示某一粒径或粒径区间的捕集比例；分割粒径是分级效率等于 50% 时的粒径。', keywords: ['全部粒径', '综合', '某一粒径', '50%', '分割粒径'], explanation: '先说明统计对象，再给出 d₅₀ 的定义。', points: 6, source: 'teacher' },
  { id: 'calc-5-1', chapter: 5, type: 'calculation', prompt: '进口 10000 m³ₙ/h、4.2 g/m³ₙ；出口 12000 m³ₙ/h、340 mg/m³ₙ。计算漏风率及考虑漏风时的除尘效率。', answer: '漏风率=(12000−10000)/10000=20%。考虑漏风：η=1−(12000×0.340)/(10000×4.2)=90.29%。', keywords: ['20%', '0.340', '质量流率', '90.29%'], solutionSteps:['统一浓度单位：340 mg/m³ₙ=0.340 g/m³ₙ。','漏风量=Q₂−Q₁=2000 m³ₙ/h，漏风率=2000/10000=20%。','进口粉尘质量流率=Q₁C₁=10000×4.2=42000 g/h。','出口粉尘质量流率=Q₂C₂=12000×0.340=4080 g/h。','η=1−4080/42000=0.9029，即 90.29%。'], explanation: '先统一单位，再比较进出口粉尘质量流率。', points: 15, source: 'teacher' },

  { id: 'c6-1', chapter: 6, type: 'choice', prompt: '下列主要依靠离心力实现气固分离的是', options: ['重力沉降室', '旋风除尘器', '袋式除尘器', '电除尘器'], answer: '旋风除尘器', explanation: '旋转气流使颗粒受离心作用向外壁运动并被捕集。', points: 2, source: 'teacher' },
  { id: 'c6-2', chapter: 6, type: 'choice', prompt: '提高德意希公式预测的电除尘效率，直接有效的措施是', options: ['减小收尘面积', '增大处理气量', '增大驱进速度或收尘面积', '降低粉尘荷电'], answer: '增大驱进速度或收尘面积', explanation: 'η=1−exp(−ωA/Q)。', points: 2, source: 'teacher' },
  { id: 'c6-3', chapter: 6, type: 'true_false', prompt: '袋式除尘器的过滤风速越高，设备阻力通常越小。', answer: false, explanation: '过滤风速升高一般会增加阻力并影响清灰与滤袋寿命。', points: 2, source: 'teacher' },
  { id: 'c6-4', chapter: 6, type: 'true_false', prompt: '重力沉降室通常适合作为高效除尘器前的预除尘装置。', answer: true, explanation: '其结构简单、阻力低，但效率低，主要捕集较大较重颗粒。', points: 2, source: 'teacher' },
  { id: 'c6-5', chapter: 6, type: 'short', prompt: '说明高比电阻粉尘导致反电晕的过程及其影响。', answer: '高比电阻粉尘层电荷不易释放，粉尘层内电场增强并发生局部击穿，形成与正常电晕极性相反的离子流，削弱颗粒荷电和有效电场，使除尘效率下降。', keywords: ['高比电阻', '电荷不易释放', '击穿', '反向离子', '电场', '效率下降'], explanation: '过程链条完整比只写定义更重要。', points: 6, source: 'teacher' },
  { id: 'c6-6', chapter: 6, type: 'short', prompt: '比较电除尘器与袋式除尘器的关键特点。', answer: '电除尘器处理气量大、阻力低、可耐较高温度，但对粉尘比电阻敏感且投资高；袋式除尘器效率高且对细颗粒有效，但阻力较大，滤料受温度、腐蚀和结露限制，需要清灰。', keywords: ['处理气量', '阻力', '比电阻', '细颗粒', '滤料', '清灰'], explanation: '建议按“效率、阻力、适用条件、敏感因素、维护”对照列点。', points: 6, source: 'ai' },
  { id: 'calc-6-1', chapter: 6, type: 'calculation', prompt: '高压电除尘器有四块集尘板，板高、板长均 3.66 m，烟气量 2 m³/s，驱进速度 0.122 m/s。按德意希公式说明计算思路。', answer: '按四块板双面收尘计算，有效面积 A=8×3.66×3.66≈107.16 m²；η=1−exp[−0.122×107.16/2]≈99.86%。', keywords: ['有效面积', '双面', '德意希', '0.122', '2 m³/s'], solutionSteps:['单个板面面积=3.66×3.66=13.3956 m²。','四块板均按双面有效收尘计，共 8 个板面，所以 A=8×13.3956=107.1648 m²。','计算德意希指数 ωA/Q=0.122×107.1648/2≈6.537。','穿透率 P=exp(−6.537)≈0.00145。','除尘效率 η=1−P≈0.99855，即约 99.86%。'], explanation: '关键是先明确有效收尘面积，再代入德意希公式计算穿透率和效率。', points: 15, source: 'teacher' },

  { id: 'c7-1', chapter: 7, type: 'choice', prompt: '双膜理论认为气液传质的主要阻力集中在', options: ['两相主体湍流区', '气膜和液膜', '塔壁', '填料内部全部体积'], answer: '气膜和液膜', explanation: '两相主体近似充分混合，浓度梯度主要集中在界面两侧的膜层。', points: 2, source: 'teacher' },
  { id: 'c7-2', chapter: 7, type: 'true_false', prompt: '吸附床的静活度通常小于实际运行条件下的动活度。', answer: false, explanation: '动态运行在穿透前停止利用，动活度通常小于静活度。', points: 2, source: 'teacher' },
  { id: 'c7-3', chapter: 7, type: 'short', prompt: '说明吸附穿透曲线的含义及其工程用途。', answer: '穿透曲线表示固定床出口吸附质浓度随时间或处理气量的变化。可据此确定穿透时间、饱和时间、有效床层长度和再生切换周期。', keywords: ['出口浓度', '时间', '穿透时间', '饱和', '床层', '再生'], explanation: '定义和用途各占一半得分。', points: 6, source: 'teacher' },

  { id: 'c8-1', chapter: 8, type: 'choice', prompt: '石灰石/石灰湿法脱硫的核心过程是', options: ['SO₂ 被碱性浆液吸收并生成亚硫酸盐/硫酸盐', 'SO₂ 在高温下裂解', 'SO₂ 直接沉降', 'SO₂ 被静电捕集'], answer: 'SO₂ 被碱性浆液吸收并生成亚硫酸盐/硫酸盐', explanation: '该法以碱性钙基浆液吸收 SO₂，并经氧化形成稳定产物。', points: 2, source: 'teacher' },
  { id: 'c8-2', chapter: 8, type: 'true_false', prompt: '石灰石湿法脱硫运行中完全不需要考虑结垢和腐蚀。', answer: false, explanation: '结垢、堵塞、腐蚀和浆液管理都是重要运行问题。', points: 2, source: 'teacher' },
  { id: 'c8-3', chapter: 8, type: 'short', prompt: '石灰石/石灰湿法脱硫效率受哪些因素影响？', answer: '主要受浆液 pH、液气比、吸收剂活性和粒度、气液接触、氧化条件、烟气温度与 SO₂ 浓度等影响。', keywords: ['pH', '液气比', '吸收剂', '气液接触', '氧化'], explanation: '按“化学条件、传质条件、物料性质、烟气条件”分类更容易得全分。', points: 6, source: 'ai' },

  { id: 'c9-1', chapter: 9, type: 'choice', prompt: 'SCR 与 SNCR 最直接的区别是', options: ['SCR 使用催化剂，SNCR 不使用', 'SNCR 使用催化剂，SCR 不使用', '两者都只能除 SO₂', '两者反应温度完全相同'], answer: 'SCR 使用催化剂，SNCR 不使用', explanation: '催化剂使 SCR 能在较低温度窗口下获得较高脱硝效率。', points: 2, source: 'teacher' },
  { id: 'c9-2', chapter: 9, type: 'true_false', prompt: '热力型 NOₓ 的生成通常随燃烧温度升高而显著增加。', answer: true, explanation: '高温促进空气中 N₂ 与 O₂ 反应，是热力型 NOₓ 的关键条件。', points: 2, source: 'teacher' },
  { id: 'c9-3', chapter: 9, type: 'short', prompt: '列出三类 NOₓ 形成机理，并说明低氮燃烧的基本思路。', answer: '三类为热力型、燃料型和快速型 NOₓ。低氮燃烧通过降低峰值温度、控制局部氧浓度、缩短高温停留时间或分级组织燃烧，抑制 NOₓ 生成。', keywords: ['热力型', '燃料型', '快速型', '峰值温度', '氧浓度', '停留时间'], explanation: '先列全三类，再把控制措施与形成条件对应。', points: 6, source: 'teacher' },

  { id: 'c13-1', chapter: 13, type: 'choice', prompt: '集气罩设计中，为减小所需排风量，最有效的一般原则是', options: ['尽量远离污染源', '靠近污染源并顺应污染物运动方向', '无限增大罩口面积', '取消围挡'], answer: '靠近污染源并顺应污染物运动方向', explanation: '距离越近、围挡越合理，控制同一污染源所需风量越小。', points: 2, source: 'teacher' },
  { id: 'c13-2', chapter: 13, type: 'true_false', prompt: '自由吹出射流和吸入口气流在相同距离上的速度衰减规律完全相同。', answer: false, explanation: '吹出气流方向性强、作用距离远；吸入气流从四周汇入，速度衰减更快。', points: 2, source: 'teacher' },
  { id: 'c13-3', chapter: 13, type: 'short', prompt: '管道系统设计的基本计算步骤是什么？', answer: '确定各罩口风量；布置并划分管段；按防止积尘所需速度确定管径；计算各段摩擦与局部阻力；进行节点压力平衡；按最不利环路选择风机并校核。', keywords: ['风量', '管段', '速度', '管径', '阻力', '压力平衡', '风机'], explanation: '建议按流程顺序编号作答。', points: 6, source: 'ai' },
  { id: 'x1-1', chapter: 1, type: 'choice', prompt: '按污染物存在状态分类，SO₂ 属于', options: ['颗粒污染物', '气态污染物', '二次颗粒物', '放射性污染物'], answer: '气态污染物', explanation: 'SO₂ 在通常大气条件下以气态存在；它还可作为形成硫酸盐的前体物。', points: 2, source: 'ai' },
  { id: 'x1-2', chapter: 1, type: 'true_false', prompt: '污染物经过末端治理后就不会产生任何二次污染问题。', answer: false, explanation: '污染物可能转移到灰、废水或废吸附剂中，仍需妥善处理。', points: 2, source: 'ai' },
  { id: 'x2-1', chapter: 2, type: 'choice', prompt: '煤的工业分析不直接包括', options: ['水分', '灰分', '挥发分', '元素碳的质量分数'], answer: '元素碳的质量分数', explanation: '元素碳质量分数属于元素分析；工业分析包括水分、灰分、挥发分和固定碳。', points: 2, source: 'ai' },
  { id: 'x2-2', chapter: 2, type: 'true_false', prompt: '燃料中含有的氧在计算理论需氧量时应当扣除。', answer: true, explanation: '燃料自身的氧可满足一部分氧化需要，因此从外部理论需氧量中扣除。', points: 2, source: 'ai' },
  { id: 'x2-3', chapter: 2, type: 'short', prompt: '说明燃烧“三 T”及其意义。', answer: '三 T 为足够高的温度、足够长的停留时间和充分的湍流混合。三者共同保证燃料与氧化剂有足够反应速率、反应时间和接触条件，从而促进完全燃烧。', keywords: ['温度', '停留时间', '湍流', '混合', '完全燃烧'], explanation: '不要只写英文首字母，要解释每一项为什么影响完全燃烧。', points: 6, source: 'ai' },
  { id: 'x3-1', chapter: 3, type: 'choice', prompt: '大气稳定度为不稳定时，受扰空气团通常', options: ['回到原高度', '继续离开原高度', '立即停止运动', '密度始终与环境相同'], answer: '继续离开原高度', explanation: '不稳定层结会放大初始扰动。', points: 2, source: 'ai' },
  { id: 'x3-2', chapter: 3, type: 'true_false', prompt: '晴朗弱风的夜间有利于形成辐射逆温。', answer: true, explanation: '晴空使地面辐射冷却强，弱风不利于上下混合。', points: 2, source: 'ai' },
  { id: 'x4-1', chapter: 4, type: 'choice', prompt: '帕斯奎尔稳定度等级中通常最不稳定的是', options: ['A', 'C', 'D', 'F'], answer: 'A', explanation: 'A 最不稳定，F 最稳定，D 常代表中性。', points: 2, source: 'ai' },
  { id: 'x4-2', chapter: 4, type: 'true_false', prompt: '提高烟囱高度可以直接减少污染物排放总量。', answer: false, explanation: '高烟囱改变扩散和落地点，不改变源强本身。', points: 2, source: 'ai' },
  { id: 'x5-1', chapter: 5, type: 'choice', prompt: '粉尘堆积密度小于真密度的主要原因是', options: ['颗粒会挥发', '堆积体积包含颗粒间空隙', '称量误差', '粒径一定变小'], answer: '堆积体积包含颗粒间空隙', explanation: '堆积密度用粉体总体积，包括颗粒本体与空隙。', points: 2, source: 'ai' },
  { id: 'x5-2', chapter: 5, type: 'true_false', prompt: '多级除尘器串联时，总效率等于各级效率直接相加。', answer: false, explanation: '应先将各级穿透率相乘，再用 1 减去总穿透率。', points: 2, source: 'ai' },
  { id: 'x6-1', chapter: 6, type: 'choice', prompt: '袋式除尘器形成稳定粉尘层后，主要过滤介质通常是', options: ['滤袋骨架', '粉尘层', '灰斗', '清灰气流'], answer: '粉尘层', explanation: '滤料提供支撑，稳定粉尘层对细颗粒捕集起重要作用。', points: 2, source: 'ai' },
  { id: 'x6-2', chapter: 6, type: 'choice', prompt: '旋风除尘器筒体直径适当减小时，通常', options: ['离心作用减弱', '分割粒径增大', '离心作用增强', '阻力必然为零'], answer: '离心作用增强', explanation: '相近切向速度下曲率半径减小，离心加速度增大，但过小会带来阻力、磨损与逃逸问题。', points: 2, source: 'ai' },
  { id: 'x6-3', chapter: 6, type: 'true_false', prompt: '电晕闭塞常与入口粉尘浓度过高有关。', answer: true, explanation: '大量粉尘消耗空间电荷，使电晕电流受到抑制。', points: 2, source: 'ai' },
  { id: 'x7-1', chapter: 7, type: 'choice', prompt: '固定床吸附器达到穿透点时，意味着', options: ['全部吸附剂完全饱和', '出口浓度达到规定限值', '入口浓度降为零', '床层温度必为零'], answer: '出口浓度达到规定限值', explanation: '穿透点按出口浓度或其与入口浓度的比值定义，此时床层后部往往尚未完全饱和。', points: 2, source: 'ai' },
  { id: 'x7-2', chapter: 7, type: 'true_false', prompt: '催化剂会改变化学反应的平衡常数。', answer: false, explanation: '催化剂改变达到平衡的速率，不改变给定温度下的平衡常数。', points: 2, source: 'ai' },
  { id: 'x8-1', chapter: 8, type: 'choice', prompt: '石灰石-石膏湿法脱硫的主要固体副产物是', options: ['碳酸钠', '硫酸钙晶体', '单质硫', '硝酸铵'], answer: '硫酸钙晶体', explanation: '亚硫酸盐经氧化后形成石膏类硫酸钙产物。', points: 2, source: 'ai' },
  { id: 'x8-2', chapter: 8, type: 'true_false', prompt: '湿法脱硫中提高液气比通常有利于吸收，但也会增加循环泵能耗。', answer: true, explanation: '更多浆液可增强接触和供碱能力，同时增加液体循环量与能耗。', points: 2, source: 'ai' },
  { id: 'x9-1', chapter: 9, type: 'choice', prompt: '空气分级燃烧降低 NOₓ 的主要思路是', options: ['主燃烧区保持强氧化气氛', '主燃烧区低氧，后续补风燃尽', '无限提高火焰温度', '完全取消二次风'], answer: '主燃烧区低氧，后续补风燃尽', explanation: '分级供风抑制主燃烧区 NOₓ 形成，再在后段完成燃尽。', points: 2, source: 'ai' },
  { id: 'x13-1', chapter: 13, type: 'true_false', prompt: '同一排风量下，管径越小，管内流速越高且阻力通常越大。', answer: true, explanation: '流速与截面积成反比，而多数阻力项与动压即流速平方相关。', points: 2, source: 'ai' },
  { id: 'x13-2', chapter: 13, type: 'short', prompt: '为什么外部吸气罩应尽量靠近污染源？', answer: '吸入口气流从四周汇入，速度随距离迅速衰减。罩口靠近污染源可以用较小风量达到所需控制速度，减少横向气流干扰和能耗。', keywords: ['四周汇入', '速度衰减', '控制速度', '风量', '干扰', '能耗'], explanation: '得分顺序：流场特点 → 距离影响 → 工程结果。', points: 6, source: 'ai' },
  { id: 'qx1-1', chapter: 1, type: 'choice', prompt: '下列属于二次污染物的是', options: ['烟囱直接排出的 SO₂', '燃烧直接产生的烟尘', '由 SO₂ 氧化形成的硫酸盐', '储罐直接逸出的苯'], answer: '由 SO₂ 氧化形成的硫酸盐', explanation: '二次污染物是在大气中由一次污染物转化形成的。', points: 2, source: 'ai' },
  { id: 'qx1-2', chapter: 1, type: 'true_false', prompt: '静稳天气本身会凭空产生污染物。', answer: false, explanation: '静稳天气只是不利于扩散，污染物仍来自排放源及大气转化。', points: 2, source: 'ai' },
  { id: 'qx1-3', chapter: 1, type: 'short', prompt: '简述我国区域复合型大气污染的形成链条。', answer: '工业、燃煤、机动车和面源排放一次颗粒物及 SO₂、NOₓ、VOCs 等前体物；前体物在大气中发生二次转化；城市群输送使污染跨区域叠加；静稳、逆温和低混合层进一步限制扩散。', keywords: ['排放源', '前体物', '二次转化', '区域输送', '静稳', '逆温'], explanation: '用“排放—转化—输送—累积”四步作答。', points: 6, source: 'ai' },
  { id: 'qx1-4', chapter: 1, type: 'choice', prompt: '控制工程中通常更优先考虑的顺序是', options: ['末端治理—源头减量—收集', '源头减量—过程与收集—末端净化', '只提高烟囱高度', '只选择效率最高设备'], answer: '源头减量—过程与收集—末端净化', explanation: '先减少生成和逸散，再对剩余污染物净化，通常更系统、经济。', points: 2, source: 'ai' },

  { id: 'qx2-1', chapter: 2, type: 'choice', prompt: '煤的干燥无灰基组成不包括', options: ['水分和灰分', '碳和氢', '氮和硫', '挥发分中的可燃组分'], answer: '水分和灰分', explanation: 'daf 基同时扣除了水分与灰分。', points: 2, source: 'ai' },
  { id: 'qx2-2', chapter: 2, type: 'true_false', prompt: '实际空气量大于理论空气量时，实际烟气中通常含有剩余氧。', answer: true, explanation: '完全燃烧且 α>1 时，过剩空气中的 O₂ 未被消耗并进入烟气。', points: 2, source: 'ai' },
  { id: 'qx2-3', chapter: 2, type: 'short', prompt: '写出元素分析燃烧计算的完整步骤。', answer: '选定燃料基准；把各元素质量换算为 kmol；按反应式计算理论需氧量并扣除燃料自带氧；求理论与实际空气量；汇总 CO₂、SO₂、H₂O、N₂ 和剩余 O₂；区分干湿基并归一化；必要时换算温压和污染物浓度。', keywords: ['基准', 'kmol', '理论需氧量', '实际空气量', '烟气组成', '干湿基', '温压'], explanation: '按计算顺序列点可避免遗漏。', points: 6, source: 'ai' },
  { id: 'qx2-4', chapter: 2, type: 'calculation', prompt: '1000 kg/h 燃煤含硫 1.2%，其中 80% 转化为 SO₂，脱硫效率 90%。求 SO₂ 排放量。', answer: '硫量=1000×1.2%=12 kg/h；生成 SO₂=12×2×80%=19.2 kg/h；排放=19.2×(1−90%)=1.92 kg/h。', keywords: ['12 kg/h', '2', '80%', '90%', '1.92 kg/h'], solutionSteps:['燃料中的硫质量流率=1000×0.012=12 kg/h。','S→SO₂ 的质量比为 64/32=2。','进入 SO₂ 的硫占 80%，所以 SO₂ 生成量=12×2×0.80=19.2 kg/h。','脱硫效率 90% 对应穿透率 10%。','最终排放量=19.2×0.10=1.92 kg/h。'], explanation: '先由 S 到 SO₂，再乘转化率，最后乘穿透率。', points: 15, source: 'ai' },

  { id: 'qx3-1', chapter: 3, type: 'choice', prompt: '大气尺度上使烟羽横向和竖向展开的主要机制是', options: ['分子扩散', '湍流扩散', '重力加速度', '太阳直射'], answer: '湍流扩散', explanation: '大气中机械和热力湍流远强于分子扩散。', points: 2, source: 'ai' },
  { id: 'qx3-2', chapter: 3, type: 'true_false', prompt: '稳定层结会抑制垂直湍流，但不代表任何地点的地面浓度都必然更高。', answer: true, explanation: '浓度还受源高、风速、距离和烟羽落地点影响。', points: 2, source: 'ai' },
  { id: 'qx3-3', chapter: 3, type: 'short', prompt: '比较海风与陆风的形成和方向。', answer: '白天地面升温快，陆地上空气上升，近地面气流由海洋吹向陆地形成海风；夜间陆地降温快，近地面气流由陆地吹向海洋形成陆风。', keywords: ['白天', '陆地升温', '海向陆', '夜间', '陆地降温', '陆向海'], explanation: '先写热力差异，再写近地面方向。', points: 6, source: 'ai' },
  { id: 'qx3-4', chapter: 3, type: 'choice', prompt: '上方稳定、下方不稳定且烟羽被迅速混合到地面的烟流通常称为', options: ['扇型', '锥型', '熏烟型', '屋脊型'], answer: '熏烟型', explanation: '下部强混合、上部受限易造成较高短时地面浓度。', points: 2, source: 'ai' },

  { id: 'qx4-1', chapter: 4, type: 'choice', prompt: '帕斯奎尔分类中的 D 类通常表示', options: ['极不稳定', '中性', '很稳定', '逆温强度'], answer: '中性', explanation: 'A 最不稳定，D 常为中性，F 最稳定。', points: 2, source: 'ai' },
  { id: 'qx4-2', chapter: 4, type: 'true_false', prompt: '高斯模式中的 σᵧ、σ𝓏 只由下风距离决定。', answer: false, explanation: '还与稳定度、下垫面和所用参数体系有关。', points: 2, source: 'ai' },
  { id: 'qx4-3', chapter: 4, type: 'short', prompt: '说明计算高架点源最大落地浓度的一般步骤。', answer: '确定源强与设计气象条件；求烟气抬升并得到有效源高；由最大浓度条件确定相应 σz；按稳定度曲线反查下风距离；取得同距离 σy；代入地面轴线浓度式并与背景和限值比较。', keywords: ['设计气象', '抬升', '有效源高', 'σz', '距离', 'σy', '轴线浓度'], explanation: '按参数取得的先后顺序作答。', points: 6, source: 'ai' },
  { id: 'qx4-4', chapter: 4, type: 'true_false', prompt: '烟囱设计高度只需由扩散公式算出，不必校核建筑下洗和规范要求。', answer: false, explanation: '还需校核背景叠加、建筑下洗、地形、结构和法规等条件。', points: 2, source: 'ai' },

  { id: 'qx5-1', chapter: 5, type: 'choice', prompt: '下列最直接影响灰斗倾角设计的粉尘性质是', options: ['安息角', '比电阻', '折射率', '颜色'], answer: '安息角', explanation: '灰斗壁角应使粉尘能够依靠重力顺利滑落。', points: 2, source: 'ai' },
  { id: 'qx5-2', chapter: 5, type: 'true_false', prompt: '在斯托克斯区，颗粒沉降速度与粒径的一次方成正比。', answer: false, explanation: '斯托克斯区终末沉降速度与粒径平方成正比。', points: 2, source: 'ai' },
  { id: 'qx5-3', chapter: 5, type: 'short', prompt: '为什么评价除尘器必须同时给出效率、处理气量和阻力？', answer: '效率说明污染物去除程度，处理气量说明设备负荷与规模，阻力决定风机压头和运行能耗；三者相互制约，脱离额定流量只比较效率没有完整工程意义。', keywords: ['效率', '处理气量', '负荷', '阻力', '风机', '能耗', '相互制约'], explanation: '三项指标逐一解释，再写相互制约。', points: 6, source: 'ai' },
  { id: 'qx5-4', chapter: 5, type: 'calculation', prompt: '两级除尘器效率分别为 80% 和 90%，求串联总效率。', answer: '总穿透率=(1−0.80)(1−0.90)=0.02，因此总效率=1−0.02=98%。', keywords: ['穿透率', '0.20', '0.10', '0.02', '98%'], solutionSteps:['第一级穿透率 P₁=1−0.80=0.20。','第二级穿透率 P₂=1−0.90=0.10。','串联系统总穿透率 P=P₁P₂=0.20×0.10=0.02。','总效率 η=1−P=0.98，即 98%。'], explanation: '串联效率不能直接相加，应先乘各级穿透率。', points: 15, source: 'ai' },

  { id: 'qx6-1', chapter: 6, type: 'choice', prompt: '脉冲喷吹袋式除尘器清灰时主要利用', options: ['低速自然沉降', '瞬时反向高速气流使滤袋变形抖落粉尘', '静电吸引', '液滴洗涤'], answer: '瞬时反向高速气流使滤袋变形抖落粉尘', explanation: '压缩空气脉冲产生反吹和袋壁加速度，实现强力清灰。', points: 2, source: 'ai' },
  { id: 'qx6-2', chapter: 6, type: 'true_false', prompt: '文丘里洗涤器通常阻力较大，但对细颗粒具有较好的捕集能力。', answer: true, explanation: '喉部高速气流强化雾化与惯性碰撞，同时带来较高压降。', points: 2, source: 'ai' },
  { id: 'qx6-3', chapter: 6, type: 'short', prompt: '列出选择除尘器时至少六项需要调查的条件。', answer: '入口粒径分布和浓度、处理烟气量、温度和湿度、粉尘密度与黏附性、比电阻、腐蚀性、可燃爆性、排放限值、允许阻力、用水及废物处置条件。', keywords: ['粒径', '浓度', '烟气量', '温度', '湿度', '粉尘性质', '排放限值', '阻力'], explanation: '可按“气体条件—粉尘条件—目标条件—现场条件”分类。', points: 6, source: 'ai' },
  { id: 'qx6-4', chapter: 6, type: 'calculation', prompt: '处理风量 60000 m³/h，设计过滤风速 1.0 m/min，单袋直径 0.16 m、有效长度 6 m。忽略备用面积，求过滤面积和最少袋数。', answer: 'Q=1000 m³/min；A=Q/vf=1000 m²；单袋面积=π×0.16×6≈3.016 m²；N≥1000/3.016≈331.6，向上取 332 条。', keywords: ['1000 m³/min', '1000 m²', '3.016 m²', '向上取整', '332'], solutionSteps:['换算风量：60000 m³/h÷60=1000 m³/min。','总过滤面积 A=Q/vf=1000/1.0=1000 m²。','单条圆袋有效面积 A袋=πDL=π×0.16×6≈3.016 m²。','理论袋数 N=1000/3.016≈331.6。','袋数必须向上取整，因此至少 332 条；工程设计还应另计分室清灰备用面积。'], explanation: '先把小时流量换成分钟流量，袋数必须向上取整。', points: 15, source: 'ai' },

  { id: 'qx7-1', chapter: 7, type: 'choice', prompt: '固定床吸附器的动活度通常小于静活度，主要因为', options: ['吸附剂质量消失', '达到穿透点时床层尚未全部饱和', '出口浓度永远为零', '气体不流动'], answer: '达到穿透点时床层尚未全部饱和', explanation: '实际运行必须在出口超限前切换，传质区后的床层容量未完全利用。', points: 2, source: 'ai' },
  { id: 'qx7-2', chapter: 7, type: 'true_false', prompt: '吸收操作线与平衡线越接近，传质推动力通常越小。', answer: true, explanation: '两线间距代表浓度推动力，过于接近会使所需塔高增加。', points: 2, source: 'ai' },
  { id: 'qx7-3', chapter: 7, type: 'short', prompt: '简述吸附剂再生的主要方法及各自基本原理。', answer: '升温再生通过提高温度降低吸附容量；降压或真空再生通过降低吸附质分压促使解吸；惰性气体吹扫降低气相浓度；置换解吸用另一物质竞争吸附位。', keywords: ['升温', '降压', '真空', '吹扫', '分压', '置换'], explanation: '方法名后紧跟推动解吸的原因。', points: 6, source: 'ai' },
  { id: 'qx7-4', chapter: 7, type: 'true_false', prompt: '希洛夫方程中，在其他条件相同时增加吸附层高度通常会缩短保护时间。', answer: false, explanation: '床层高度增加通常增加可用动态容量并延长穿透时间。', points: 2, source: 'ai' },

  { id: 'qx8-1', chapter: 8, type: 'choice', prompt: '喷雾干燥脱硫最终由除尘器捕集的主要形态是', options: ['大量稀废水', '干态反应产物颗粒', '纯 SO₂ 气体', '熔融金属'], answer: '干态反应产物颗粒', explanation: '浆液雾滴吸收反应后借烟气显热蒸干，形成粉体。', points: 2, source: 'ai' },
  { id: 'qx8-2', chapter: 8, type: 'true_false', prompt: '炉内喷钙温度越高，吸收剂利用率一定越高。', answer: false, explanation: '温度过高会导致 CaO 烧结、孔隙减少，存在适宜温度窗口。', points: 2, source: 'ai' },
  { id: 'qx8-3', chapter: 8, type: 'short', prompt: '比较石灰石湿法、喷雾干燥法与炉内喷钙法。', answer: '湿法效率高、技术成熟，但系统复杂并有腐蚀、结垢和废水；喷雾干燥用浆液反应、产出干粉，水耗较低但需后端除尘；炉内喷钙系统简单、无需大量用水，但吸收剂利用率较低且增加飞灰量。', keywords: ['湿法', '效率高', '废水', '喷雾干燥', '干粉', '炉内喷钙', '利用率'], explanation: '按效率、用水、产物形态、复杂度四列对比。', points: 6, source: 'ai' },
  { id: 'qx8-4', chapter: 8, type: 'choice', prompt: '氨法脱硫运行中需要重点控制的是', options: ['氨逃逸', '颗粒真密度为零', '空气完全无氮', '取消氧化'], answer: '氨逃逸', explanation: '氨逃逸既造成吸收剂损失，也可能形成细颗粒铵盐。', points: 2, source: 'ai' },

  { id: 'qx9-1', chapter: 9, type: 'choice', prompt: '烟气再循环降低热力型 NOₓ 的主要作用是', options: ['提高峰值温度', '稀释氧并降低峰值温度', '增加燃料氮', '去除全部水汽'], answer: '稀释氧并降低峰值温度', explanation: '回流烟气具有热容并稀释反应物，从而抑制高温 NO 生成。', points: 2, source: 'ai' },
  { id: 'qx9-2', chapter: 9, type: 'true_false', prompt: 'SCR 催化剂能使反应在比 SNCR 更低的温度范围内高效进行。', answer: true, explanation: '催化剂降低反应活化能，这是 SCR 的核心优势之一。', points: 2, source: 'ai' },
  { id: 'qx9-3', chapter: 9, type: 'short', prompt: '比较 SCR 与 SNCR 的温度、效率、设备和主要运行问题。', answer: 'SCR 使用催化剂，温度较低、效率较高，但投资高并有堵塞、磨损和中毒问题；SNCR 不用催化剂，需在炉膛较高且较窄温度窗口喷氨或尿素，系统简单但效率较低；两者都要控制混合和氨逃逸。', keywords: ['催化剂', '温度窗口', '效率', '投资', '中毒', '氨逃逸'], explanation: '采用对照式答案，最后补共同问题。', points: 6, source: 'ai' },
  { id: 'qx9-4', chapter: 9, type: 'true_false', prompt: '电子束法可把 SO₂ 和 NOₓ 转化为需要后端捕集的铵盐颗粒。', answer: true, explanation: '辐射产生自由基氧化污染物，加入氨后形成硫酸铵、硝酸铵等颗粒。', points: 2, source: 'ai' },

  { id: 'qx13-1', chapter: 13, type: 'choice', prompt: '对连续散发且可完全围闭的污染源，通常优先选用', options: ['密闭罩', '远距离外部罩', '高烟囱', '无动力伞形罩'], answer: '密闭罩', explanation: '密闭罩控制效果可靠，所需排风量通常较小。', points: 2, source: 'ai' },
  { id: 'qx13-2', chapter: 13, type: 'true_false', prompt: '在相同截面积下，圆形管道通常比矩形管道周长小、耗材少。', answer: true, explanation: '圆形截面水力性能和受力条件也通常更有利。', points: 2, source: 'ai' },
  { id: 'qx13-3', chapter: 13, type: 'short', prompt: '写出五类集气罩，并各举出一个适用特点。', answer: '密闭罩用于可围闭源；柜式罩保留操作开口；外部吸气罩用于不能围闭但可近距离捕集的源；接受式罩承接热气流或抛射流；吹吸式罩适合槽面等大范围源。', keywords: ['密闭罩', '柜式罩', '外部吸气罩', '接受式罩', '吹吸式罩'], explanation: '五类名称写全后再补适用条件。', points: 6, source: 'ai' },
  { id: 'qx13-4', chapter: 13, type: 'calculation', prompt: '某管段风量 7200 m³/h，圆管内设计流速 10 m/s，求所需管径。', answer: 'Q=7200/3600=2 m³/s；A=Q/v=0.2 m²；D=√(4A/π)=√(0.8/π)≈0.505 m，工程上再按标准管径并校核实际流速。', keywords: ['2 m³/s', '0.2 m²', '4A/π', '0.505 m', '标准管径', '校核'], solutionSteps:['风量换算：Q=7200/3600=2 m³/s。','由 Q=vA 得截面积 A=Q/v=2/10=0.2 m²。','圆管面积 A=πD²/4，因此 D=√(4A/π)。','代入得 D=√(0.8/π)≈0.505 m。','选择邻近标准管径后，用 v=4Q/(πD²)重新校核实际流速。'], explanation: '先统一为 m³/s，再由面积求直径。', points: 15, source: 'ai' },
]

export const groups = ['全部', '基础理论', '颗粒物控制', '气态污染物控制', '系统设计'] as const

export const examBlueprint = [
  { label: '选择题', count: 10, points: 20, color: '#6B8DE3' },
  { label: '判断题', count: 10, points: 20, color: '#3AA67E' },
  { label: '简答题', count: 5, points: 30, color: '#D69A3A' },
  { label: '计算题', count: 2, points: 30, color: '#EC7A5A' },
]
