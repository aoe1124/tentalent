/**
 * 测试逻辑控制
 * 处理答题流程、进度保存、页面跳转等
 */

// 全局状态
let currentQuestionIndex = 0;
let answers = {};  // 存储答案 {questionId: selectedScore}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initTest();
});

/**
 * 初始化测试
 */
function initTest() {
  // 尝试从localStorage恢复进度
  loadProgress();
  
  // 显示当前题目
  renderQuestion();
  
  // 更新进度条
  updateProgress();
  
  // 添加键盘快捷键支持（数字键1-5选择选项）
  document.addEventListener('keydown', handleKeyPress);
}

/**
 * 渲染题目
 */
function renderQuestion() {
  const question = QUESTIONS[currentQuestionIndex];
  
  // 更新题目文字
  document.getElementById('questionTitle').textContent = question.text;
  
  // 生成选项
  const optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';
  
  OPTIONS.forEach((option, index) => {
    const optionCard = document.createElement('div');
    optionCard.className = 'option-card';
    optionCard.textContent = option.text;
    optionCard.dataset.score = option.score;
    optionCard.dataset.index = index;
    
    // 如果当前题已经选择过，恢复选中状态
    const savedAnswer = answers[question.id];
    if (savedAnswer !== undefined && savedAnswer === option.score) {
      optionCard.classList.add('selected');
      enableNextButton();
    }
    
    // 点击选项
    optionCard.addEventListener('click', () => selectOption(optionCard, option.score, question.id));
    
    optionsList.appendChild(optionCard);
  });
  
  // 添加动画
  optionsList.classList.remove('fade-in');
  setTimeout(() => {
    optionsList.classList.add('fade-in');
  }, 10);
}

/**
 * 选择选项
 */
function selectOption(selectedCard, score, questionId) {
  // 移除所有选项的选中状态
  document.querySelectorAll('.option-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // 选中当前选项
  selectedCard.classList.add('selected');
  
  // 保存答案
  answers[questionId] = score;
  
  // 保存到localStorage
  saveProgress();
  
  // 启用"下一题"按钮
  enableNextButton();
  
  // 延迟500ms自动跳到下一题（可选，提升流畅度）
  if (currentQuestionIndex < QUESTIONS.length - 1) {
    setTimeout(() => {
      if (selectedCard.classList.contains('selected')) {
        goToNextQuestion();
      }
    }, 500);
  }
}

/**
 * 上一题
 */
function goToPrevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
    updateProgress();
    updateNavigationButtons();
  }
}

/**
 * 下一题
 */
function goToNextQuestion() {
  if (currentQuestionIndex < QUESTIONS.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
    updateProgress();
    updateNavigationButtons();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // 最后一题，跳转到结果页
    finishTest();
  }
}

/**
 * 完成测试
 */
function finishTest() {
  // 确保所有题目都已回答
  if (Object.keys(answers).length < QUESTIONS.length) {
    alert('请完成所有题目后再提交');
    return;
  }
  
  // 保存答案到localStorage
  localStorage.setItem('testAnswers', JSON.stringify(answers));
  
  // 清除进度
  localStorage.removeItem('testProgress');
  
  // 跳转到结果页
  window.location.href = 'result.html';
}

/**
 * 更新进度条
 */
function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  progressBar.style.width = progress + '%';
  progressText.textContent = `第${currentQuestionIndex + 1}题 / 共${QUESTIONS.length}题`;
}

/**
 * 更新导航按钮状态
 */
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const nextBtnText = document.getElementById('nextBtnText');
  
  // 上一题按钮
  if (currentQuestionIndex === 0) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = '0.5';
  } else {
    prevBtn.disabled = false;
    prevBtn.style.opacity = '1';
  }
  
  // 下一题/完成按钮
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const hasAnswer = answers[currentQuestion.id] !== undefined;
  
  if (currentQuestionIndex === QUESTIONS.length - 1) {
    nextBtnText.textContent = '查看结果';
  } else {
    nextBtnText.textContent = '下一题';
  }
  
  // 只有选择了选项才能点击下一题
  if (!hasAnswer) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
  }
}

/**
 * 启用"下一题"按钮
 */
function enableNextButton() {
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled = false;
  nextBtn.style.opacity = '1';
}

/**
 * 保存进度到localStorage
 */
function saveProgress() {
  const progress = {
    currentQuestionIndex,
    answers
  };
  localStorage.setItem('testProgress', JSON.stringify(progress));
}

/**
 * 从localStorage加载进度
 */
function loadProgress() {
  const savedProgress = localStorage.getItem('testProgress');
  if (savedProgress) {
    try {
      const progress = JSON.parse(savedProgress);
      currentQuestionIndex = progress.currentQuestionIndex || 0;
      answers = progress.answers || {};
    } catch (e) {
      console.error('加载进度失败:', e);
    }
  }
}

/**
 * 键盘快捷键支持
 */
function handleKeyPress(event) {
  const key = event.key;
  
  // 数字键1-5选择选项
  if (key >= '1' && key <= '5') {
    const index = parseInt(key) - 1;
    const optionCards = document.querySelectorAll('.option-card');
    if (optionCards[index]) {
      optionCards[index].click();
    }
  }
  
  // 左右箭头键切换题目
  if (key === 'ArrowLeft') {
    goToPrevQuestion();
  } else if (key === 'ArrowRight') {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    if (answers[currentQuestion.id] !== undefined) {
      goToNextQuestion();
    }
  }
}

/**
 * 重置测试（调试用）
 */
function resetTest() {
  if (confirm('确定要重新开始测试吗？当前进度将丢失。')) {
    localStorage.removeItem('testProgress');
    localStorage.removeItem('testAnswers');
    window.location.href = 'index.html';
  }
}

