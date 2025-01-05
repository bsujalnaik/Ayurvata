document.addEventListener('DOMContentLoaded', () => {
    // Fuzzy Search Utility Function
    function fuzzyMatch(searchTerm, targetString, threshold = 0.6) {
        searchTerm = searchTerm.toLowerCase();
        targetString = targetString.toLowerCase();

        // If exact match
        if (searchTerm === targetString) return 1.0;

        // If includes
        if (targetString.includes(searchTerm)) return 0.8;

        // Levenshtein Distance Algorithm
        function levenshteinDistance(a, b) {
            const matrix = [];
            for (let i = 0; i <= b.length; i++) matrix[i] = [i];
            for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        }

        const distance = levenshteinDistance(searchTerm, targetString);
        const maxLength = Math.max(searchTerm.length, targetString.length);
        return 1 - distance / maxLength;
    }

    // Plant Data
    const plants = [
        {
            id: 1,
            name: "Tulsi",
            scientificName: "Ocimum sanctum",
            description: "Sacred herb known for stress relief and immune support.",
            uses: ["Stress relief", "Immunity", "Respiratory health"],
            treatedDiseases: ["Common Cold", "Fever", "Stress", "Respiratory Infections"],
            keywords: ["adaptogen", "immunity", "holy basil"],
            modelUrl: "tulsi.glb"
        },
        {
            id: 2,
            name: "Ashwagandha",
            scientificName: "Withania somnifera",
            description: "Powerful adaptogen for stress management and energy.",
            uses: ["Stress reduction", "Energy boost", "Cognitive function"],
            treatedDiseases: ["Anxiety", "Stress", "Fatigue", "Insomnia"],
            keywords: ["adaptogen", "energy", "stress relief"],
            modelUrl: "ashwagandha.glb"
        },
        {
            id: 3,
            name: "Neem",
            scientificName: "Azadirachta indica",
            description: "Medicinal plant for skin and dental health.",
            uses: ["Skin care", "Dental hygiene", "Purification"],
            treatedDiseases: ["Skin Infections", "Dental Problems", "Fungal Infections"],
            keywords: ["skin health", "purification", "antibacterial"],
            modelUrl: "neem.glb"
        }
    ];

    class AyurvedicPlantExplorer {
        constructor() {
            this.initializeElements();
            this.bindEvents();
            this.renderInitialGrid();
        }

        initializeElements() {
            const mobileSearchContainer = document.getElementById('mobileSearchContainer');
            this.searchInput = document.getElementById('searchInput');
            this.mobileSearchToggle = document.getElementById('mobileSearchToggle');
            this.mobilePlantSearch = document.getElementById('mobilePlantSearch');
            this.mobileSearchContainer = document.getElementById('mobileSearchContainer');
            this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
            this.closeMenu = document.getElementById('closeMenu');
            this.mobileMenu = document.getElementById('mobileMenu');
            this.plantGrid = document.getElementById('plantGrid');
        }

        bindEvents() {
            // Desktop Search
            if (this.searchInput) {
                this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            }

            // Mobile Search
            if (this.mobileSearchToggle && this.mobileSearchContainer) {
                this.mobileSearchToggle.addEventListener('click', () => {
                    this.mobileSearchContainer.classList.toggle('hidden');
                    if (!this.mobileSearchContainer.classList.contains('hidden')) {
                        this.mobilePlantSearch.focus();
                    }
                });

                this.mobilePlantSearch.addEventListener('input', (e) => this.handleSearch(e.target.value));
            }

            // Mobile Menu Toggle
            if (this.mobileMenuToggle && this.mobileMenu) {
                this.mobileMenuToggle.addEventListener('click', () => {
                    this.mobileMenu.classList.remove('hidden');
                });

                this.closeMenu.addEventListener('click', () => {
                    this.mobileMenu.classList.add('hidden');
                });
            }
        }

        handleSearch(searchTerm) {
            const results = this.performFuzzySearch(searchTerm);
            this.renderPlantGrid(results);
        }

        performFuzzySearch(searchTerm) {
            if (!searchTerm.trim()) return plants;

            return plants.filter(plant => {
                const fields = [
                    plant.name,
                    plant.scientificName,
                    ...plant.treatedDiseases,
                    ...plant.uses,
                    ...plant.keywords
                ];
                return fields.some(field => fuzzyMatch(searchTerm, field) >= 0.6);
            });
        }

        renderPlantGrid(filteredPlants) {
            if (!this.plantGrid) return;

            this.plantGrid.innerHTML = filteredPlants.length
                ? filteredPlants.map(plant => `
                    <div class="plant-card bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition">
                        <img src="${plant.modelUrl}" alt="${plant.name}" class="w-full h-48 object-cover rounded-lg" />
                        <h3 class="mt-3 text-lg font-semibold text-green-800">${plant.name}</h3>
                        <p class="text-sm text-gray-600 mt-1">${plant.description}</p>
                    </div>
                `).join('')
                : '<p class="text-gray-500 text-center">No matching plants found.</p>';
        }

        renderInitialGrid() {
            this.renderPlantGrid(plants);
        }
    }

    // Initialize the AyurvedicPlantExplorer
    new AyurvedicPlantExplorer();
});
document.addEventListener('DOMContentLoaded', function() {
  // Toggle search bar visibility when search icon is clicked
  const searchIcon = document.querySelector('.search-icon');
  const searchBar = document.querySelector('.search-bar');

  searchIcon.addEventListener('click', function() {
    searchBar.classList.toggle('show');
  });
});