<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { ui } from '../i18n/ui';

const props = defineProps<{
  lang: 'sk' | 'en';
}>();

const status = ref<'open' | 'closed' | 'opens_soon' | 'closed_today'>('open');
const nextOpenTime = ref('');

const checkStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;

    // Opening Hours Configuration (in minutes)
    const openingTime = 11 * 60; // 11:00
    const closingTimeWeekday = 22 * 60; // 22:00
    const closingTimeWeekend = 24 * 60; // 00:00 (next day)

    // Sunday - Closed
    if (day === 0) {
        status.value = 'closed_today';
        return;
    }

    // Friday (5) & Saturday (6)
    const isWeekend = day === 5 || day === 6;
    const closingTime = isWeekend ? closingTimeWeekend : closingTimeWeekday;

    if (currentTime >= openingTime && currentTime < closingTime) {
        status.value = 'open';
    } else if (currentTime < openingTime && currentTime >= openingTime - 60) {
        // Opens in less than 1 hour
        status.value = 'opens_soon';
    } else {
        status.value = 'closed';
    }
};

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
    // Delay check to let animation finish
    setTimeout(() => {
        checkStatus();
        interval = setInterval(checkStatus, 60000); // Check every minute
    }, 2000);
});

onUnmounted(() => {
    clearInterval(interval);
});

const t = (key: keyof typeof ui.sk) => {
  return ui[props.lang][key] || ui['sk'][key];
};

const statusConfig = computed(() => {
    switch (status.value) {
        case 'open':
            return {
                text: t('hero.status.open'),
                color: 'text-green-400',
                dotColor: 'bg-green-500',
                pulse: true
            };
        case 'opens_soon':
            return {
                text: t('hero.status.opens_at'),
                color: 'text-amber-400',
                dotColor: 'bg-amber-500',
                pulse: true
            };
        case 'closed_today':
            return {
                text: t('hero.status.closed_today'),
                color: 'text-red-400',
                dotColor: 'bg-red-500',
                pulse: false
            };
        case 'closed':
        default:
            return {
                text: t('hero.status.closed'),
                color: 'text-red-400',
                dotColor: 'bg-red-500',
                pulse: false
            };
    }
});
</script>

<template>
    <div class="flex items-center justify-center gap-2 mt-8 opacity-0 animate-fade-in" style="animation-delay: 0.8s">
        <div class="relative flex h-3 w-3">
            <span v-if="statusConfig.pulse" :class="`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.dotColor}`"></span>
            <span :class="`relative inline-flex rounded-full h-3 w-3 ${statusConfig.dotColor}`"></span>
        </div>
        <span :class="`text-sm font-medium tracking-widest uppercase ${statusConfig.color}`">
            {{ statusConfig.text }}
        </span>
    </div>
</template>
