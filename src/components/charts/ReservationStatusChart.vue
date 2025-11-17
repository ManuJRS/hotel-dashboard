<script setup lang="ts">
import { computed } from 'vue'
import { useHotelStore } from '../../stores/hotelStore'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useHotelStore()

const chartData = computed(() => {
  const byStatus = {
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  }

  store.reservations.forEach(r => {
    if (r.status in byStatus) {
      byStatus[r.status]++
    }
  })

  return {
    labels: ['Confirmadas', 'En curso', 'Completadas', 'Canceladas'],
    datasets: [
      {
        label: 'Reservas',
        data: [
          byStatus.confirmed,
          byStatus.in_progress,
          byStatus.completed,
          byStatus.cancelled
        ],
                backgroundColor: [
          '#42A5F5',
          '#66BB6A',
          '#26C6DA',
          '#EF5350'
        ],
        borderWidth: 1
      }
    ]
  }
})

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false 
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const statusLabel = ctx.label || ''
          const value = ctx.raw ?? 0
          return `${statusLabel}: ${value} reservas`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
}
</script>

<template>
  <div style="height: 260px">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>