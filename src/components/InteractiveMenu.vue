<script setup lang="ts">
import { ref, computed } from 'vue';

interface MenuItem {
  slug: string;
  body: string;
  data: {
    order?: number;
    name: string;
    name_en?: string;
    description_en?: string;
    price: string;
    category: 'breakfast' | 'lunch' | 'dinner' | 'drinks';
    subcategory?: string;
    allergens?: string[];
    image?: any;
    featured: boolean;
    lang: 'sk' | 'en';
  };
}

const props = defineProps<{
  items: any[];
  initialLang?: 'sk' | 'en';
}>();

const activeCategory = ref('lunch');
const searchQuery = ref('');
const activeFilters = ref<string[]>([]);
const selectedItem = ref<MenuItem | null>(null);

const categories = computed(() => [
  { label: uiLabels.value.categories.breakfast, value: 'breakfast' },
  { label: uiLabels.value.categories.lunch, value: 'lunch' },
  { label: uiLabels.value.categories.dinner, value: 'dinner' },
  { label: uiLabels.value.categories.drinks, value: 'drinks' },
]);

const subcategoryOrder: Record<string, string[]> = {
  breakfast: ['savoury', 'sweet', 'drinks', 'other'],
  lunch: ['soup', 'appetizer', 'main', 'salad', 'sides', 'dessert'],
  dinner: ['appetizer', 'soup', 'main', 'salad', 'sides', 'dessert'],
  drinks: ['coffee', 'non-alcoholic', 'alcoholic'],
};

const subcategoryLabels: Record<string, string> = {
  appetizer: 'Predjedlá',
  soup: 'Polievky',
  main: 'Hlavné Jedlá',
  dessert: 'Dezerty',
  alcoholic: 'Alkoholické Nápoje',
  'non-alcoholic': 'Nealkoholické Nápoje',
  coffee: 'Kávy',
  salad: 'Šaláty',
  sweet: 'Sladké',
  savoury: 'Slané',
  sides: 'Prílohy',
  other: 'Ostatné',
};

const allergenFilters = [
  { label: 'Vegan', value: 'vegan', type: 'required' },
  { label: 'Bez lepku', value: 'gluten', type: 'excluded' },
  { label: 'Vegetarian', value: 'vegetarian', type: 'required' },
  { label: 'Bez laktózy', value: 'dairy', type: 'excluded' },
];

const toggleFilter = (filter: string) => {
  if (activeFilters.value.includes(filter)) {
    activeFilters.value = activeFilters.value.filter(f => f !== filter);
  } else {
    activeFilters.value.push(filter);
  }
};

const openModal = (item: MenuItem) => {
  selectedItem.value = item;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedItem.value = null;
  document.body.style.overflow = '';
};

const currentLang = ref<'sk' | 'en'>(props.initialLang || 'sk');

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'sk' ? 'en' : 'sk';
};

// Helper to get localized string
const getLocContent = (item: MenuItem, field: 'name' | 'body') => {
  if (currentLang.value === 'en') {
    if (field === 'name') return item.data.name_en || item.data.name;
    if (field === 'body') return item.data.description_en || item.body;
  }
  return field === 'name' ? item.data.name : item.body;
};

// Localized UI labels
const uiLabels = computed(() => {
  const isEn = currentLang.value === 'en';
  return {
    searchPlaceholder: isEn ? 'Search food...' : 'Hľadať jedlo...',
    noItems: isEn ? 'No items found in this category.' : 'V tejto kategórii momentálne nemáme žiadne položky.',
    noImage: isEn ? 'No Image' : 'Bez Obrázku',
    allergensTags: isEn ? 'Allergens & Tags' : 'Alergény & Tagy',
    featured: isEn ? 'Chef\'s Choice' : 'Tip Šéfkuchára',
    categories: isEn ? {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      drinks: 'Drinks'
    } : {
      breakfast: 'Raňajky',
      lunch: 'Obed',
      dinner: 'Večera',
      drinks: 'Nápoje'
    },
    subcategories: isEn ? {
      appetizer: 'Appetizers',
      soup: 'Soups',
      main: 'Main Courses',
      dessert: 'Desserts',
      alcoholic: 'Alcoholic',
      'non-alcoholic': 'Non-alcoholic',
      coffee: 'Coffee',
      salad: 'Salads',
      sweet: 'Sweet',
      savoury: 'Savoury',
      sides: 'Sides',
      other: 'Other'
    } : subcategoryLabels // distinct object for SK to keep original mapping
  };
});

const filteredItems = computed(() => {
  return props.items.filter(item => {
    // Category match
    if (item.data.category !== activeCategory.value) return false;

    // Search match
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const description = getLocContent(item, 'body').toLowerCase();
      const name = getLocContent(item, 'name').toLowerCase();
      
      if (!name.includes(query) && !description.includes(query)) {
        return false;
      }
    }

    // Filter match
    if (activeFilters.value.length > 0) {
        const itemAllergens = item.data.allergens || [];
        
        const passesFilters = activeFilters.value.every(filterValue => {
            const filterDef = allergenFilters.find(f => f.value === filterValue);
            if (!filterDef) return true; // Should not happen

            if (filterDef.type === 'excluded') {
                // If excluded (e.g. Gluten Free), item must NOT have the allergen (gluten)
                return !itemAllergens.includes(filterValue);
            } else {
                // If required (e.g. Vegan), item MUST have the tag (vegan)
                return itemAllergens.includes(filterValue);
            }
        });

        if (!passesFilters) return false;
    }

    return true;
  });
});

const groupedItems = computed(() => {
  const groups: Record<string, MenuItem[]> = {};
  const currentOrder = subcategoryOrder[activeCategory.value] || [];

  // Initialize groups based on order
  currentOrder.forEach(sub => {
    groups[sub] = [];
  });
  // Add 'other' fallback
  if (!groups['other']) groups['other'] = [];

  filteredItems.value.forEach(item => {
    const sub = item.data.subcategory || 'other';
    if (groups[sub]) {
      groups[sub].push(item);
    } else {
      if (!groups[sub]) groups[sub] = [];
      groups[sub].push(item);
    }
  });

  return Object.entries(groups)
    .filter(([key, list]) => list.length > 0)
    .sort((a, b) => {
      const indexA = currentOrder.indexOf(a[0]);
      const indexB = currentOrder.indexOf(b[0]);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a[0].localeCompare(b[0]);
    })
    .map(([key, list]) => {
      // Sort items within the subcategory
      const sortedList = [...list].sort((a, b) => {
          // Sort by Order first (ascending)
          const orderA = a.data.order ?? 99;
          const orderB = b.data.order ?? 99;
          if (orderA !== orderB) return orderA - orderB;

          // Then by name
          return getLocContent(a, 'name').localeCompare(getLocContent(b, 'name'));
      });

        // Get correct label based on lang
        const labelKey = key as string;
        const title = currentLang.value === 'en' 
            ? (uiLabels.value.subcategories as any)[labelKey] || labelKey 
            : subcategoryLabels[labelKey] || labelKey;
            
        return { title, items: sortedList };
    });
});
</script>

<template>
  <div class="w-full max-w-6xl mx-auto p-6 relative">
    <!-- Language Toggle -->
    <div class="absolute top-0 right-6 md:right-0 z-10 flex gap-2">
      <button 
        @click="currentLang = 'sk'"
        class="px-2 py-1 text-xs font-bold uppercase transition-colors"
        :class="currentLang === 'sk' ? 'text-lunar-gold border-b border-lunar-gold' : 'text-gray-500 hover:text-gray-300'"
      >SK</button>
      <span class="text-gray-700">|</span>
      <button 
        @click="currentLang = 'en'"
        class="px-2 py-1 text-xs font-bold uppercase transition-colors"
        :class="currentLang === 'en' ? 'text-lunar-gold border-b border-lunar-gold' : 'text-gray-500 hover:text-gray-300'"
      >EN</button>
    </div>

    <!-- Category Tabs -->
    <div class="flex justify-start md:justify-center mb-12 space-x-4 overflow-x-auto pb-4 px-4 md:px-0 mt-8 md:mt-0">
      <button 
        v-for="cat in categories" 
        :key="cat.value"
        @click="activeCategory = cat.value"
        class="px-6 py-2 text-lg uppercase tracking-widest transition-all duration-300 border-b-2 whitespace-nowrap"
        :class="activeCategory === cat.value ? 'border-lunar-gold text-lunar-gold' : 'border-transparent text-gray-500 hover:text-lunar-white'"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <!-- Search -->
      <div class="relative w-full md:w-1/3">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="uiLabels.searchPlaceholder" 
          class="w-full bg-lunar-dark border border-gray-800 text-lunar-white px-4 py-2 rounded-none focus:border-lunar-gold focus:outline-none transition-colors"
        />
        <span class="absolute right-3 top-2.5 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 flex-wrap justify-center">
        <button 
          v-for="filter in allergenFilters" 
          :key="filter.value"
          @click="toggleFilter(filter.value)"
          class="px-3 py-1 text-sm border transition-colors duration-300"
          :class="activeFilters.includes(filter.value) ? 'border-lunar-gold text-lunar-gold bg-lunar-gold/10' : 'border-gray-700 text-gray-500 hover:border-gray-500'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Menu Groups -->
    <div v-if="groupedItems.length > 0" class="space-y-16">
      <div v-for="group in groupedItems" :key="group.title">
        <!-- Subcategory Header -->
        <h3 class="text-2xl text-lunar-white font-serif mb-8 border-l-4 border-lunar-gold pl-4">
          {{ group.title }}
        </h3>

        <!-- Items Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          <div 
            v-for="item in group.items" 
            :key="item.slug" 
            class="group flex flex-col sm:flex-row gap-6 items-start cursor-pointer relative"
            @click="openModal(item)"
          >
            <!-- Featured Badge -->
            <div v-if="item.data.featured" class="absolute -top-3 -left-3 z-10 bg-lunar-gold text-lunar-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-lg transform -rotate-2">
              {{ uiLabels.featured }}
            </div>

            <!-- Image -->
            <div 
                class="w-full sm:w-32 h-32 bg-lunar-dark flex-shrink-0 overflow-hidden relative border border-gray-800 transition-all duration-300"
                :class="item.data.featured ? 'border-lunar-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'group-hover:border-lunar-gold/50'"
            >
                <img v-if="item.data.image" :src="typeof item.data.image === 'string' ? item.data.image : item.data.image.src" :alt="getLocContent(item, 'name')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-700">
                    <span class="text-xs uppercase tracking-widest">{{ uiLabels.noImage }}</span>
                </div>
            </div>

            <div class="flex-grow w-full">
              <div class="flex justify-between items-baseline border-b border-gray-800 pb-2 mb-2 relative">
                <h3 class="text-xl font-serif text-lunar-white group-hover:text-lunar-gold transition-colors duration-300" :class="{ 'text-lunar-gold': item.data.featured }">{{ getLocContent(item, 'name') }}</h3>
                <span class="text-lg text-lunar-gold font-light ml-4">{{ item.data.price }}</span>
                <div class="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-lunar-gold transition-all duration-500 group-hover:w-full"></div>
              </div>
              <p class="text-gray-400 text-sm leading-relaxed mb-2 line-clamp-2" :class="{ 'text-gray-300': item.data.featured }">{{ getLocContent(item, 'body') }}</p>
              <div class="flex gap-2">
                <span 
                  v-for="allergen in item.data.allergens" 
                  :key="allergen"
                  class="text-[10px] uppercase tracking-wider text-gray-600 border border-gray-800 px-1.5 py-0.5"
                >
                  {{ allergen }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <p class="text-gray-500 text-lg font-serif italic">{{ uiLabels.noItems }}</p>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition 
        enter-active-class="transition duration-300 ease-out" 
        enter-from-class="opacity-0" 
        enter-to-class="opacity-100" 
        leave-active-class="transition duration-200 ease-in" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0"
      >
        <div v-if="selectedItem" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-lunar-black border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row animate-scale-up">
            <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white z-10 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Modal Image -->
            <div class="w-full md:w-1/2 h-64 md:h-auto relative bg-neutral-900">
               <img 
                 v-if="selectedItem.data.image" 
                 :src="typeof selectedItem.data.image === 'string' ? selectedItem.data.image : selectedItem.data.image.src" 
                 :alt="getLocContent(selectedItem, 'name')" 
                 class="w-full h-full object-cover" 
               />
               <div v-else class="w-full h-full flex items-center justify-center text-gray-600">{{ uiLabels.noImage }}</div>
            </div>

            <!-- Modal Details -->
            <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <span class="text-lunar-gold text-sm uppercase tracking-[0.2em] mb-4">
                {{ currentLang === 'en' && uiLabels.subcategories[selectedItem.data.subcategory || ''] ? uiLabels.subcategories[selectedItem.data.subcategory || ''] : (subcategoryLabels[selectedItem.data.subcategory || ''] || selectedItem.data.category) }}
              </span>
              <h2 class="text-4xl font-serif text-lunar-white mb-2">{{ getLocContent(selectedItem, 'name') }}</h2>
              <div class="text-2xl text-lunar-gold font-light mb-8">{{ selectedItem.data.price }}</div>
              
              <div class="prose prose-invert prose-lg text-gray-300 font-light leading-relaxed mb-8 flex-grow">
                {{ getLocContent(selectedItem, 'body') }}
              </div>

              <!-- Allergens/Tags in Modal -->
              <div v-if="selectedItem.data.allergens && selectedItem.data.allergens.length > 0">
                <h4 class="text-xs uppercase text-gray-500 tracking-widest mb-3">{{ uiLabels.allergensTags }}</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="allergen in selectedItem.data.allergens" 
                    :key="allergen"
                    class="px-3 py-1 border border-lunar-gold/30 text-lunar-gold text-sm"
                  >
                    {{ allergen }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Custom scrollbar for horizontal tabs */
::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 2px;
}

.animate-scale-up {
  animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scale-up {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
