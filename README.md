# Bacterial Growth Simulator: Exploring the Four Phases of the Bacterial Growth Curve

An interactive virtual microbiology laboratory simulator designed for undergraduate coursework (**BTY323 Microbiology - Continuous Assessment**). Explore how closed-batch bacterial cultures adapt, exponentially proliferate, reach carrying-capacity equilibrium, and decline.

---

## 🔬 Key Features

- **Interactive Growth Curve (SVG)**: Semi-logarithmic plot ($\log_{10} \text{CFU/mL}$ vs. time in hours) with distinct color-coded zones for all four phases, live animation, and direct scrub/seek controls.
- **Synchronized 1000× Oil Immersion Microscopy**: Real-time visual depiction of bacterial cells (*Bacillus* / *E. coli* morphology) exhibiting cellular enlargement, binary fission, stationary crowding, and autolysis / cell ghost formation.
- **Culture Flask Turbidity**: Visualizes the difference between viable count (CFU/mL) and optical density ($\text{OD}_{600}$).
- **Detailed Biological & Molecular Guide**: Thorough coverage of biochemical adaptations, RNA/protein synthesis, sigma factors ($RpoS$), secondary metabolism, and exam viva points.
- **Bacterial Generation Time Solver**: Compute generations ($n$), doubling time ($g = t/n$), and specific growth rate ($\mu$) with built-in presets for *E. coli*, *S. aureus*, *B. subtilis*, and *M. tuberculosis*.
- **Environmental Kinetics Modeling**: Alter cultivation variables (Temperature: 4°C to 50°C, Nutrients: Monod kinetics, pH: 3.0 to 10.0, and Oxygen regime) to observe mathematical shifts in real time.
- **Comparative Scenario Overlays**: Compare reference control growth against low nutrient broth, cold shock (22°C), acid stress (pH 5.2), and aged inoculum.
- **Interactive Quiz & Challenges**: 10 syllabus-aligned multiple-choice questions with deep explanations, plus the "Predict the Next Phase" decision cut-off scenario.
- **Continuous Assessment Report**: In-app student details modal and printable CA submission sheet.

---

## 📈 The Four Growth Phases

1. **Lag Phase ($0 - 2.5\text{ h}$)**: Adaptation, enzyme induction, RNA & ATP synthesis, and cell enlargement without cell division ($\mu \approx 0$).
2. **Log / Exponential Phase ($2.5 - 9.5\text{ h}$)**: Balanced growth, maximal binary fission rate ($N_t = N_0 \cdot 2^n$), high sensitivity to cell-wall antibiotics.
3. **Stationary Phase ($9.5 - 17.5\text{ h}$)**: Division rate equals death rate ($dN/dt = 0$), activated stress regulons ($RpoS$), secondary metabolite / antibiotic synthesis, sporulation.
4. **Death / Decline Phase ($17.5 - 24.0\text{ h}$)**: Exponential population loss ($N_t = N_{stat} \cdot e^{-k_d \cdot t}$), autolysis, membrane depolarization, while intact dead ghosts keep $\text{OD}_{600}$ relatively elevated.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/khushi-singh-30/bacterial-growth-simulator.git
   cd bacterial-growth-simulator
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Build Tool**: Vite
- **Mathematical Modeling**: Custom Gompertz / Monod / Arrhenius kinetics solver

---

## 📜 License
Apache-2.0
