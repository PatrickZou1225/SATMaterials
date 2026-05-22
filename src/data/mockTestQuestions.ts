// ============================================================
// 模拟测试题库
// SAT 机考：
//   阅读与文法 — Module 1（27题/32分钟）+ Module 2（27题/32分钟）
//   数学 — Module 1（22题/35分钟）+ Module 2（22题/35分钟）
//
// 添加新套题：在 allMockTests 数组里追加一个对象即可
// ============================================================

export interface MockTestQuestion {
  id: number
  passage: string
  question: string
  options: string[]
  answer: number // 0-indexed (A=0, B=1, C=2, D=3)
  image?: string // 可选：图表/表格图片 URL（放在 public/ 目录下）
}

export interface MockTestModule {
  name: string
  subject: '阅读与文法' | '数学'
  timeMinutes: number
  questions: MockTestQuestion[]
}

export interface MockTestSet {
  id: string
  title: string
  modules: MockTestModule[]
}

// ──────────────────────────────────────────────
//  2505AS 第一套 — 阅读与文法 Module 2（27题）
// ──────────────────────────────────────────────
const q_2505as1_m2: MockTestQuestion[] = [
  {
    id: 1,
    passage: `The geographic distribution of animal characters in traditional stories typically ______ current distributions of corresponding species, likely because such stories often serve to transmit information cautioning about local wildlife. Folktales from the British Isles featuring bears are an apparent exception, persisting as culturally significant long after wild bears had gone extinct there.`,
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["aligns with", "acquiesces to", "digresses from", "compensates for"],
    answer: 0 // A
  },
  {
    id: 2,
    passage: `In an analysis of over 50,000 records of pollinators visiting flowers, botanists determined that flowers with bilateral symmetry (zygomorphs) are visited by a smaller subset of pollinators than the subset that visits flowers with radial symmetry (actinomorphs), thus ______ anecdotal observations that zygomorphic flowers exclude many potential pollinators.`,
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["supplanting", "allocating", "substantiating", "transposing"],
    answer: 2 // C
  },
  {
    id: 3,
    passage: `Artists affiliated with the Judson Dance Theater in the 1960s were dancers (including Sally Gross) and creators from other fields (such as painter Alex Hay) interested in redefining the concept of dance. Rejecting formal techniques, the group ______ everyday movements: many pieces were built around ordinary actions, like walking.`,
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["amended", "repudiated", "foregrounded", "contrived"],
    answer: 2 // C
  },
  {
    id: 4,
    passage: `Quantitative analysis of vast historical data sets and other tools of abstraction allow historians to examine broad phenomena, but such methods ______ the particularity of individual actors. By focusing on singular individuals and incidents in exhaustive detail, Emmanuel Le Roy Ladurie's Montaillou and other microhistories aim to show how broader phenomena were experienced at a human level.`,
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["preempt", "efface", "misconstrue", "accentuate"],
    answer: 1 // B
  },
  {
    id: 5,
    passage: `Scientists monitor carbon cycles by tracking gross primary productivity (GPP)—the rate of carbon dioxide absorption by plants—through carbon flux data obtained on-site from flux towers. But as flux towers aren't evenly distributed globally, alternate proxies for GPP obtained remotely from satellite sensors, including solar-induced chlorophyll fluorescence (SIF) emitted by plants during photosynthesis, are being investigated. The GPP-SIF relationship, which is mediated by light availability and other factors, isn't completely understood, but studies suggest that SIF typically correlates well with flux-tower data.`,
    question: "Which choice best states the main purpose of the text?",
    options: [
      "To discuss a method for indirectly measuring GPP with remote-sensor technology that may compensate for a limitation associated with a standard method",
      "To explain why light availability and other factors influencing the relationship between GPP and SIF may compromise the reliability of GPP data obtained from flux towers",
      "To identify the systemic errors associated with flux-tower estimates of GPP that prompted scientists to investigate alternate methods for gathering carbon flux data",
      "To evaluate the potential of two types of scientific instruments typically used for tracking GPP to also reliably measure SIF"
    ],
    answer: 0 // A
  },
  {
    id: 6,
    passage: `The following text is from Rohinton Mistry's 2002 novel Family Matters.

A splash of light from the late-afternoon sun lingered at the foot of Nariman's bed as he ended his nap and looked towards the clock. <mark>It was almost six.</mark> He glanced down where the warm patch had lured his toes. Knurled and twisted, rendered birdlike by age, they luxuriated in the sun's comfort. His eyes fell shut again.`,
    question: "Which choice best describes the function of the underlined sentence in the text as a whole?",
    options: [
      "It shows that Nariman is joyful.",
      "It describes the warm patch.",
      "It states what time it is.",
      "It explains why Nariman likes his bedroom."
    ],
    answer: 2 // C — "It was almost six." states the time
  },
  {
    id: 7,
    passage: `From the Adélie penguin to the pygmy blue whale, a wide range of semiaquatic species have been found to share a common approach for saving energy when traveling long distances. To minimize both wave drag at the surface and the vertical distance to reach the surface to breathe, these air-breathing marine animals swim at depths around three times their body diameter. This finding has important implications for animal conservation efforts. For example, considering typical swim depths could help decrease accidental captures in fishing gear.`,
    question: "Which choice best states the main purpose of the text?",
    options: [
      "To present a finding about the behavior of certain species that may help conservationists protect those species",
      "To identify a shared trait across several species that makes the conservation of those species particularly challenging",
      "To describe a general trend in the swim depths of certain species that explains why those species are more efficient swimmers than are other semiaquatic species",
      "To summarize a theory that accounts for why most air-breathing marine animals swim at the same depth regardless of their size"
    ],
    answer: 0 // A
  },
  {
    id: 8,
    passage: `Wole Soyinka's prose poem "Chimes of Silence" challenges the notion that prose poetry—a hybrid form that blends prose formatting with metaphors and other traditional poetic devices—ought to be contained within a single page. Mary Oliver is among the many scholars and poets who claim that prose poems shouldn't exceed one page, while others argue for greater expansiveness, embracing multipage works. This divide is reflected in anthologies: a large majority of prose poems in such collections are under half a page, though The Penguin Book of the Prose Poem (2018) includes a high proportion of longer works.`,
    question: "Which choice best states the main idea of the text?",
    options: [
      "The editorial choices of a 2018 anthology are a reflection of the widening acceptance of longer prose poetry.",
      "Some scholars and poets have criticized Soyinka's poem \"Chimes of Silence\" for exceeding the generally accepted length for prose poems.",
      "As seen in a work by Soyinka and in the greatly differing approaches taken in anthologies, prose poems vary widely in length.",
      "The ideal length for prose poems remains a contested subject among scholars and practitioners of the form."
    ],
    answer: 2 // C
  },
  {
    id: 9,
    passage: `Stratus clouds form low in the atmosphere. These clouds often cover a large part of the sky in a smooth gray layer. Their name comes from the Latin word stratus, which means "spread out." Stratus clouds form when a large mass of air cools and the water vapor in the cloud condenses into tiny water droplets. This is why these clouds often bring light rain. On overcast days when the sun can't be seen, stratus clouds are likely overhead.`,
    question: "What is the main topic of the text?",
    options: [
      "Different types of clouds in the atmosphere",
      "Characteristics of stratus clouds",
      "The Latin origins of weather terms",
      "How weather forecasters predict rainfall"
    ],
    answer: 1 // B
  },
  {
    id: 10,
    passage: `Mollusk shells are mainly composed of calcium carbonate, a chemical compound used in mortar and other construction materials. A research team led by Ariane da Silva Cardoso investigated pulverizing discarded mollusk shells and adding the resulting powder, known as shell sand aggregate (SSA), to mortar mixtures. The team created a control mixture of mortar (0% SSA) as well as three other mixtures of 10%, 20%, and 40% SSA, then measured the compressive strength of each mixture after 7 days and after 28 days. The team recommends using 10% SSA, as mortars with a higher proportion of SSA are known to have drawbacks.`,
    question: "Which choice most effectively uses data from the graph to support the researchers' recommendation?",
    options: [
      "The compressive strength of the 10% SSA mixture never surpassed the compressive strength measured for the control mixture on day 28.",
      "The 10% SSA mixture's compressive strength was greater than or approximately equal to that of the control mixture on day 7 and on day 28, but on both days the 20% and 40% SSA mixtures had less compressive strength than the control mixture did.",
      "The compressive strength of the 10% SSA mixture remained nearly the same from day 7 to day 28, while that of the 20% and 40% SSA mixtures changed substantially.",
      "The 10% SSA mixture's compressive strength was greater than that of the control mixture on day 7, but by day 28 the 10% SSA mixture's compressive strength had decreased while that of the control mixture had increased."
    ],
    answer: 1, // B
    image: '/202605AS-第一套-Q10.png'
  },
  {
    id: 11,
    passage: `Just like household dust on Earth, dust on the International Space Station (ISS) harbors hundreds of common microorganisms—Aspergillus hongkongensis and other fungi, along with bacteria, such as Staphylococcus pettenkoferi. Researchers grew ISS dust samples in three different relative humidity (RH) conditions: 85% RH for 18 hours/day, 100% RH for 12 hours/day, and 100% RH for 24 hours/day. Over the course of the experiment, researchers measured the growth rate and assessed the abundance of surviving microorganisms.`,
    question: "Taken together, information in the text and table best support which statement about the ISS dust samples following the conclusion of the experiment?",
    options: [
      "The sample at 85% RH for 18 hours/day contained a lower proportion of S. pettenkoferi than the sample at 100% RH for 24 hours/day did.",
      "The sample at 100% RH for 24 hours/day contained the highest proportion of fungi among the three samples.",
      "The sample at 85% RH for 18 hours/day contained a lower proportion of A. hongkongensis than the sample at 100% RH for 24 hours/day did.",
      "The sample at 100% RH for 24 hours/day contained a higher proportion of fungi than bacteria."
    ],
    answer: 3, // D
    image: '/202605AS-第一套-Q11.png'
  },
  {
    id: 12,
    passage: `Predating the European colonization of Peru, the Chiribaya dog vanished due to interbreeding with dogs brought from Europe. In contrast, the Inuit dog persists as a distinct breed, and DNA testing confirms its descent from precolonial North American dogs. It also has genetic markers found in the dogs of East Asia but absent in those of Europe. That finding supports the theory that the precolonial breeds developed by Indigenous peoples descend from dogs that migrated from Asia in the last ice age. <mark>The Carolina dog, a yellow-coated breed native to rural pockets of the Southeastern United States, likely has such an origin too.</mark>`,
    question: "Which finding, if true, would most directly support the underlined claim?",
    options: [
      "The Carolina dog carries a genetic marker that is not found in the dog populations of Europe but is present in the dog populations of East Asia.",
      "Identical genetic markers are identified in remains of both the Chiribaya dog and a dog population it interbred with.",
      "Additional DNA testing confirms that the Inuit dog and the Carolina dog share a rare set of genes not found in any East Asian breeds.",
      "Dogs in feral populations in the Southeastern United States have a set of genes also found in East Asian breeds imported in recent decades."
    ],
    answer: 0 // A
  },
  {
    id: 13,
    passage: `The Bantu expansion refers to the gradual dispersal of Bantu-speaking peoples (which today include, among other groups, the Hlubi in South Africa and the Tutsi in Rwanda) and their languages from an ancestral homeland in West-Central Africa across much of sub-Saharan Africa over approximately 3,500 years, starting about 4,000–5,000 years ago (ya). Citing the discovery of grinding equipment dating as far back as 5,000 ya consistent with processing of plant foods, some researchers have asserted that the Bantu expansion can be explained by the farming/language dispersal hypothesis. This hypothesis proposes that the dispersal of many of the world's large language families—for instance, Sino-Tibetan—was driven primarily by the adoption of agriculture.`,
    question: "Which finding, if true, would most directly challenge the assertion about the Bantu expansion presented in the text?",
    options: [
      "The earliest unambiguous archaeobotanical evidence of plant cultivation and domestication in West-Central Africa consists of pearl millet (Pennisetum glaucum) found in three sites in present-day Cameroon dated to around 2,200–2,350 ya and in one site in the present-day Democratic Republic of the Congo dated to around 2,200 ya.",
      "Reconstructed vocabulary from Proto-Bantu, the ancestral language from which all later Bantu languages descended, contains terms for some wild plant species that early Bantu speakers actively managed and cultivated but that were never fully domesticated into true crop plants.",
      "Lexical reconstructions indicate that the earliest Bantu speakers' words for yams, starchy tubers that are today an agricultural staple throughout sub-Saharan Africa, were inherited from languages predating the arrival of Bantu ancestral groups in their homeland.",
      "Among the earliest archaeobotanical evidence of plant farming in East Africa, which Bantu-speaking peoples may have reached as early as 3,500 ya, are traces of cowpea (Vigna unguiculata), a legume crop believed to have originated in West Africa, which were discovered in the Kakapel Rockshelter in present-day Kenya."
    ],
    answer: 0 // A
  },
  {
    id: 14,
    passage: `"The Lesson" is a 1913 poem by Paul Laurence Dunbar. In the poem, the speaker comes to realize that comforting another person helps to lessen the speaker's own sadness:`,
    question: "Which quotation from \"The Lesson\" most effectively illustrates the claim?",
    options: [
      "\"And I thought of myself so sad and lone, / And my life's cold winter that knew no spring.\"",
      "\"In trying to soothe another's woes / Mine own had passed away.\"",
      "\"Of my mind so weary and sick and wild, / Of my heart too sad to sing.\"",
      "\"And heard well up from the deep dark wood / A mocking-bird's passionate song.\""
    ],
    answer: 1 // B
  },
  {
    id: 15,
    passage: `Episodes in which technologies fall into disuse after a period of adoption, as occurred with the loss of bow-and-arrow technology in northern Europe during the late Paleolithic, are informative for understanding the factors shaping technological development in ancient societies. However, it can be unclear whether an absence of artifacts signifies a cultural shift or is merely an effect of gaps in the archaeological record. A dataset of gold objects, including beads and medallions, recovered from Bronze and Iron Age sites at Nosiri, Oshakan, and other places in the Caucasus reveals a steep drop in the total number of gold artifacts beginning around 1500 BCE in some locations. That this drop represents a genuine instance of cultural change is likely, given that ______`,
    question: "Which choice most logically completes the text?",
    options: [
      "the proportion of gold objects to other types of objects recovered is significantly higher at Nosiri than at Oshakan despite the two sites' close proximity.",
      "a much larger number of Caucasus sites dating from after 1500 BCE are represented in the dataset than sites dating from before 1500 BCE are.",
      "far fewer gold objects dating to earlier than 1500 BCE have been recovered from sites in the Caucasus than have been recovered from comparably old sites outside the region.",
      "there is a positive relationship between the number of gold objects found at Caucasus sites and the sites' respective distances from nearby sources of gold, such as gold ore deposits."
    ],
    answer: 1 // B
  },
  {
    id: 16,
    passage: `Though they are in different countries, the towns of Sofifi, Indonesia, and Mevang, Gabon, do have something in common. They are among the rare ______ sit almost directly on the equator.`,
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["places in that", "places. That", "places: that", "places that"],
    answer: 3 // D
  },
  {
    id: 17,
    passage: `The state of Kentucky stretches across two time zones. While ______ eastern half is in the Eastern time zone, the rest of the state is in the Central time zone, one hour behind.`,
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["it's", "they're", "their", "its"],
    answer: 3 // D
  },
  {
    id: 18,
    passage: `The perception that a project has no precedent or comparable examples ______ called uniqueness bias. This flawed thinking has the potential to affect project performance significantly, with research showing that uniqueness bias correlates with budget overruns.`,
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["are", "being", "is", "were"],
    answer: 2 // C
  },
  {
    id: 19,
    passage: `The Marrow of Tradition, a 1901 novel by Charles Chesnutt, has been lauded as "probably the most astute political-historical novel of its day," while The Sport of the Gods, a 1902 novel by Paul Laurence Dunbar, was recently praised for "expos[ing] the disjuncture between law and justice" in the US at the time. ______ novels are just two of several by Black authors from the period to have garnered such acclaim.`,
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      "Chesnutt and Dunbars'",
      "Chesnutt and Dunbar's",
      "Chesnutt's and Dunbar's",
      "Chesnutts and Dunbars'"
    ],
    answer: 2 // C
  },
  {
    id: 20,
    passage: `The economies of "The Four Asian Tigers"—Hong Kong, Singapore, South Korea, and Taiwan—saw tremendous growth in the late 20th century. Scholars ______ cultural explanations for this phenomenon, likely recalling Weber's association of capitalism with religion in Reformation-era northern Europe, posited that Confucianism's emphasis on hard work, discipline, education, and respect for authority laid the groundwork for the Tigers' economic success.`,
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["had considered", "considered", "considering", "were considering"],
    answer: 2 // C
  },
  {
    id: 21,
    passage: `Fluid impedes sound considerably more than air ______ the process by which the human ear reconciles the discrepancy between the outer ear and the fluid-filled inner ear, recruits the tympanic membrane and the lever action of the ear bones to increase pressure such that sound can pass through the inner ear unimpeded.`,
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      "does. Impedance matching is",
      "does. Impedance matching—which is",
      "does, impedance matching,",
      "does. Impedance matching,"
    ],
    answer: 3 // D
  },
  {
    id: 22,
    passage: `In his 2000 book Bowling Alone, sociologist Robert Putnam argues that the erosion of social capital in the United States can be traced to the waning popularity of a variety of civic organizations, such as scouting groups, labor unions, and sports clubs. ______ between 1980 and 1993, though the number of bowlers in the country increased by 10 percent, the number of bowlers participating in a league decreased by 40 percent.`,
    question: "Which choice completes the text with the most logical transition?",
    options: [
      "According to Putnam, this decline has broader social implications:",
      "Some critics have presented evidence that the book may overstate the data's significance:",
      "The book's title alludes to an example of this social shift:",
      "This argument, though valid, may overlook other forms of group participation:"
    ],
    answer: 2 // C
  },
  {
    id: 23,
    passage: `Among its thousands of portraits of well-known figures from British history, London's National Portrait Gallery (NPG) includes self-portraits by noteworthy British artists, including one of Rachel Strachey. ______ the subjects of most NPG portraits are different from (and more famous than) the artists who painted them.`,
    question: "Which choice completes the text with the most logical transition?",
    options: [
      "However, Strachey's portrait is not the only self-portrait of an artist in the museum:",
      "Of course, such portraits are anomalies in the context of the museum's collection:",
      "Furthermore, Strachey's portrait exemplifies the museum's bias in favor of autoportraiture:",
      "Consequently, such portraits reinforce the museum's curatorial philosophy:"
    ],
    answer: 1 // B
  },
  {
    id: 24,
    passage: `Researchers have long been aware that pistol shrimp use a specialized claw to create bubbles that stun their prey, but understanding of the phenomenon has been limited by researchers' inability to accurately measure the tiny, rapid movements of the shrimp. ______ scientists have turned to computer simulations to re-create the claw's closing motion, allowing them to track the pressure, speed, and density of water throughout the bubble formation.`,
    question: "Which choice completes the text with the most logical transition?",
    options: [
      "In light of this limitation,",
      "Addressing the flaws in their hypothesis,",
      "To correct this misconception,",
      "To determine where they went wrong,"
    ],
    answer: 0 // A
  },
  {
    id: 25,
    passage: `In Kazakhstan, the Parliament is elected via a proportional representation (PR) system. In PR elections, votes are cast (not for specific candidates, as they are in single-member plurality systems, but for political parties) and then tabulated; each qualifying party, ______ is awarded a number of seats proportional to the number of votes it received.`,
    question: "Which choice completes the text with the most logical transition?",
    options: ["by contrast,", "second of all,", "in fact,", "in turn,"],
    answer: 3 // D
  },
  {
    id: 26,
    passage: `While researching a topic, a student has taken the following notes:
• The A.M. Turing Award is a prestigious award given by the Association for Computing Machinery (ACM).
• The ACM gives the award for "major contributions of lasting importance to computing."
• Raj Reddy won the award in 1994 for pioneering the development of large-scale artificial intelligence systems.`,
    question: "Which choice most effectively uses information from the given sentences to specify why Raj Reddy won the A.M. Turing Award?",
    options: [
      "Raj Reddy won the A.M. Turing Award for pioneering the development of large-scale artificial intelligence systems.",
      "Raj Reddy is a winner of the ACM's prestigious A.M. Turing Award.",
      "It was in 1994 that Raj Reddy won the A.M. Turing Award.",
      "Generally, the prestigious A.M. Turing Award is given for \"major contributions of lasting importance to computing.\""
    ],
    answer: 0 // A
  },
  {
    id: 27,
    passage: `While researching a topic, a student has taken the following notes:
• Fused deposition modeling (FDM) is one type of 3D printing technology.
• FDM is also called material extrusion.
• FDM printers eject a modeling medium through a heated nozzle to build an object layer by layer.
• Italian company Barilla uses FDM printers that extrude layers of semolina and water dough to create unique shapes of pasta.
• Ukrainian entrepreneur Dinara Kasko uses an FDM printer that extrudes layers of silicone to create uniquely shaped molds for baking cakes.`,
    question: "The student wants to emphasize a difference between Barilla's and Kasko's uses of FDM printing technology. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    options: [
      "Barilla uses FDM printing to build layers of pasta dough into unique shapes, whereas Kasko uses FDM printing to build layers of uniquely shaped cakes.",
      "While both Barilla and Kasko use FDM printers to create uniquely shaped 3D objects, Barilla is using the technology to produce food and Kasko isn't.",
      "FDM printing technology has many uses, from creating uniquely shaped pasta from semolina and water dough to constructing cake molds from silicone.",
      "Barilla and Kasko have developed different uses for FDM printing, a 3D printing technology also known as material extrusion."
    ],
    answer: 1 // B
  }
]

// ──────────────────────────────────────────────
//  组装所有套题
// ──────────────────────────────────────────────
export const allMockTests: MockTestSet[] = [
  {
    id: '2505as-1',
    title: '2505AS 第一套',
    modules: [
      // Module 1 — 待补充题目
      {
        name: 'Module 1',
        subject: '阅读与文法',
        timeMinutes: 32,
        questions: [] // TODO: 等待 Module 1 题目
      },
      // Module 2 — 已有 27 题
      {
        name: 'Module 2',
        subject: '阅读与文法',
        timeMinutes: 32,
        questions: q_2505as1_m2
      }
    ]
  }
  // 添加新套题示例：
  // {
  //   id: '2505as-2',
  //   title: '2505AS 第二套',
  //   modules: [
  //     { name: 'Module 1', subject: '阅读与文法', timeMinutes: 32, questions: [] },
  //     { name: 'Module 2', subject: '阅读与文法', timeMinutes: 32, questions: [] }
  //   ]
  // }
]

/** 根据 testId 查找套题 */
export function getTestSet(testId: string): MockTestSet | undefined {
  return allMockTests.find(t => t.id === testId)
}
