/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Curated scientific data and explanations for Bacterial Growth Simulator
 * Subject: Microbiology (BTY323)
 */

import { PhaseInfo, QuizQuestion, ChallengeScenario } from '../types/microbiology';

export const PHASES_DATA: Record<string, PhaseInfo> = {
  lag: {
    id: 'lag',
    name: 'Lag Phase (Phase of Adjustment)',
    shortName: 'Lag Phase',
    color: '#D97706', // Amber-600
    lightBg: '#FEF3C7',
    borderColor: '#F59E0B',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    timeRange: [0, 2.5],
    biologicalEvents: [
      'Active cellular adaptation to the physical and chemical conditions of the new fresh medium.',
      'Intense biochemical synthesis: transcription of mRNA, synthesis of transfer RNAs, ribosomal RNA, and metabolic coenzymes.',
      'Production of substrate-specific inducible enzymes required to catabolize new carbon/nitrogen sources (e.g., β-galactosidase induction in the presence of lactose).',
      'Cell enlargement and volume increase without nuclear division or cell septation; generation of high internal ATP pools.',
      'Repair of sublethal cellular injuries caused by cold storage, centrifugation, or previous nutrient starvation.'
    ],
    populationKinetics: 'Specific growth rate µ ≈ 0. Net change in cell number dN/dt ≈ 0. The population remains virtually constant at initial inoculum density (N₀). However, cell mass and metabolic activity per cell are at peak preparation levels.',
    environmentalConditions: 'Abundant unutilized nutrients (e.g. glucose, amino acids, phosphate, mineral salts), dissolved oxygen at saturation level, optimal physiological pH (6.8–7.2), absence of toxic metabolic byproducts.',
    realWorldExample: 'Inoculation of a refrigerated slant of Escherichia coli into fresh pre-warmed Luria-Bertani (LB) broth at 37°C requires ~1.5 to 2.5 hours before the first round of binary fission is detected.',
    examPoint: 'Q: Does zero population growth during the lag phase indicate that bacteria are dormant? Ans: NO! The cells are physiologically and metabolically extremely active, synthesizing critical enzymes, RNA, and ATP. Cell size actually increases, but cytokinesis and binary fission have not yet begun.'
  },
  log: {
    id: 'log',
    name: 'Log / Exponential Phase (Balanced Growth)',
    shortName: 'Log Phase',
    color: '#059669', // Emerald-600
    lightBg: '#D1FAE5',
    borderColor: '#10B981',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    timeRange: [2.5, 9.5],
    biologicalEvents: [
      'Cells undergo rapid binary fission at their genetically determined maximal specific growth rate (µ_max) under prevailing conditions.',
      'Symmetric replication of the circular bacterial chromosome starting at oriC, followed by FtsZ ring constriction at the cell mid-plane to form a dividing septum.',
      'Condition of "Balanced Growth": all cellular components (DNA, RNA, proteins, peptidoglycan cell wall, lipids) double at the exact same relative rate.',
      'Cells exhibit the highest biochemical homogeneity and physiological sensitivity; membrane transport is maximally active.',
      'High susceptibility to cell-wall acting bactericidal antibiotics (such as β-lactams/penicillin and cephalosporins) which target actively synthesizing peptidoglycan.'
    ],
    populationKinetics: 'Exponential increase following the mathematical law: N(t) = N₀ · 2ⁿ = N₀ · e^(µ·t). On a semi-logarithmic plot (log₁₀ N vs. time), this phase is represented by a straight line with constant slope = µ / (2.303) = 1 / (g · log₂10).',
    environmentalConditions: 'Nutrient availability is still saturating (S >> K_s), waste product concentrations are low and sub-toxic, oxygen consumption is at its peak, and heat production from catabolic metabolism increases.',
    realWorldExample: 'Escherichia coli growing in nutrient broth at 37°C doubles approximately every 20 minutes; starting from 1,000 cells, the population exceeds 1,000,000 cells in less than 3.5 hours.',
    examPoint: 'Q: Why must the Generation Time (g) be calculated strictly during the Log phase? Ans: Because only in the exponential phase do cells divide at a constant, uninhibited rate where all cells double uniformly in accordance with the formula g = t / n. In other phases, growth rate is variable or zero.'
  },
  stationary: {
    id: 'stationary',
    name: 'Stationary Phase (Equilibrium & Secondary Metabolism)',
    shortName: 'Stationary Phase',
    color: '#2563EB', // Blue-600
    lightBg: '#DBEAFE',
    borderColor: '#3B82F6',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    timeRange: [9.5, 17.5],
    biologicalEvents: [
      'Cell division rate slows down and precisely equals the cell death rate (Rate of Binary Fission = Rate of Autolysis).',
      'Activation of the alternative sigma factor RpoS (σˢ) or master stress regulators, triggering the general stress response regulon.',
      'Morphological alterations: cells become smaller, more spherical (coccoid rods), and reinforce their cell envelope with increased peptidoglycan cross-linking.',
      'Cessation of primary metabolism and initiation of secondary metabolite production, including industrial antibiotics (e.g., streptomycin, penicillin), bacteriocins, and pigments.',
      'Induction of endospore formation (sporulation) in Gram-positive genera like Bacillus and Clostridium as an extreme survival mechanism.'
    ],
    populationKinetics: 'Net population growth rate dN/dt = 0. The viable cell count (CFU/mL) reaches a plateau at the carrying capacity (K) of the closed batch system, typically around 10⁸ to 10⁹ CFU/mL.',
    environmentalConditions: 'Severe depletion of essential limiting nutrients (exhaustion of usable carbon or nitrogen source), critical drop in dissolved oxygen, accumulation of toxic organic acids and metabolites, and falling culture pH.',
    realWorldExample: 'In pharmaceutical bioprocess fermentation of Penicillium or Streptomyces, industrial fermenters are maintained in extended stationary phase (idiophase) to maximize commercial antibiotic yields.',
    examPoint: 'Q: What two main factors trigger the onset of the stationary phase in closed batch cultures? Ans: 1) Exhaustion of essential nutrients (carbon/energy source or terminal electron acceptor) and 2) Accumulation of toxic metabolic waste products (such as lactic acid, ethanol, or hydrogen peroxide).'
  },
  death: {
    id: 'death',
    name: 'Death / Decline Phase (Exponential Population Loss)',
    shortName: 'Death Phase',
    color: '#DC2626', // Red-600
    lightBg: '#FEE2E2',
    borderColor: '#EF4444',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    timeRange: [17.5, 24.0],
    biologicalEvents: [
      'Rate of cell death significantly exceeds any remaining cell replication (Death Rate >> Division Rate).',
      'Exhaustion of endogenous energy reserves (ATP, polyphosphate granules, glycogen), preventing maintenance of membrane proton motive force (PMF).',
      'Activation of intracellular autolysins causing cell wall degradation and osmotic lysis, spilling intracellular contents into the broth.',
      'Accumulation of lethal concentrations of acidic or oxidative byproducts causing irreversible denaturation of essential proteins and DNA fragmentation.',
      'Entry of a sub-population into the "Viable But Non-Culturable" (VBNC) state or persistence of specialized persister cells that survive prolonged adversity.'
    ],
    populationKinetics: 'Viable cell count declines exponentially (first-order decay kinetics): N(t) = N_stat · e^(-k_d · t). However, the death phase slope is typically shallower and more irregular than the rapid log phase slope.',
    environmentalConditions: 'Complete nutrient starvation, toxic accumulation of fermentation end-products, pH shift to extreme unbuffered levels, hyper-accumulation of cell debris and autolysates.',
    realWorldExample: 'Souring and eventual spoilage of unpasteurized milk: lactic acid bacteria ferment lactose into lactic acid until the extreme acidity (pH < 4.5) terminates their own viability.',
    examPoint: 'Q: Why does the optical density (OD₆₀₀ / turbidity) remain high even when the viable plate count (CFU/mL) drops drastically in the death phase? Ans: Optical density measures light scattering by ALL intact particles in suspension, including non-viable dead cell bodies and empty cell ghosts. Viable count (CFU) enumerates ONLY living cells capable of colony formation.'
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'During which phase of the bacterial growth curve is the population undergoing "balanced growth" with constant generation time?',
    options: [
      'Lag phase',
      'Log (Exponential) phase',
      'Stationary phase',
      'Death (Decline) phase'
    ],
    correctIndex: 1,
    subtopic: 'Growth Phases & Kinetics',
    explanation: 'During the log (exponential) phase, cells divide at a constant maximal rate via binary fission. Balanced growth implies that all cellular constituents (DNA, RNA, proteins, cell wall) double at the exact same rate relative to one another.'
  },
  {
    id: 2,
    question: 'A culture begins with an initial inoculum of 1,000 cells (N₀ = 10³). If the bacteria undergo 4 complete generations, what is the final population (Nₜ)?',
    options: [
      '4,000 cells',
      '8,000 cells',
      '16,000 cells',
      '32,000 cells'
    ],
    correctIndex: 2,
    subtopic: 'Mathematical Modeling',
    explanation: 'Using the fundamental exponential growth formula Nₜ = N₀ × 2ⁿ: here n = 4, so Nₜ = 1,000 × 2⁴ = 1,000 × 16 = 16,000 cells.'
  },
  {
    id: 3,
    question: 'Why does the viable cell count (CFU/mL) decline in the death phase while optical density (OD₆₀₀) may remain relatively elevated?',
    options: [
      'Spectrophotometers cannot measure bacteria in liquid medium',
      'Intact dead cell corpses and cell wall ghosts continue to scatter light',
      'Dead cells multiply faster in the spectrophotometer cuvette',
      'The dye used in optical density selectively stains living bacteria'
    ],
    correctIndex: 1,
    subtopic: 'Analytical Techniques (CFU vs OD)',
    explanation: 'Spectrophotometric turbidity (OD₆₀₀) measures total light scattering caused by all particles in the suspension, both living and dead intact cells. In contrast, colony forming unit (CFU) plating only counts viable cells that retain metabolic capacity to divide and form a colony.'
  },
  {
    id: 4,
    question: 'Which of the following occurs biochemically during the LAG phase?',
    options: [
      'Rapid exponential division by binary fission',
      'Total metabolic dormancy with zero transcription or translation',
      'Intense synthesis of RNA, inducible enzymes, and cellular enlargement',
      'Massive cell lysis due to autolysin activation'
    ],
    correctIndex: 2,
    subtopic: 'Lag Phase Physiology',
    explanation: 'Although population numbers do not increase in the lag phase, bacteria are in a state of high metabolic activity: cells synthesize inducible enzymes, ribosomes, transfer RNAs, and ATP required to adapt to the new medium before initiating division.'
  },
  {
    id: 5,
    question: 'What is the standard formula used to calculate the number of generations (n) from initial (N₀) and final (Nₜ) populations?',
    options: [
      'n = (log₁₀ Nₜ - log₁₀ N₀) / log₁₀ 2',
      'n = (Nₜ - N₀) / 2',
      'n = log₁₀(Nₜ × N₀) / 0.301',
      'n = (log₁₀ N₀ - log₁₀ Nₜ) × 2'
    ],
    correctIndex: 0,
    subtopic: 'Generation Time Mathematics',
    explanation: 'Since Nₜ = N₀ × 2ⁿ, taking log₁₀ on both sides yields: log₁₀(Nₜ) = log₁₀(N₀) + n · log₁₀(2). Rearranging gives: n = (log₁₀ Nₜ - log₁₀ N₀) / log₁₀(2), where log₁₀(2) ≈ 0.30103.'
  },
  {
    id: 6,
    question: 'Why are cells in the exponential (log) phase most susceptible to β-lactam antibiotics like penicillin?',
    options: [
      'Penicillin only penetrates cells that have entered endospores',
      'Penicillin targets actively synthesizing peptidoglycan cross-links during cell wall synthesis',
      'In the log phase, cells degrade their own outer membrane',
      'Penicillin binds to ribosomal RNA which is only present in log phase'
    ],
    correctIndex: 1,
    subtopic: 'Antibiotic Sensitivity & Physiology',
    explanation: 'Penicillin and cephalosporins inhibit transpeptidase enzymes that cross-link newly synthesized peptidoglycan chains. This lethal inhibition requires active cell wall synthesis and cell elongation, which occurs predominantly during the log phase.'
  },
  {
    id: 7,
    question: 'In industrial biotechnology, why is the stationary phase (idiophase) often prolonged in secondary metabolite fermentations (e.g., penicillin)?',
    options: [
      'Primary enzymes are only functional in pure water',
      'Secondary metabolites such as antibiotics are synthesized as survival weapons under nutrient stress',
      'Bacteria divide fastest during the stationary phase',
      'Nutrients are highest in the stationary phase'
    ],
    correctIndex: 1,
    subtopic: 'Industrial Applications',
    explanation: 'Microorganisms synthesize secondary metabolites (idiolites) such as antibiotics, pigments, and toxins primarily during the stationary phase (idiophase) in response to nutrient depletion and high cell density, regulated by quorum sensing and stress sigma factors.'
  },
  {
    id: 8,
    question: 'If a culture of E. coli increases from 2.0 × 10⁴ CFU/mL to 3.2 × 10⁵ CFU/mL in 80 minutes, what is its generation time (g)?',
    options: [
      '10 minutes',
      '20 minutes',
      '40 minutes',
      '80 minutes'
    ],
    correctIndex: 1,
    subtopic: 'Calculations & Problem Solving',
    explanation: 'Ratio Nₜ / N₀ = (3.2 × 10⁵) / (2.0 × 10⁴) = 16. Since 2ⁿ = 16, n = 4 generations. Generation time g = t / n = 80 minutes / 4 generations = 20 minutes per generation.'
  },
  {
    id: 9,
    question: 'What is the primary physiological master regulator activated during the transition from log to stationary phase in Escherichia coli?',
    options: [
      'DNA polymerase III',
      'RpoS (sigma factor 38 / σˢ)',
      'Reverse transcriptase',
      'Lactose repressor (LacI)'
    ],
    correctIndex: 1,
    subtopic: 'Molecular Microbiology',
    explanation: 'RpoS (σ³⁸) is the master stationary phase and general stress response sigma factor in E. coli. It reprograms RNA polymerase to transcribe over 500 genes that enhance resistance to osmotic stress, oxidative stress, starvation, and acid shock.'
  },
  {
    id: 10,
    question: 'What causes the "diauxic growth" phenomenon when a bacterium is cultured in a medium containing two distinct sugars (e.g., Glucose + Lactose)?',
    options: [
      'Bacterial death followed by spontaneous generation of new species',
      'Preferential utilization of the preferred sugar (glucose) via catabolite repression, followed by a second lag phase to induce lactose enzymes',
      'Immediate equal catabolism of both sugars simultaneously',
      'Mutation of the entire population into auxotrophic mutants'
    ],
    correctIndex: 1,
    subtopic: 'Diauxic Kinetics',
    explanation: 'In diauxie, catabolite repression ensures glucose is metabolized first. Once glucose is exhausted, a second brief lag phase occurs during which cyclic AMP (cAMP) levels rise, the CRP-cAMP complex binds, and lac operon enzymes are synthesized to utilize lactose.'
  }
];

export const CHALLENGE_SCENARIOS: ChallengeScenario[] = [
  {
    id: 1,
    title: 'Laboratory Inoculum Transfer',
    context: 'A laboratory technician inoculated 5 mL of an E. coli culture stored at 4°C overnight into 100 mL of fresh LB broth pre-incubated at 37°C. For the past 90 minutes, OD₆₀₀ has remained flat at 0.05, but spectrophotometric assays reveal a 5-fold rise in total intracellular ribosomal RNA.',
    partialTimeCutoff: 2.0,
    currentPhase: 'lag',
    correctNextPhase: 'log',
    clues: [
      'Cells have completed cold-shock recovery and transcriptional retooling.',
      'Enzyme and RNA machinery are now fully assembled.',
      'Nutrients are plentiful and unconsumed.'
    ],
    explanation: 'The culture is completing the Lag Phase (adaptation and metabolic preparation). With RNA machinery ready and abundant nutrients in the pre-warmed broth, the bacteria are poised to initiate rapid exponential binary fission in the Log Phase!'
  },
  {
    id: 2,
    title: 'The Rapid Bioreactor Run',
    context: 'In an undergraduate bioreactor batch experiment, Bacillus subtilis has been doubling every 25 minutes for the last 6 hours. Recent sensor readings show dissolved oxygen plummeting to 8%, glucose dropping from 10 g/L down to 0.2 g/L, and organic acid accumulation causing the pH to drop.',
    partialTimeCutoff: 9.0,
    currentPhase: 'log',
    correctNextPhase: 'stationary',
    clues: [
      'Limiting substrate (glucose) is almost completely exhausted.',
      'High cell density has led to oxygen limitation and waste buildup.',
      'Specific growth rate is beginning to decelerate.'
    ],
    explanation: 'The culture is nearing the end of the Log Phase. Because the carbon source is almost depleted and toxic acidic waste has accumulated, division rate will balance death rate, bringing the culture into the Stationary Phase.'
  },
  {
    id: 3,
    title: 'Extended Benchtop Incubation',
    context: 'A closed flask of Pseudomonas aeruginosa has remained in a shaking incubator at 37°C for 36 hours. The viable colony count has stayed steady at 2.4 × 10⁸ CFU/mL for over 12 hours. Microscopic examination now shows significant cellular debris, empty peptidoglycan envelopes, and release of intracellular proteases.',
    partialTimeCutoff: 17.0,
    currentPhase: 'stationary',
    correctNextPhase: 'death',
    clues: [
      'Nutrients have been completely exhausted for hours.',
      'Endogenous energy reserves (glycogen, ATP) are depleted.',
      'Autolysins are triggering cell wall breakage.'
    ],
    explanation: 'The culture has spent its maximum time in the Stationary Phase. With energy reserves spent and toxic autolytic enzymes released, viable cells will inevitably undergo exponential decline in the Death (Decline) Phase.'
  },
  {
    id: 4,
    title: 'Subculturing Mid-Log Phase Cells',
    context: 'A student transfers actively dividing cells from the exact midpoint of their exponential log phase into an identical volume of identical, fresh, pre-warmed medium at 37°C.',
    partialTimeCutoff: 1.0,
    currentPhase: 'lag',
    correctNextPhase: 'log',
    clues: [
      'Cells already possess all necessary enzymes in active configurations.',
      'No temperature shock or medium adaptation is required.',
      'Lag phase duration under these ideal conditions is practically zero.'
    ],
    explanation: 'Because the inoculum was harvested in mid-log phase and transferred into identical pre-warmed medium, the bacteria do not require physiological adaptation. The lag phase is bypassed or negligible, and cells continue exponential division in the Log Phase immediately!'
  }
];

export const BACTERIAL_PRESETS = [
  {
    name: 'Escherichia coli (Gut Bacterium / Model Organism)',
    doublingTimeMinutes: 20,
    doublingTimeHours: 0.333,
    optimalTemp: 37,
    description: 'Rapidly dividing Gram-negative rod in nutrient-rich broth'
  },
  {
    name: 'Staphylococcus aureus (Skin Commensal / Pathogen)',
    doublingTimeMinutes: 30,
    doublingTimeHours: 0.5,
    optimalTemp: 37,
    description: 'Gram-positive coccus with moderate division rate'
  },
  {
    name: 'Bacillus subtilis (Soil Bacterium / Spore-former)',
    doublingTimeMinutes: 26,
    doublingTimeHours: 0.433,
    optimalTemp: 30,
    description: 'Gram-positive rod known for endospore differentiation'
  },
  {
    name: 'Mycobacterium tuberculosis (Slow Grower / Pathogen)',
    doublingTimeMinutes: 1080, // 18 hours
    doublingTimeHours: 18.0,
    optimalTemp: 37,
    description: 'Mycolic acid-rich cell wall causes very slow nutrient transport and long generation time'
  }
];
