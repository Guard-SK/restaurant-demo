<script setup lang="ts">
import { ref, computed } from 'vue';
import { ui } from '../i18n/ui';

const props = defineProps<{
  lang: 'sk' | 'en';
}>();

const t = (key: keyof typeof ui.sk) => {
  return ui[props.lang][key] || ui['sk'][key];
};

const form = ref({
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  note: ''
});

const isSubmitting = ref(false);
const isSuccess = ref(false);

// Date Constraints
const minDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
});

const maxDate = computed(() => {
    const future = new Date();
    future.setDate(future.getDate() + 90); // Max 3 months in advance
    return future.toISOString().split('T')[0];
});

const timeOptions = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const submitReservation = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would connect to an API
    console.log('Reservation data:', form.value);
    
    isSubmitting.value = false;
    isSuccess.value = true;
};
</script>

<template>
  <div class="w-full max-w-4xl mx-auto bg-lunar-dark p-8 md:p-12 shadow-2xl relative overflow-hidden rounded-sm">
    <!-- Decorative border -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lunar-gold to-transparent"></div>

    <div v-if="!isSuccess">
      <div class="text-center mb-10">
        <h3 class="text-3xl font-serif text-lunar-white mb-2">{{ t('booking.title') }}</h3>
        <p class="text-gray-500 text-sm tracking-widest uppercase">{{ t('booking.subtitle') }}</p>
      </div>

      <form @submit.prevent="submitReservation" class="space-y-8">
        <!-- Contact Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Name -->
          <div class="relative group">
            <input 
              id="booking-name"
              v-model="form.name" 
              type="text" 
              required
              placeholder=" "
              class="peer w-full bg-transparent border-b border-gray-700 py-3 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors"
            />
            <label for="booking-name" class="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-lunar-gold peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-400 cursor-text pointer-events-none">
              {{ t('booking.label.name') }}
            </label>
          </div>

          <!-- Email -->
          <div class="relative group">
            <input 
              id="booking-email"
              v-model="form.email" 
              type="email" 
              required
              placeholder=" "
              class="peer w-full bg-transparent border-b border-gray-700 py-3 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors"
            />
            <label for="booking-email" class="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-lunar-gold peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-400 cursor-text pointer-events-none">
              {{ t('booking.label.email') }}
            </label>
          </div>

           <!-- Phone -->
           <div class="relative group">
            <input 
              id="booking-phone"
              v-model="form.phone" 
              type="tel" 
              required
              placeholder=" "
              pattern="[\+]?[0-9\s]{9,}"
              class="peer w-full bg-transparent border-b border-gray-700 py-3 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors"
            />
            <label for="booking-phone" class="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-lunar-gold peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-400 cursor-text pointer-events-none">
              {{ t('booking.label.phone') }}
            </label>
          </div>
        </div>

        <!-- Reservation Details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <!-- Date -->
           <div class="relative group">
            <input 
              id="booking-date"
              v-model="form.date" 
              type="date" 
              required
              :min="minDate"
              :max="maxDate"
              class="w-full bg-transparent border-b border-gray-700 py-3 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors appearance-none"
            />
            <label for="booking-date" class="absolute left-0 -top-4 text-xs text-gray-400 uppercase tracking-wider">{{ t('booking.label.date') }}</label>
          </div>

          <!-- Time -->
           <div class="relative group">
            <select 
                id="booking-time"
                v-model="form.time" 
                required
                class="w-full bg-transparent border-b border-gray-700 py-3.5 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors [&>option]:bg-lunar-dark"
            >
                <option value="" disabled selected class="text-gray-500"></option>
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
            </select>
            <label for="booking-time" class="absolute left-0 -top-4 text-xs text-gray-400 uppercase tracking-wider">{{ t('booking.label.time') }}</label>
          </div>

          <!-- Guests -->
          <div class="relative group">
            <div class="flex items-center border-b border-gray-700 py-2">
                <button 
                    type="button"
                    @click="form.guests > 1 ? form.guests-- : null"
                    class="w-8 h-8 flex items-center justify-center text-lunar-gold hover:bg-lunar-gold/10 rounded-full transition-colors"
                    aria-label="Decrease guests"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                    </svg>
                </button>
                <span class="flex-1 text-center text-lunar-white font-serif text-lg">{{ form.guests }}</span>
                <button 
                    type="button"
                    @click="form.guests < 10 ? form.guests++ : null"
                    class="w-8 h-8 flex items-center justify-center text-lunar-gold hover:bg-lunar-gold/10 rounded-full transition-colors"
                    aria-label="Increase guests"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
            <label class="absolute left-0 -top-4 text-xs text-gray-400 uppercase tracking-wider">{{ t('booking.label.guests') }}</label>
          </div>
        </div>

        <!-- Note -->
        <div class="relative group pt-4">
            <textarea 
              id="booking-note"
              v-model="form.note" 
              placeholder=" "
              rows="1"
              class="peer w-full bg-transparent border-b border-gray-700 py-2 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors resize-none"
            ></textarea>
            <label for="booking-note" class="absolute left-0 top-6 text-gray-500 text-sm transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-lunar-gold peer-valid:top-0 peer-valid:text-xs peer-valid:text-gray-400 cursor-text pointer-events-none">
              {{ t('booking.label.note') }}
            </label>
        </div>

        <!-- Submit Button -->
        <div class="pt-8 text-center">
            <button 
                type="submit" 
                :disabled="isSubmitting"
                class="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-serif tracking-widest text-lunar-black transition-all duration-300 bg-lunar-gold hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm font-bold"
            >
                <span class="mr-2" v-if="isSubmitting">{{ t('booking.button.sending') }}</span>
                <span v-else>{{ t('booking.button') }}</span>
            </button>
        </div>
        
        <p class="text-xs text-gray-600 text-center mt-6">
            {{ t('booking.group_info') }}
        </p>
      </form>
    </div>

    <!-- Success Message -->
    <div v-else class="text-center py-16 flex flex-col items-center animate-fade-in">
        <div class="w-20 h-20 border-2 border-lunar-gold rounded-full flex items-center justify-center mb-8 text-lunar-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h3 class="text-4xl font-serif text-lunar-white mb-6">{{ t('booking.success.title') }}</h3>
        <p class="text-lunar-muted max-w-md mx-auto mb-10 text-lg leading-relaxed">
            {{ t('booking.success.text') }}
        </p>
        <button 
            @click="isSuccess = false; form = { ...form, name: '', email: '', phone: '', note: '' }"
            class="text-sm uppercase tracking-widest text-lunar-gold hover:text-white transition-colors border-b border-lunar-gold/50 hover:border-white pb-1"
        >
            {{ t('booking.new_booking') }}
        </button>
    </div>
  </div>
</template>
