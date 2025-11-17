<script setup lang="ts">
import { computed } from 'vue'
import { useHotelStore } from '../../stores/hotelStore'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const store = useHotelStore()

const chartData = computed(() => {
  const available = store.rooms.filter(r => r.status === 'available').length
  const occupied = store.rooms.filter(r => r.status === 'occupied').length
  const maintenance = store.rooms.filter(r => r.status === 'maintenance').length

  return {
    labels: ['Disponibles', 'Ocupadas', 'En mantenimiento'],
    datasets: [
      {
        label: 'Habitaciones',
        data: [available, occupied, maintenance],
                backgroundColor: [
          '#66BB6A',
          '#EF5350',
          '#FFA726'
        ],
        borderWidth: 1
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div style="height: 260px">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
