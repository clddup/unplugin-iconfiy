<script setup>
import IconData from 'virtual:offline-iconify'

console.log(IconData)
</script>

<template>
  <main>
    <div class="icon-grid">
      <template v-for="iconSet in IconData" :key="iconSet.prefix">
        <div class="icon-set">
          <h3>{{ iconSet.prefix }}</h3>
          <div class="icons">
            <div v-for="(iconData, iconName) in iconSet.icons" :key="iconName" class="icon-item">
              <svg :viewBox="`0 0 ${iconSet.width} ${iconSet.height}`">
                <use :xlink:href="'#' + iconSet.prefix + ':' + iconName" />
              </svg>
              <span class="icon-name">{{ iconSet.prefix }}:{{ iconName }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.icon-grid {
  padding: 20px;
}

.icon-set {
  margin-bottom: 40px;
}

.icon-set h3 {
  margin-bottom: 16px;
  font-size: 24px;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

.icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.icon-item:hover {
  border-color: #007acc;
  box-shadow: 0 2px 8px rgba(0, 122, 204, 0.1);
}

.icon-item svg {
  width: 32px;
  height: 32px;
  color: #333;
  fill: currentColor;
  margin-bottom: 8px;
}

.icon-name {
  font-size: 12px;
  color: #666;
  text-align: center;
  word-break: break-all;
}
</style>
