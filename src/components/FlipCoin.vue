<template>
  <div class="parent">
    <div ref="flipCard1" class="flip-card" @click="startAnimation">
      <div class="flip-card-inner" :class="{ flipping: isFlipping }" :style="flipStyle1">
        <div class="flip-card-front"></div>
        <div class="flip-card-back"></div>
      </div>
    </div>
    <div ref="flipCard2" class="flip-card" @click="startAnimation">
      <div class="flip-card-inner" :class="{ flipping: isFlipping }" :style="flipStyle2">
        <div class="flip-card-front"></div>
        <div class="flip-card-back"></div>
      </div>
    </div>
    <div ref="flipCard3" class="flip-card" @click="startAnimation">
      <div class="flip-card-inner" :class="{ flipping: isFlipping }" :style="flipStyle3">
        <div class="flip-card-front"></div>
        <div class="flip-card-back"></div>
      </div>
    </div>
    <div v-if="!isFlipping && animationComplete" class="result">
      Result Pog 1: {{ isHeadsPog1 ? 'Heads' : 'Tails' }} | Pog 2:
      {{ isHeadsPog2 ? 'Heads' : 'Tails' }} | Equalizer:
      {{ isHeadsPog3 ? 'Heads' : 'Tails' }}

      <div style="font-weight: 1000">{{ winner }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'

const isHeadsPog1 = ref(true)
const isHeadsPog2 = ref(true)
const isHeadsPog3 = ref(true)
const isFlipping = ref(false)
const animationComplete = ref(false)
const rotationY1 = ref(0)
const rotationY2 = ref(0)
const rotationY3 = ref(0)

const flipStyle1 = computed(() => ({
  transform: `rotateY(${rotationY1.value}deg)`,
}))

const flipStyle2 = computed(() => ({
  transform: `rotateY(${rotationY2.value}deg)`,
}))

const flipStyle3 = computed(() => ({
  transform: `rotateY(${rotationY3.value}deg)`,
}))

const startAnimation = () => {
  if (isFlipping.value) return

  isFlipping.value = true
  animationComplete.value = false

  isHeadsPog1.value = Math.random() >= 0.5
  isHeadsPog2.value = Math.random() >= 0.5

  const finalRotationPog1 = isHeadsPog1.value
    ? Math.floor(Math.random() * 5 + 10) * 360
    : Math.floor(Math.random() * 5 + 10) * 360 + 180

  const finalRotationPog2 = isHeadsPog2.value
    ? Math.floor(Math.random() * 5 + 10) * 360
    : Math.floor(Math.random() * 5 + 10) * 360 + 180

  const finalRotationPog3 = isHeadsPog3.value
    ? Math.floor(Math.random() * 5 + 10) * 360
    : Math.floor(Math.random() * 5 + 10) * 360 + 180

  spinAnimation(finalRotationPog1, rotationY1, () => startSlowDown(finalRotationPog1, rotationY1))
  spinAnimation(finalRotationPog2, rotationY2, () => startSlowDown(finalRotationPog2, rotationY2))
  spinAnimation(finalRotationPog3, rotationY3, () => startSlowDown(finalRotationPog3, rotationY3))
}

const spinAnimation = (finalRotation: number, rotationY: Ref<number>, callback: () => void) => {
  const fastSpinDuration = 2000
  const fastSpinFrames = 60
  const fastSpinInterval = fastSpinDuration / fastSpinFrames
  const fastSpinRotationPerFrame = (finalRotation * 0.7) / fastSpinFrames

  let frame = 0
  const fastSpinAnimation = setInterval(() => {
    rotationY.value += fastSpinRotationPerFrame
    frame++

    if (frame >= fastSpinFrames) {
      clearInterval(fastSpinAnimation)
      callback()
    }
  }, fastSpinInterval)
}

const startSlowDown = (finalRotation: number, rotationY: Ref<number>) => {
  const remainingRotation = finalRotation - rotationY.value
  const slowDownDuration = 2500
  const slowDownFrames = 100
  const slowDownInterval = slowDownDuration / slowDownFrames

  let frame = 0
  const slowDownAnimation = setInterval(() => {
    const progress = frame / slowDownFrames
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)

    rotationY.value +=
      remainingRotation * (easeOutCubic - (frame > 0 ? (frame - 1) / slowDownFrames : 0))
    frame++

    if (frame >= slowDownFrames) {
      clearInterval(slowDownAnimation)
      finishAnimation(finalRotation, rotationY)
    }
  }, slowDownInterval)
}

const finishAnimation = (finalRotation: number, rotationY: Ref<number>) => {
  rotationY.value = finalRotation % 360
  isFlipping.value = false
  animationComplete.value = true
}

const winner = computed(() => {
  if (!animationComplete.value) return null

  const results = [isHeadsPog1.value, isHeadsPog2.value, isHeadsPog3.value]
  const uniqueResults = [...new Set(results)]

  if (uniqueResults.length === 2) {
    const uniqueResult = uniqueResults.find(
      (result) => results.filter((r) => r === result).length === 1,
    )
    const winnerIndex = uniqueResult !== undefined ? results.indexOf(uniqueResult) : -1
    return `Pog ${winnerIndex + 1} is the winner!`
  }

  return 'No unique winner!'
})

onMounted(() => {
  startAnimation()
})
</script>

<style scoped>
.parent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.flip-card {
  background-color: transparent;
  width: 120px;
  height: 120px;
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transform-style: preserve-3d;
  transition: transform 0.1s linear;
}

.flip-card-inner.flipping {
  transition: none;
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
}

.flip-card-front {
  background-image: url('../src/assets/heads.png');
  background-size: cover;
  background-position: center;
}

.flip-card-back {
  background-image: url('../src/assets/tails.png');
  background-size: cover;
  background-position: center;
  transform: rotateY(180deg);
}

.result {
  display: flex;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}
</style>
