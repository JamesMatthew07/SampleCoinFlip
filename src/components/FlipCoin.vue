<template>
  <div class="parent">
    <div ref="flipCard" class="flip-card" @click="startAnimation">
      <div
        class="flip-card-inner"
        :class="{
          flipping: isFlipping,
        }"
        :style="flipStyle"
      >
        <div class="flip-card-front"></div>
        <div class="flip-card-back"></div>
      </div>
    </div>
    <div v-if="!isFlipping && animationComplete" class="result">
      Result: {{ isHeads ? 'Heads' : 'Tails' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const isHeads = ref(true)
const isFlipping = ref(false)
const animationComplete = ref(false)
const flipCard = ref(null)
const rotationY = ref(0)

const flipStyle = computed(() => {
  return {
    transform: `rotateY(${rotationY.value}deg)`,
  }
})

const startAnimation = () => {
  if (isFlipping.value) return

  isFlipping.value = true
  animationComplete.value = false

  const result = Math.random() >= 0.5
  isHeads.value = result

  const finalRotation = result
    ? Math.floor(Math.random() * 5 + 10) * 360
    : Math.floor(Math.random() * 5 + 10) * 360 + 180

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
      startSlowDown(finalRotation)
    }
  }, fastSpinInterval)
}

const startSlowDown = (finalRotation: number) => {
  const remainingRotation = finalRotation - rotationY.value

  const slowDownDuration = 2500
  const slowDownFrames = 100
  const slowDownInterval = slowDownDuration / slowDownFrames

  let frame = 0
  const slowDownAnimation = setInterval(() => {
    const progress = frame / slowDownFrames
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)

    rotationY.value =
      rotationY.value +
      remainingRotation * (easeOutCubic - (frame > 0 ? (frame - 1) / slowDownFrames : 0))
    frame++

    if (frame >= slowDownFrames) {
      clearInterval(slowDownAnimation)
      finishAnimation(finalRotation)
    }
  }, slowDownInterval)
}

const finishAnimation = (finalRotation: number) => {
  rotationY.value = finalRotation

  rotationY.value = rotationY.value % 360

  isFlipping.value = false
  animationComplete.value = true
}

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
  gap: 20px;
  padding: 20px;
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
  background-image: url('../src/assets/Tails.png');
  background-size: cover;
  background-position: center;
  transform: rotateY(180deg);
}

.result {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
}
</style>
