/**
 * 题目数据库
 * 基于多元智能理论设计的40道测试题
 * 每个维度4道题，题目顺序已打乱
 */

// 10个天赋维度定义
const DIMENSIONS = {
  A: { name: '语言', fullName: '语言天赋', code: 'A' },
  B: { name: '逻辑-数学', fullName: '逻辑-数学天赋', code: 'B' },
  C: { name: '空间', fullName: '空间天赋', code: 'C' },
  D: { name: '内省', fullName: '内省天赋', code: 'D' },
  E: { name: '人际', fullName: '人际天赋', code: 'E' },
  F: { name: '身体-动觉', fullName: '身体-动觉天赋', code: 'F' },
  G: { name: '音乐', fullName: '音乐天赋', code: 'G' },
  H: { name: '自然', fullName: '自然天赋', code: 'H' },
  I: { name: '创造', fullName: '创造天赋', code: 'I' },
  J: { name: '美学', fullName: '美学天赋', code: 'J' }
};

// 5个选项定义（分数：0, 1, 1.5, 2, 2.5）
const OPTIONS = [
  { text: '非常符合', score: 2.5 },
  { text: '很符合', score: 2.0 },
  { text: '部分符合', score: 1.5 },
  { text: '不太符合', score: 1.0 },
  { text: '完全不符合', score: 0 }
];

// 40道测试题（已打乱顺序，避免用户发现规律）
const QUESTIONS = [
  // 第1题 - 美学
  {
    id: 1,
    text: '在做事情时，我更喜欢加入艺术性的表达，让它更独特和富有美感',
    dimension: 'J'
  },
  // 第2题 - 语言
  {
    id: 2,
    text: '向别人讲解或传授知识时，我感觉自己完成得很轻松',
    dimension: 'A'
  },
  // 第3题 - 身体-动觉
  {
    id: 3,
    text: '对于需要手眼配合的任务（如打球、穿针线），我通常完成得很好',
    dimension: 'F'
  },
  // 第4题 - 创造
  {
    id: 4,
    text: '我经常能想出新颖独特的点子',
    dimension: 'I'
  },
  // 第5题 - 音乐
  {
    id: 5,
    text: '听音乐时，我能轻松地跟上节拍',
    dimension: 'G'
  },
  // 第6题 - 逻辑-数学
  {
    id: 6,
    text: '面对复杂问题时，我善于分析原因并找出解决方案',
    dimension: 'B'
  },
  // 第7题 - 人际
  {
    id: 7,
    text: '我能敏锐地察觉他人的情绪变化',
    dimension: 'E'
  },
  // 第8题 - 空间
  {
    id: 8,
    text: '我在陌生环境中很少迷路，方向感很好',
    dimension: 'C'
  },
  // 第9题 - 自然
  {
    id: 9,
    text: '我对自然环境的变化（如天气、季节）很敏感',
    dimension: 'H'
  },
  // 第10题 - 内省
  {
    id: 10,
    text: '我经常反思自己的行为和想法',
    dimension: 'D'
  },
  // 第11题 - 语言
  {
    id: 11,
    text: '我喜欢阅读各种书籍、文章，能从中获得乐趣',
    dimension: 'A'
  },
  // 第12题 - 美学
  {
    id: 12,
    text: '我对色彩搭配和视觉设计很敏感',
    dimension: 'J'
  },
  // 第13题 - 身体-动觉
  {
    id: 13,
    text: '我能流畅而准确地完成一套连贯的动作（如舞蹈动作、体操）',
    dimension: 'F'
  },
  // 第14题 - 创造
  {
    id: 14,
    text: '面对问题时，我倾向于寻找创新的解决方法',
    dimension: 'I'
  },
  // 第15题 - 逻辑-数学
  {
    id: 15,
    text: '我喜欢解决数学难题或逻辑谜题',
    dimension: 'B'
  },
  // 第16题 - 音乐
  {
    id: 16,
    text: '我能轻松分辨不同乐器的声音',
    dimension: 'G'
  },
  // 第17题 - 人际
  {
    id: 17,
    text: '在团队合作中，我善于协调不同意见',
    dimension: 'E'
  },
  // 第18题 - 空间
  {
    id: 18,
    text: '我能在脑海中清晰地想象三维物体的样子',
    dimension: 'C'
  },
  // 第19题 - 内省
  {
    id: 19,
    text: '我清楚地了解自己的优势和不足',
    dimension: 'D'
  },
  // 第20题 - 自然
  {
    id: 20,
    text: '我喜欢观察和了解动植物的习性',
    dimension: 'H'
  },
  // 第21题 - 语言
  {
    id: 21,
    text: '我善于用文字表达自己的想法和感受',
    dimension: 'A'
  },
  // 第22题 - 美学
  {
    id: 22,
    text: '我能轻松辨别艺术作品的优劣',
    dimension: 'J'
  },
  // 第23题 - 创造
  {
    id: 23,
    text: '我喜欢尝试新事物，不喜欢墨守成规',
    dimension: 'I'
  },
  // 第24题 - 身体-动觉
  {
    id: 24,
    text: '我喜欢通过身体活动来放松和表达自己',
    dimension: 'F'
  },
  // 第25题 - 逻辑-数学
  {
    id: 25,
    text: '我能轻松理解图表、数据和统计信息',
    dimension: 'B'
  },
  // 第26题 - 音乐
  {
    id: 26,
    text: '我喜欢哼唱或演奏音乐',
    dimension: 'G'
  },
  // 第27题 - 人际
  {
    id: 27,
    text: '我容易与陌生人建立良好关系',
    dimension: 'E'
  },
  // 第28题 - 空间
  {
    id: 28,
    text: '我擅长绘画、设计或空间布局',
    dimension: 'C'
  },
  // 第29题 - 内省
  {
    id: 29,
    text: '面对情绪波动时，我能较好地管理自己的情绪',
    dimension: 'D'
  },
  // 第30题 - 自然
  {
    id: 30,
    text: '在户外活动中，我感到特别放松和愉快',
    dimension: 'H'
  },
  // 第31题 - 语言
  {
    id: 31,
    text: '在讨论或辩论中，我能清晰地表达自己的观点',
    dimension: 'A'
  },
  // 第32题 - 美学
  {
    id: 32,
    text: '我喜欢参观博物馆、画展等艺术场所',
    dimension: 'J'
  },
  // 第33题 - 创造
  {
    id: 33,
    text: '我的想象力很丰富，常有天马行空的想法',
    dimension: 'I'
  },
  // 第34题 - 身体-动觉
  {
    id: 34,
    text: '学习新的运动技能对我来说比较容易',
    dimension: 'F'
  },
  // 第35题 - 逻辑-数学
  {
    id: 35,
    text: '我习惯用逻辑思维分析事物的因果关系',
    dimension: 'B'
  },
  // 第36题 - 音乐
  {
    id: 36,
    text: '某些旋律会在我脑海中长时间回响',
    dimension: 'G'
  },
  // 第37题 - 人际
  {
    id: 37,
    text: '朋友们经常向我寻求建议或倾诉心事',
    dimension: 'E'
  },
  // 第38题 - 空间
  {
    id: 38,
    text: '看地图或平面图时，我能快速理解空间关系',
    dimension: 'C'
  },
  // 第39题 - 内省
  {
    id: 39,
    text: '我喜欢独处，并从中获得能量和灵感',
    dimension: 'D'
  },
  // 第40题 - 自然
  {
    id: 40,
    text: '我能轻松识别不同种类的植物或动物',
    dimension: 'H'
  }
];

// 导出数据（用于浏览器环境）
if (typeof window !== 'undefined') {
  window.DIMENSIONS = DIMENSIONS;
  window.OPTIONS = OPTIONS;
  window.QUESTIONS = QUESTIONS;
}

