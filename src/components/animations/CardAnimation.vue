<!-- src/components/animations/CardAnimation.vue -->
<template>
  <div class="card-animation">
    <div class="cards-container">
      <div v-for="(number, index) in displayNumbers" 
           :key="index" 
           class="card-container">
        <div class="card-inner" :class="{ 'is-flipped': cardStates[index] }">
          <div class="card-front">?</div>
          <div class="card-back">{{ number }}</div>
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
const cardStates = ref<boolean[]>([])

// 監聽中獎號碼變化
watch(() => props.winningNumbers, (newNumbers) => {
  displayNumbers.value = Array(newNumbers.length).fill('')
  cardStates.value = Array(newNumbers.length).fill(false)
}, { immediate: true })

async function animate(duration: number): Promise<void> {
  const delayPerCard = duration / props.winningNumbers.length

  for (let i = 0; i < props.winningNumbers.length; i++) {
    displayNumbers.value[i] = props.winningNumbers[i]
    await new Promise(resolve => setTimeout(resolve, delayPerCard / 2))
    cardStates.value[i] = true
    await new Promise(resolve => setTimeout(resolve, delayPerCard / 2))
  }
}

defineExpose({
  animate
})
</script>

<style scoped>
.card-animation {
  width: 100%;
  overflow-x: auto;
  padding: 20px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  min-height: 120px;
}

.card-container {
  perspective: 1000px;
  width: 100px;
  height: 120px;
  margin-bottom: 10px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  font-weight: bold;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-front {
  background-color: #1976D2;
  color: white;
}

.card-back {
  background-color: #fff;
  border: 2px solid #1976D2;
  transform: rotateY(180deg);
}
</style> 