<!-- src/components/animations/SlotMachineAnimation.vue -->
<template>
  <div class="slot-animation">
    <div class="slot-container">
      <div v-for="(number, index) in displayNumbers" 
           :key="index" 
           class="slot-number"
           :class="{ 'winning-number': !isAnimating && number !== '' }">
        {{ number }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  winningNumbers: string[]
  availableNumbers: string[]
  isAnimating: boolean
}>()

const displayNumbers = ref<string[]>([])

// 初始化顯示數字
onMounted(() => {
  displayNumbers.value = Array(props.winningNumbers.length).fill('')
})

// 監聽中獎號碼變化
watch(() => props.winningNumbers, (newNumbers) => {
  displayNumbers.value = Array(newNumbers.length).fill('')
}, { immediate: true })

// 監聽動畫狀態
watch(() => props.isAnimating, (isAnimating) => {
  if (!isAnimating) {
    // 清空顯示的號碼
    displayNumbers.value = Array(props.winningNumbers.length).fill('')
  }
})

// 執行動畫
async function animate(duration: number, interval: number): Promise<void> {
  const endTime = Date.now() + duration
  
  // 動畫過程
  while (Date.now() < endTime && props.isAnimating) {
    // 生成不重複的隨機號碼
    const tempNumbers = [...props.availableNumbers]
    displayNumbers.value = Array(props.winningNumbers.length).fill('').map(() => {
      const randomIndex = Math.floor(Math.random() * tempNumbers.length)
      const number = tempNumbers[randomIndex]
      tempNumbers.splice(randomIndex, 1)
      return number
    })
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  
  // 如果動畫被取消，清空顯示的號碼
  if (!props.isAnimating) {
    displayNumbers.value = Array(props.winningNumbers.length).fill('')
    return
  }
  
  // 顯示最終結果
  for (let i = 0; i < props.winningNumbers.length; i++) {
    if (!props.isAnimating) {
      // 清空顯示的號碼
      displayNumbers.value = Array(props.winningNumbers.length).fill('')
      break
    }
    displayNumbers.value[i] = props.winningNumbers[i]
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  if (!props.isAnimating) {
    // 清空顯示的號碼
    displayNumbers.value = Array(props.winningNumbers.length).fill('')
  }
}

// 暴露方法給父組件
defineExpose({
  animate
})
</script>

<style scoped>
.slot-animation {
  width: 100%;
  padding: 10px;
}

.slot-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background: linear-gradient(45deg, #1976D2, #64B5F6);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  justify-content: center;
  max-width: 100%;
}

.slot-number {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 1.5em;
  font-weight: bold;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.winning-number {
  background: #E3F2FD;
  border: 2px solid #1976D2;
  transform: scale(1.05);
}
</style>