<template>
  <div class="w-200px min-h-100px max-h-200px overflow-y-auto">
    <a-space direction="vertical" v-if="!loading">
      <div>{{ $t('chat.detail.guquan') }}：{{ detail.equity }}</div>
      <div>{{ $t('chat.detail.jieshao') }}：{{ detail.description }}</div>
    </a-space>
    <div v-else class="text-center line-height-100px">
      <Icon name="eos-icons:bubble-loading" class="font-size-[20px] animate-spin animate-duration-1500" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from 'vue'
import { taskCompanyDetail } from '@/api/task'
import { useRoute } from 'vue-router'
import Icon from '@/components/Icons/Icon.vue'

const props = defineProps({
  companyId: {
    type: String,
    default: () => ''
  }
})
const route = useRoute()
const loading = ref(false)
const detail = ref({
  equity: '',
  description: ''
})

const { companyId } = toRefs(props)

onMounted(() => {
  loading.value = true
  taskCompanyDetail(route.params.task_id, {
    company_id: companyId.value
  })
    .then((res) => {
      detail.value.equity = res.data.equity || ''
      detail.value.description = res.data.description || ''
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style lang="less" scoped></style>
