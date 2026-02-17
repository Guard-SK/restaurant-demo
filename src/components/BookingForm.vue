<script setup lang="ts">
import { ref } from 'vue';

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

const submitReservation = async () => {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would connect to Google Reserve or Reservio API
    // console.log('Reservation data:', form.value);
    
    isSubmitting.value = false;
    isSuccess.value = true;
};
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-lunar-dark p-8 md:p-12 shadow-2xl relative overflow-hidden">
    <!-- Decorative border -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lunar-gold to-transparent"></div>

    <div v-if="!isSuccess">
      <h3 class="text-3xl font-serif text-lunar-white text-center mb-2">Rezervácia Stola</h3>
      <p class="text-center text-gray-500 mb-10 text-sm tracking-wide">ZAŽITE ATMOSFÉRU LUNAR BISTRA</p>

      <form @submit.prevent="submitReservation" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Name -->
          <div class="relative group">
            <input 
              v-model="form.name" 
              type="text" 
              required
              placeholder=" "
              class="peer w-full bg-transparent border-b border-gray-700 py-2 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors"
            />
            <label class="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-lunar-gold peer-valid:-top-5 peer-valid:text-xs peer-valid:text-gray-400 cursor-text">
              Meno a Priezvisko
            </label>
          </div>

           <!-- Phone -->
           <div class="relative group">
            <input 
              v-model="form.phone" 
              type="tel" 
              required
              placeholder=" "
              class="peer w-full bg-transparent border-b border-gray-700 py-2 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors"
            />
            <label class="absolute left-0 top-2 text-gray-500 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-lunar-gold peer-valid:-top-5 peer-valid:text-xs peer-valid:text-gray-400 cursor-text">
              Telefón
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <!-- Date -->
           <div class="relative group">
            <input 
              v-model="form.date" 
              type="date" 
              required
              class="w-full bg-transparent border-b border-gray-700 py-2 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors pt-3"
            />
            <label class="absolute left-0 -top-4 text-xs text-gray-400">Dátum</label>
          </div>

          <!-- Time -->
           <div class="relative group">
            <input 
              v-model="form.time" 
              type="time" 
              required
              class="w-full bg-transparent border-b border-gray-700 py-2 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors pt-3"
            />
            <label class="absolute left-0 -top-4 text-xs text-gray-400">Čas</label>
          </div>

          <!-- Guests -->
          <div class="relative group">
            <select 
                v-model="form.guests" 
                class="w-full bg-transparent border-b border-gray-700 py-2.5 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors [&>option]:bg-lunar-dark"
            >
                <option v-for="n in 10" :key="n" :value="n">{{ n }} Osôb</option>
            </select>
            <label class="absolute left-0 -top-4 text-xs text-gray-400">Počet hostí</label>
          </div>
        </div>

        <!-- Note -->
        <div class="relative group pt-4">
            <textarea 
              v-model="form.note" 
              placeholder=" "
              rows="2"
              class="peer w-full bg-transparent border-b border-gray-700 py-2 text-lunar-white focus:outline-none focus:border-lunar-gold transition-colors resize-none"
            ></textarea>
            <label class="absolute left-0 top-6 text-gray-500 text-sm transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-lunar-gold peer-valid:top-0 peer-valid:text-xs peer-valid:text-gray-400 cursor-text">
              Poznámka (voliteľné)
            </label>
        </div>

        <!-- Submit Button -->
        <div class="pt-6 text-center">
            <button 
                type="submit" 
                :disabled="isSubmitting"
                class="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-serif tracking-widest text-white transition-all duration-300 bg-transparent border border-lunar-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span class="mr-2" v-if="isSubmitting">odosielam...</span>
                <span v-else>REZERVOVAŤ STÔL</span>
            </button>
        </div>
        
        <p class="text-xs text-gray-600 text-center mt-4">
            Pre väčšie skupiny (10+) nás prosím kontaktujte telefonicky.
        </p>
      </form>
    </div>

    <!-- Success Message -->
    <div v-else class="text-center py-12 flex flex-col items-center animate-fade-in">
        <div class="w-16 h-16 border-2 border-lunar-gold rounded-full flex items-center justify-center mb-6 text-lunar-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h3 class="text-3xl font-serif text-lunar-white mb-4">Ďakujeme!</h3>
        <p class="text-gray-400 max-w-md mx-auto mb-8">
            Vaša žiadosť o rezerváciu bola prijatá. Čoskoro vám zašleme potvrdenie na uvedený email.
        </p>
        <button 
            @click="isSuccess = false; form = { ...form, name: '', email: '', phone: '', note: '' }"
            class="text-sm uppercase tracking-widest text-lunar-gold hover:text-white transition-colors border-b border-lunar-gold/50 hover:border-white pb-1"
        >
            Nová rezervácia
        </button>
    </div>
  </div>
</template>
