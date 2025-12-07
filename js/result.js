/**
 * 结果计算和展示
 * 包括：计分、雷达图绘制、结果分析
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initResult();
});

/**
 * 初始化结果页面
 */
function initResult() {
  // 获取答案数据
  const answersStr = localStorage.getItem('testAnswers');
  
  if (!answersStr) {
    alert('未找到测试数据，请先完成测试');
    window.location.href = 'index.html';
    return;
  }
  
  try {
    const answers = JSON.parse(answersStr);
    
    // 计算各维度分数
    const scores = calculateScores(answers);
    
    // 显示综合评价
    displaySummary(scores);
    
    // 绘制雷达图
    drawRadarChart(scores);
    
    // 显示分值列表
    displayScoresList(scores);
    
    // 添加动画
    document.body.classList.add('fade-in');
    
  } catch (e) {
    console.error('数据解析失败:', e);
    alert('数据异常，请重新测试');
    window.location.href = 'index.html';
  }
}

/**
 * 计算各维度分数
 * @param {Object} answers - 答案对象 {questionId: score}
 * @returns {Object} - 各维度分数 {dimension: score}
 */
function calculateScores(answers) {
  // 初始化各维度基础分（10分）
  const scores = {
    A: 10, B: 10, C: 10, D: 10, E: 10,
    F: 10, G: 10, H: 10, I: 10, J: 10
  };
  
  // 累加每道题的分数到对应维度
  QUESTIONS.forEach(question => {
    const dimension = question.dimension;
    const score = answers[question.id] || 0;
    scores[dimension] += score;
  });
  
  // 四舍五入到整数
  Object.keys(scores).forEach(key => {
    scores[key] = Math.round(scores[key]);
  });
  
  return scores;
}

/**
 * 显示综合评价文字
 */
function displaySummary(scores) {
  // 转换为数组并排序
  const sortedScores = Object.entries(scores)
    .map(([dimension, score]) => ({
      dimension,
      score,
      name: DIMENSIONS[dimension].fullName
    }))
    .sort((a, b) => b.score - a.score);
  
  // 前3名（优势）
  const top3 = sortedScores.slice(0, 3);
  // 后3名（较弱）
  const bottom3 = sortedScores.slice(-3);
  
  // 生成文字
  const top3Names = top3.map(item => 
    `<span class="highlight-talent">${item.name}</span>`
  ).join('、');
  
  const bottom3Names = bottom3.map(item => 
    `<span class="lowlight-talent">${item.name}</span>`
  ).join('、');
  
  const summaryText = `你最具有 ${top3Names}，然而 ${bottom3Names} 相对较弱。`;
  
  document.getElementById('resultSummary').innerHTML = summaryText;
}

/**
 * 绘制雷达图（使用Canvas）
 */
function drawRadarChart(scores) {
  const canvas = document.getElementById('radarChart');
  const ctx = canvas.getContext('2d');
  
  // 设置canvas实际尺寸（支持高DPI屏幕）
  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  
  // 配置
  const center = size / 2;
  const radius = size * 0.35;
  const dimensions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const levels = 5; // 5层网格（10, 12, 14, 16, 18, 20）
  const minScore = 10;
  const maxScore = 20;
  
  // 清空画布
  ctx.clearRect(0, 0, size, size);
  
  // 1. 绘制背景网格
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  
  for (let i = 1; i <= levels; i++) {
    const r = (radius / levels) * i;
    ctx.beginPath();
    for (let j = 0; j <= dimensions.length; j++) {
      const angle = (Math.PI * 2 / dimensions.length) * j - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  // 2. 绘制坐标轴
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1;
  
  dimensions.forEach((dim, i) => {
    const angle = (Math.PI * 2 / dimensions.length) * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  
  // 3. 绘制数据区域
  ctx.fillStyle = 'rgba(124, 58, 237, 0.15)';
  ctx.strokeStyle = 'rgba(124, 58, 237, 0.8)';
  ctx.lineWidth = 2.5;
  
  ctx.beginPath();
  dimensions.forEach((dim, i) => {
    const score = scores[dim];
    const normalizedScore = (score - minScore) / (maxScore - minScore);
    const r = radius * normalizedScore;
    const angle = (Math.PI * 2 / dimensions.length) * i - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 4. 绘制数据点
  ctx.fillStyle = '#7C3AED';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  
  dimensions.forEach((dim, i) => {
    const score = scores[dim];
    const normalizedScore = (score - minScore) / (maxScore - minScore);
    const r = radius * normalizedScore;
    const angle = (Math.PI * 2 / dimensions.length) * i - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  
  // 5. 绘制标签和分数
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  dimensions.forEach((dim, i) => {
    const score = scores[dim];
    const angle = (Math.PI * 2 / dimensions.length) * i - Math.PI / 2;
    const labelRadius = radius + 25;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    
    // 绘制维度代号
    ctx.fillStyle = '#7C3AED';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText(dim, x, y - 8);
    
    // 绘制分数
    ctx.fillStyle = '#7C3AED';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText('(' + score + '分)', x, y + 8);
  });
}

/**
 * 显示分值列表
 */
function displayScoresList(scores) {
  const scoresList = document.getElementById('scoresList');
  scoresList.innerHTML = '';
  
  // 转换为数组
  const scoresArray = Object.entries(scores).map(([dimension, score]) => ({
    dimension,
    score,
    name: DIMENSIONS[dimension].name,
    fullName: DIMENSIONS[dimension].fullName
  }));
  
  // 按原始顺序显示（A-J）
  scoresArray.forEach(item => {
    const scoreItem = createScoreItem(item);
    scoresList.appendChild(scoreItem);
  });
  
  // 添加动画
  setTimeout(() => {
    document.querySelectorAll('.score-item').forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('fade-in');
        const bar = item.querySelector('.score-bar');
        const targetWidth = bar.dataset.width;
        bar.style.width = targetWidth;
      }, index * 50);
    });
  }, 300);
}

/**
 * 创建单个分值项
 */
function createScoreItem(item) {
  const { dimension, score, name, fullName } = item;
  
  // 判断等级
  let level = 'low';
  let rating = '不太擅长';
  if (score >= 17) {
    level = 'high';
    rating = '非常擅长';
  } else if (score >= 14) {
    level = 'medium';
    rating = '有些擅长';
  }
  
  // 计算进度条宽度（10-20分映射到0-100%）
  const percentage = ((score - 10) / 10) * 100;
  
  // 创建元素
  const scoreItem = document.createElement('div');
  scoreItem.className = 'score-item';
  
  scoreItem.innerHTML = `
    <div class="score-label">${dimension}. ${name}:</div>
    <div class="score-bar-wrapper">
      <div class="score-bar level-${level}" data-width="${percentage}%" style="width: 0%">
        <span class="score-value">${score}分</span>
      </div>
    </div>
    <div class="score-rating">${rating}</div>
  `;
  
  return scoreItem;
}

/**
 * 返回首页
 */
function goToHome() {
  if (confirm('确定返回首页吗？')) {
    localStorage.removeItem('testAnswers');
    window.location.href = 'index.html';
  }
}

/**
 * 重新测试
 */
function restartTest() {
  if (confirm('确定要重新测试吗？')) {
    localStorage.removeItem('testAnswers');
    localStorage.removeItem('testProgress');
    window.location.href = 'test.html';
  }
}

