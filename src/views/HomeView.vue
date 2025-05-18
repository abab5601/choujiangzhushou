<template>
  <div class="home-view">
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>彩票統計</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-2">{{ tickets.length }}</div>
            <div class="text-subtitle-1">總彩票數量</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>中獎統計</v-card-title>
          <v-card-text>
            <div class="text-h4 mb-2">{{ winners.length }}</div>
            <div class="text-subtitle-1">中獎彩票數量</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-card-title>最近添加的彩票</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="ticket in recentTickets"
            :key="ticket.id"
            :title="ticket.number"
            :subtitle="new Date(ticket.timestamp).toLocaleString('zh-TW')"
          >
            <template v-slot:append>
              <v-chip
                :color="ticket.isWinner ? 'success' : 'default'"
                :text="ticket.isWinner ? '已中獎' : '未中獎'"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>快速操作</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              block
              color="primary"
              :to="{ name: 'input' }"
            >
              添加新彩票
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              block
              color="secondary"
              :to="{ name: 'results' }"
            >
              查看開獎結果
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLotteryStore } from '@/stores/lottery'

const store = useLotteryStore()
const tickets = computed(() => store.tickets)
const winners = computed(() => store.winners)
const recentTickets = computed(() => 
  [...tickets.value]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
)
</script>

<style scoped>
.home-view {
  padding: 16px 0;
}
</style> 