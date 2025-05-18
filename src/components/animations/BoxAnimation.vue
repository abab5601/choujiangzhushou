<!-- src/components/animations/BoxAnimation.vue -->
<template>
  <div class="box-animation">
    <div class="boxes-container">
      <div v-for="(number, index) in displayNumbers" 
           :key="index" 
           class="box-container"
           :class="{ 'shaking': isShaking && !number }">
        <v-icon size="x-large" color="primary" class="mb-2">mdi-gift</v-icon>
        <div class="box-number" :class="{ 'revealed': number }">
          {{ number || '搖動中...' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  winningNumbers: string[]
  isAnimating: boolean
}>()

const displayNumbers = ref<string[]>([])
const isShaking = ref(false)

// 監聽中獎號碼變化
watch(() => props.winningNumbers, (newNumbers) => {
  displayNumbers.value = Array(newNumbers.length).fill('')
}, { immediate: true })

async function animate(duration: number): Promise<void> {
  const delayPerBox = duration / props.winningNumbers.length
  isShaking.value = true

  for (let i = 0; i < props.winningNumbers.length; i++) {
    await new Promise(resolve => setTimeout(resolve, delayPerBox / 2))
    displayNumbers.value[i] = props.winningNumbers[i]
    await new Promise(resolve => setTimeout(resolve, delayPerBox / 2))
  }

  isShaking.value = false
}

defineExpose({
  animate
})
</script>

<style scoped>
.box-animation {
  width: 100%;
  padding: 20px;
}

.boxes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  min-height: 150px;
  max-width: 100%;
}

.box-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 120px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.box-number {
  margin-top: 10px;
  font-size: 1.5em;
  font-weight: bold;
  opacity: 0.7;
  transition: all 0.3s ease;
  text-align: center;
  word-break: break-all;
}

.box-number.revealed {
  opacity: 1;
  color: #1976D2;
  transform: scale(1.1);
}

.shaking {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-10px, 0); }
  50% { transform: translate(10px, 0); }
  75% { transform: translate(-10px, 0); }
}
</style> 