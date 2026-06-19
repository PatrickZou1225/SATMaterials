export interface VocabQuestion {
  id: number
  title: string
  passage: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

const vocabQuestions: VocabQuestion[] = [
  {
    id: 1001,
    title: 'Colliding Balls',
    passage: 'The work of Tobias Gerstenberg et al. on tracking eye movements supports a theory that people engage in ______ thinking when making causal judgments: when subjects were asked to look at two colliding billiard balls and judge whether one caused or prevented the other\'s movement through a gate, their eyes looked at where the target ball would have gone if the ball that altered its path did not exist.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['ambivalent', 'counterfactual', 'analogical', 'associative'],
    answer: 1,
    explanation: 'The colon introduces a restatement. The subjects imagined "where the ball would have gone if the other ball did not exist" — this is counterfactual thinking (imagining an alternate reality).'
  },
  {
    id: 1002,
    title: 'Self-Control Fish',
    passage: 'Cuttlefish appear to be surprisingly ______ at exercising self-control: in a 2021 study conducted by behavioral ecologist Alexandra Schnell, these cephalopods routinely demonstrated restraint by delaying gratification, waiting for a favorite treat instead of instantly devouring a readily available meal.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['competent', 'imaginative', 'awkward', 'manageable'],
    answer: 0,
    explanation: 'The colon signals restatement: "routinely demonstrated restraint" = they are good/skilled at self-control. "Competent" (capable, skilled) is the natural collocation with a living being. "Manageable" describes situations, not organisms.'
  },
  {
    id: 1003,
    title: 'Rich Portrait',
    passage: 'It is hardly an exaggeration to characterize modern Hawaiian literature as having ______ the traditional stories of the Kanaka Maoli, the Native Hawaiian people. In a variety of ways, Samuel Kamakau, Kristiana Kahakauwila, and other acclaimed writers have drawn on these stories to craft a rich portrait of the Hawaiian Islands and their people.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['brooded on', 'supplanted', 'anticipated', 'derived from'],
    answer: 3,
    explanation: '"Drawn on these stories" in the second sentence restates what goes in the blank. "Derived from" means "taken/originated from" — matching "drawn on."'
  },
  {
    id: 1004,
    title: 'Consonant Sounds',
    passage: 'The Polynesian languages, a group of related languages originating on islands in the Pacific, typically have ______ array of consonant sounds. For example, the Tokelauan language of the South Pacific has eleven consonants, and Olelo Hawai\'i, the language of the Native Hawaiian people, has eight. Globally, however, the median number of consonants per language is over twenty-two.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['a musical', 'an unvarying', 'an exclusive', 'a modest'],
    answer: 3,
    explanation: '"However" signals contrast. The global median is 22 (high), so Polynesian languages (8-11) have a small/modest number of consonants.'
  },
  {
    id: 1005,
    title: 'Honey Bee',
    passage: 'Given that healthy genetic diversity supports honey bee population robustness—a matter of public interest given the bees\' crucial role as pollinators of many crops, such as watermelon—a study revealing a ______ of diversity among US honey bees raised concern, though it also noted the potential to enhance the number of bees carrying several newly discovered genetic variants.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['paucity', 'redundancy', 'disparity', 'repository'],
    answer: 0,
    explanation: '"Raised concern" signals a negative finding. Since diversity is established as positive, the study must have found a "lack" of diversity. "Paucity" = scarcity, lack. "Disparity" = inequality between groups (wrong nuance — passage doesn\'t compare groups).'
  },
  {
    id: 1006,
    title: 'Remarkably Bold',
    passage: 'Though few critics consider Vasily Grossman\'s novel Stalingrad—which focuses on the experience of the Soviet Union in the early years of World War II—to be as well written as his later book Everything Flows, some compliment it despite the damage ______ Soviet censors: Gary Saul Morson in The New York Review of Books called the novel "remarkably bold."',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['bestowed on', 'wrought by', 'allocated to', 'concealed from'],
    answer: 1,
    explanation: '"Damage wrought by" = damage caused by. Soviet censors caused damage to the novel. "Wrought" is the past participle of "work" — "wrought by" is the standard collocation with "damage."'
  },
  {
    id: 1007,
    title: 'Beads',
    passage: 'Archaeologists have identified a plethora of beads fashioned from Tritia gibbosula shells in many Middle Stone Age (MSA) sites across western North Africa, including El Mnasra Cave, Morocco. In a 2021 paper, El Mehdi Sehasseh et al. attribute these artifacts\' ______ to the evolution and propagation of symbolic behavior in humans and the availability of T. gibbosula during the MSA.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['fecundity', 'ubiquity', 'heterogeneity', 'expediency'],
    answer: 1,
    explanation: '"Plethora...across many sites" = widespread presence. "Ubiquity" means the state of being everywhere — matching the description of beads found across many MSA sites.'
  },
  {
    id: 1008,
    title: 'Hawaiian',
    passage: 'Lisa Linn Kanae is a celebrated contemporary Hawaiian author whose work is ______ by a rich literary history. From the traditional stories of the Kānaka Maoli, or Native Hawaiian people, to the works of writers such as David Malo, the literary heritage of Hawai\'i is distinctive and vibrant.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['preceded', 'summarized', 'supplanted', 'overlooked'],
    answer: 0,
    explanation: 'The literary history (traditional stories, David Malo) came BEFORE Lisa Linn Kanae (contemporary author). Her work is "preceded" by this rich history.'
  },
  {
    id: 1009,
    title: 'Black Swan',
    passage: 'The familial structure of the black swan (Cygnus atratus) shows tremendous ______: breeding pairs with demonstrated success in rearing cygnets (young swans) have been observed to foster those of less successful pairs, and while rearing by female-male pairs is most common, male-male pairs sometimes rear cygnets too, achieving a significantly higher rate of survival to adulthood than female-male pairs.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['elasticity', 'reciprocity', 'cohesion', 'affection'],
    answer: 0,
    explanation: 'The colon introduces examples of flexible/varied family arrangements: fostering, different pair types. "Elasticity" = flexibility, ability to vary.'
  },
  {
    id: 1010,
    title: 'PSP',
    passage: 'Postcranial skeletal pneumaticity (PSP) refers to the presence of extensions of an animal\'s lungs and air sacs inside its bones. Though such structures do not typically fossilize, they are believed to have been present in Tyrannosaurus, Euhelopus, and other Cretaceous theropods and sauropods. To ______ PSP from fossils, researchers look for indicators such as large foramina (holes in bones).',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['infer', 'acquire', 'isolate', 'preserve'],
    answer: 0,
    explanation: 'Since PSP structures don\'t fossilize, researchers can\'t directly observe them. They must "infer" (deduce) PSP from indirect indicators like bone holes.'
  },
  {
    id: 1011,
    title: 'Intergeneric',
    passage: 'Writer Lydia Davis observed that while ______ literary forms, such as the short story, are recognizable as such even as they evolve, there are rarer "intergeneric" forms that might, for example, use elements of both fiction and essays to create something unclassifiable. The very short publications of Diane Williams arguably fit in this category, since they straddle the line between prose and poetry.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['equivocal', 'orthodox', 'intermediate', 'neutral'],
    answer: 1,
    explanation: '"While" signals contrast with "rarer intergeneric." The blank describes conventional/traditional forms. "Orthodox" = conventional, traditional, standard.'
  },
  {
    id: 1012,
    title: 'Suspend Sedimentary',
    passage: 'For most of its length, the Pungue River has sufficiently high flow velocity to suspend sedimentary particles; but when the river reaches the calmer waters of the Indian Ocean, its channel widens and divides, reducing flow velocity and thereby ______ sedimentary particle suspension. Particles are thus deposited, eventually forming deltaic lobes.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['compounding', 'obscuring', 'interrupting', 'expediting'],
    answer: 2,
    explanation: '"But" signals contrast + "thereby" signals cause-effect. Reducing velocity causes the suspension to stop/be interrupted. "Interrupting" = breaking the continuity of suspension.'
  },
  {
    id: 1013,
    title: 'Recurring',
    passage: 'The subscription model in which consumers who do not deliberately cancel their subscriptions automatically pay recurring fees for access to products and services benefits retailers when consumer ______ is high. Many of the 8.5 percent of subscribers who canceled their food and beverage subscriptions in January 2022 had stopped valuing their subscriptions long before then, but sellers profited from those customers\' passivity in the interim.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['inertia', 'evasion', 'decisiveness', 'turnover'],
    answer: 0,
    explanation: '"Passivity" restates what the blank should mean: consumers staying put, not canceling, not acting. "Inertia" = tendency to remain unchanged, inaction. Standard economic term "consumer inertia."'
  },
  {
    id: 1014,
    title: 'Myopic',
    passage: 'Despite stated claims of the ______ of the research, much analysis of income inequality performed in the 2010s suffered from a myopic focus on a few countries in North America and Western Europe, partly due to limited data availability. Researchers would later remedy this shortcoming after gaining new access to administrative records located in nations in Africa and Eastern Europe.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['novelty', 'immutability', 'exhaustiveness', 'pervasiveness'],
    answer: 2,
    explanation: '"Despite" signals contrast. Reality: "myopic focus on a few countries" (narrow). The "stated claims" must be the opposite: comprehensive, covering everything. "Exhaustiveness" = completeness.'
  },
  {
    id: 1015,
    title: 'Less Observers',
    passage: 'Political blogs with conspicuous ideological alignments became an integral component of US media in the early 2000s. While some commentators lauded this development, asserting that such blogs had a welcome transparency missing from traditional news, less ______ observers countered that such blogs tended to ideological extremes that exacerbated political polarization to problematic levels.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['sanguine', 'recalcitrant', 'misanthropic', 'earnest'],
    answer: 0,
    explanation: '"While" + "less ___" signals contrast. Some people praised (positive) → less ___ people criticized (negative). The blank describes those who are NOT positive/optimistic. "Sanguine" = cheerfully optimistic. "Less sanguine" = more pessimistic/critical.'
  },
  {
    id: 1016,
    title: 'Nonworking Parents',
    passage: 'Proposals to raise the age at which retirees begin receiving government transfers of funds are generally discussed in terms of the effects on transfer recipients, but Andria Smythe has argued that delaying such transfers could ______ wealth creation among working adults by lengthening the period in which they are providing financial support to their nonworking parents.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['stymie', 'compound', 'disparage', 'outstrip'],
    answer: 0,
    explanation: '"But" introduces a different perspective. Delaying transfers → working adults support parents longer → this would HINDER wealth creation. "Stymie" = obstruct, hinder, prevent.'
  },
  {
    id: 1017,
    title: 'Anthology',
    passage: 'The 2023 anthology The Big Book of Cyberpunk contains 108 stories, including Fritz Leiber\'s "Coming Attraction" (1950) and Erica Satifka\'s "Act of Providence" (2021). With its chronological scope, it is more comprehensive than the much shorter 1986 cyberpunk anthology Mirrorshades, but Mirrorshades\'s careful selection of stories makes that anthology more ______.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['capacious', 'outmoded', 'cursory', 'discerning'],
    answer: 3,
    explanation: '"But" signals contrast. Big Book = comprehensive (quantity). Mirrorshades = careful selection (quality). "Discerning" = showing good judgment in selection. TRAP: "Capacious" (spacious) describes Big Book, not Mirrorshades.'
  },
  {
    id: 1018,
    title: 'Pots',
    passage: 'Daniel J. Kliebenstein and colleagues ______ pots of sterilized soil with slurries of live microbes collected from soil in five sites across Colorado, including areas of sagebrush and dry pasture. Kliebenstein and team then grew mustard plants in the pots to see if the different microbial slurries affected levels of spicy glucosinolates in the plants\' seeds.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['populated', 'precluded', 'sanitized', 'estimated'],
    answer: 0,
    explanation: 'Researchers introduced microbes into sterilized soil pots. "Populated" = filled/introduced organisms into. Standard scientific collocation: "populate X with Y."'
  },
  {
    id: 1019,
    title: 'Air Sacs',
    passage: 'Paleontologists think that Dsungaripterus, Sauroposeidon, and other long-extinct pterosaurs and sauropods may have breathed using air sacs connected to tubelike extensions inside the animals\' bones. Such structures are found in modern birds, which is why some paleontologists treat the respiratory systems of birds as ______ those of Dsungaripterus, Sauroposeidon, and other pterosaurs and sauropods.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['emissaries for', 'subordinates of', 'harbingers of', 'proxies for'],
    answer: 3,
    explanation: 'Bird respiratory systems are used as stand-ins/models for understanding dinosaur systems. "Proxies for" = substitutes, stand-ins. Since we can\'t observe dinosaurs directly, we use birds as proxies.'
  },
  {
    id: 1020,
    title: 'Blocking Voting',
    passage: 'Until 1917, there was no formal measure in the United States Senate that could be ______ to end a debate that had been excessively prolonged as a tactic to block voting on a matter. In that year, a procedure was created to allow a majority of senators to curtail deliberation and force a vote.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['invoked', 'improvised', 'partitioned', 'abolished'],
    answer: 0,
    explanation: 'A measure that could be "invoked" (called upon, used) to end debate. "Invoke" = cite or appeal to as an authority. This describes cloture — a procedure invoked to end a filibuster.'
  },
  {
    id: 1021,
    title: 'Frequently Helpful',
    passage: 'Some ethicists challenge the concept of personal character, claiming that if it were meaningful, situational factors could not, as they clearly can, induce behavior contrary to that character. As Rachana Kamtekar observes, this argument is difficult to reconcile with our lay conception of character: we expect a person of helpful character to be frequently helpful, not ______ helpful.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['self-servingly', 'sporadically', 'grudgingly', 'unfailingly'],
    answer: 3,
    explanation: 'Contrast with "frequently." We expect helpful people to be frequently (not always) helpful. "Not unfailingly helpful" = not always/without-fail helpful. "Unfailingly" = always, without exception.'
  },
  {
    id: 1022,
    title: 'Blood Chemistry',
    passage: 'New and interesting research conducted by Suleiman A. Al-Sweedan and Moath Alhaj is inspired by their observation that though there have been many studies of the effect of high altitude on blood chemistry, there is a ______ studies of the effect on blood chemistry of living in locations below sea level, such as the California towns of Salton City and Seeley.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['quarrel about', 'paucity of', 'profusion of', 'verisimilitude in'],
    answer: 1,
    explanation: '"Though" signals contrast. Many high-altitude studies BUT few below-sea-level studies. "Paucity of" = scarcity, lack. The contrast is between abundance (many) and scarcity (paucity).'
  },
  {
    id: 1023,
    title: 'French Monarch',
    passage: 'Whether the reign of a French monarch such as Hugh Capet or Henry I was historically consequential or relatively uneventful, its trajectory was shaped by questions of legitimacy and therefore cannot be understood without a corollary understanding of the factors that allowed the monarch to ______ his right to hold the throne.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['reciprocate', 'annotate', 'buttress', 'disengage'],
    answer: 2,
    explanation: '"Therefore" signals cause-effect. Questions of legitimacy → monarch needed to strengthen/support his claim. "Buttress" = support, strengthen, reinforce. Standard collocation: "buttress a claim/right."'
  },
  {
    id: 1024,
    title: 'The First',
    passage: 'Mary Engle Pennington, a chemist who helped advance home refrigeration, undoubtedly made a substantial impact on society, but her place in our historical memory is perhaps more ______ than that of Stephanie Kwolek, who invented the incredibly strong material known as Kevlar, an accomplishment for which she will long be remembered.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['permanent', 'tentative', 'warranted', 'prominent'],
    answer: 1,
    explanation: '"But" signals contrast. Pennington made substantial impact BUT her place in memory is uncertain/tenuous compared to Kwolek (who will "long be remembered"). "Tentative" = uncertain, not firmly established.'
  },
  {
    id: 1025,
    title: 'Pipes',
    passage: 'To demonstrate that the integrity of underground metal pipes can be assessed without unearthing the pipes, engineer Aroba Saleem and colleagues ______ the tendency of some metals\' internal magnetic fields to alter under stress: the team showed that such alterations can be measured from a distance and can reveal concentrations of stress in the pipes.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['hypothesized', 'discounted', 'redefined', 'exploited'],
    answer: 3,
    explanation: 'The colon introduces explanation. The team USED/TOOK ADVANTAGE OF the magnetic tendency to achieve their goal. "Exploited" = made use of, took advantage of (neutral/positive sense).'
  },
  {
    id: 1026,
    title: 'Subject Pools',
    passage: 'Despite the generalizations about human behavior they have produced, many studies of behavioral psychology have used highly unrepresentative subject pools: students at the colleges and universities where the researchers are employed. To ______ this situation, it is necessary to actively recruit subjects from diverse backgrounds and locations.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['sanction', 'ameliorate', 'rationalize', 'postulate'],
    answer: 1,
    explanation: 'The situation (unrepresentative subject pools) is a problem. "To ___ this situation" → needs a verb meaning "fix/improve." "Ameliorate" = make better, improve.'
  },
  {
    id: 1027,
    title: 'Islamic Thought',
    passage: 'While recent scholarship has undermined claims that the works of twelfth-century Islamic philosopher Ibn Rushd were ______ other Muslim philosophers of his time, it is indisputable that his location in the Muslim-ruled area of what is now Spain meant that his works were primarily available thousands of miles west of the era\'s center of Islamic thought.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['controversial among', 'antagonistic toward', 'imitated by', 'inconsequential to'],
    answer: 3,
    explanation: '"While" signals that scholarship undermined a claim. The second half says his works were far from the center of Islamic thought — supporting the idea that people claimed he was unimportant. "Inconsequential to" = unimportant, having no effect on.'
  },
  {
    id: 1028,
    title: '1812 War',
    passage: 'The War of 1812 has ______ place in historical memory in Britain, partly because it is overshadowed by the much larger concurrent conflict against Napoleonic France and partly because it essentially maintained the geopolitical status quo for Britain: the country neither gained nor lost significant territory or position as a result of its participation in the war.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['a tenuous', 'an enduring', 'a contentious', 'a conspicuous'],
    answer: 0,
    explanation: 'Overshadowed + neither gained nor lost → weak/unimportant place in memory. "Tenuous" = weak, slight, barely existing. The war barely registers in British memory.'
  },
  {
    id: 1029,
    title: 'Cover Page',
    passage: 'In 1891, design artist William Morris cofounded the Kelmscott Press, which printed editions of books using preindustrial methods. Historians argue that Morris\'s repudiation of industrialization is ______ the Kelmscott editions\' use of handmade materials and intricate ornamentation reminiscent of medieval manuscripts: these meticulously handcrafted elements exemplify the artistry involved.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['insensible to', 'manifest in', 'scrutinized by', 'complicated by'],
    answer: 1,
    explanation: 'The colon + "exemplify" signals restatement. Morris\'s rejection of industrialization is SHOWN/EXPRESSED in the handmade materials. "Manifest in" = clearly shown or visible in.'
  },
  {
    id: 1030,
    title: 'Social Media Use',
    passage: '______ the long-standing trend of overemphasizing teenagers and young adults in research on social media use, scholars have recently begun to expand their focus to include the fastest-growing cohort of social media users: senior citizens.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['Exacerbating', 'Redressing', 'Epitomizing', 'Precluding'],
    answer: 1,
    explanation: 'The trend was overemphasizing youth → scholars are now expanding to include seniors. This is correcting/counterbalancing the trend. "Redressing" = remedying, correcting, setting right.'
  },
  {
    id: 1031,
    title: 'Disputing',
    passage: 'The following text is adapted from James Baldwin\'s 1956 novel Giovanni\'s Room. The narrator is riding in a taxi down a street lined with food vendors and shoppers in Paris, France.\n\nThe multitude of Paris seems to be dressed in blue every day but Sunday, when, for the most part, they put on an unbelievably festive black. Here they were now, in blue, disputing, every inch, our passage, with their wagons, handtrucks, their bursting baskets carried at an angle steeply self-confident on the back.',
    question: 'As used in the text, what does the word "disputing" most nearly mean?',
    options: ['Arguing about', 'Disapproving of', 'Asserting possession of', 'Providing resistance to'],
    answer: 3,
    explanation: 'The crowd with their wagons and baskets is PHYSICALLY blocking/resisting the taxi\'s passage. "Disputing our passage" = contesting/challenging their right to pass, i.e., providing resistance to their movement.'
  },
  {
    id: 1032,
    title: 'Diadromous fish',
    passage: 'Diadromous fish migrate between freshwater and marine biomes during their life cycle. The migration\'s obligate nature is why diadromous fish can be ______ those that are merely euryhaline (able to tolerate high salinity): the euryhaline blackchin tilapia can survive high salinity, but its life cycle does not involve relocation to a different biome, as does that of the diadromous wild salmon.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['demarcated from', 'reconstituted as', 'conflated with', 'derived from'],
    answer: 0,
    explanation: 'The colon explains why diadromous fish are DIFFERENT from merely euryhaline fish. "Demarcated from" = clearly separated, distinguished from. "Conflated with" is the opposite (mixed together).'
  },
  {
    id: 1033,
    title: 'Big Whack',
    passage: 'One popular theory of the origin of the Moon, the "big whack," posits that a protoplanet called Theia collided with Earth, flinging debris into orbit that eventually coalesced into the Moon. Until recently, Theia was ______, but researcher Qian Yuan and colleagues now claim to have identified pieces of the protoplanet in the lowermost section of Earth\'s mantle.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['desultory', 'spurious', 'veritable', 'notional'],
    answer: 3,
    explanation: '"Until recently...but now claim to have identified." Theia was purely theoretical until now. "Notional" = existing only in theory, hypothetical. Contrast with now having physical evidence.'
  },
  {
    id: 1034,
    title: 'Homo sapiens',
    passage: 'The author\'s claim about the relationship between Neanderthals and Homo sapiens is ______, as it fails to account for several recent archaeological discoveries. To be convincing, his argument would need to address recent finds of additional hominid fossils, such as the latest Denisovan specimens and Homo longi.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['disorienting', 'tenuous', 'nuanced', 'unoriginal'],
    answer: 1,
    explanation: '"Fails to account for recent discoveries" → the claim is weak/unsupported. "Tenuous" = weak, flimsy, lacking solid support. The claim doesn\'t hold up against new evidence.'
  },
  {
    id: 1035,
    title: 'Sterlin Harjo',
    passage: 'Seminole/Muscogee director Sterlin Harjo ______ television\'s tendency to situate Native characters in the distant past: this rejection is evident in his series Reservation Dogs, which revolves around teenagers who dress in contemporary styles and whose dialogue is laced with current slang.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['repudiates', 'proclaims', 'foretells', 'recants'],
    answer: 0,
    explanation: '"This rejection" after the colon restates the blank. Harjo REJECTS TV\'s tendency. "Repudiates" = rejects, refuses to accept. His show demonstrates this rejection through contemporary Native characters.'
  },
  {
    id: 1036,
    title: 'Faint for Detection',
    passage: 'In 2016, Gabriela González and team announced that a chirping sound captured by Laser Interferometer Gravitational-Wave Observatory antennas was direct evidence of gravitational waves, which skeptics had argued would be too faint for detection. Detailed statistical analysis helped preclude claims of the event\'s ______, confirming the signal at a confidence level of over 99%.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['inconspicuousness', 'discretion', 'ambiguity', 'probability'],
    answer: 2,
    explanation: 'Statistical analysis confirmed the signal → this precluded claims of UNCERTAINTY about the signal. "Ambiguity" = uncertainty of meaning/interpretation. The analysis removed doubt about whether the signal was real.'
  },
  {
    id: 1037,
    title: 'Political Blogs',
    passage: 'Political blogs with conspicuous ideological alignments became an integral component of US media in the early 2000s. While some commentators lauded this development, asserting that such blogs had a welcome transparency missing from traditional news, less ______ observers countered that such blogs tended to ideological extremes that exacerbated political polarization to problematic levels.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['sanguine', 'recalcitrant', 'misanthropic', 'earnest'],
    answer: 0,
    explanation: 'Duplicate of Q1015. "Less sanguine" = less optimistic. Answer: A) sanguine.'
  },
  {
    id: 1038,
    title: 'Wealth Creation',
    passage: 'Proposals to raise the age at which retirees begin receiving government transfers of funds are generally discussed in terms of the effects on transfer recipients, but Andria Smythe has argued that delaying such transfers could ______ wealth creation among working adults by lengthening the period in which they are providing financial support to their nonworking parents.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['stymie', 'compound', 'disparage', 'outstrip'],
    answer: 0,
    explanation: 'Duplicate of Q1016. "Stymie" = hinder, obstruct. Answer: A) stymie.'
  },
  {
    id: 1039,
    title: 'Beadwork Artist',
    passage: 'Critics have asserted that fine art and fashion rarely ______ in a world where artists create timeless works for exhibition and designers periodically produce new styles for the public to buy. Luiseño/Shoshone-Bannock beadwork artist and designer Jamie Okuma challenges this view: her work can be seen in the Metropolitan Museum of Art and purchased through her online boutique.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['prevail', 'succumb', 'diverge', 'intersect'],
    answer: 3,
    explanation: 'Critics say art and fashion rarely OVERLAP. Okuma challenges this — her work is both in a museum (art) AND sold online (fashion). "Intersect" = overlap, cross paths. Her work proves they DO intersect.'
  },
  {
    id: 1040,
    title: 'Art Institute of Chicago',
    passage: 'The Art Institute of Chicago houses nearly 300,000 works from around the world. Museum visitors looking to ______ their art-viewing experience should turn to Chicago\'s streets, where they can find works ranging from Joan Miro\'s sculpture Miro\'s Chicago at Brunswick Plaza to Kristen Kula\'s mural Tornado on East 11th Street.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['satisfy', 'provoke', 'mitigate', 'supplement'],
    answer: 3,
    explanation: 'Museum + street art = ADDING to the experience. "Supplement" = add to, enhance by adding something extra. Visitors supplement the indoor museum experience with outdoor street art.'
  },
  {
    id: 1041,
    title: 'Nihonga',
    passage: 'Dragon against Tiger is an important work of Nihonga, or classical Japanese painting. Unlike Wada Eisaku, who adopted traditional European methods such as painting with oil on canvas, Hashimoto Gaho ______ traditional Japanese approaches. For instance, Hashimoto produced Dragon against Tiger by applying color pigments to a silk surface.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['overlooked', 'distrusted', 'embraced', 'released'],
    answer: 2,
    explanation: '"Unlike" signals contrast. Eisaku adopted EUROPEAN methods → Hashimoto did the opposite: he embraced JAPANESE methods. "Embraced" = willingly accepted, adopted.'
  },
  {
    id: 1042,
    title: 'Wikipedia',
    passage: 'Though most hoaxes perpetrated as jokes by mischievous users of Wikipedia, an online encyclopedia that almost anyone can freely edit, have quickly been detected and removed, a few fictitious entries, such as those for the country singer-songwriter Joseph G. Williams and the Jamaican bird allegedly known as the Salvadorian Magpie, persisted on the site for many years before they were finally recognized as ______ and deleted.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['enhancements', 'fabrications', 'analyses', 'revelations'],
    answer: 1,
    explanation: '"Hoaxes" and "fictitious entries" → recognized as FAKE. "Fabrications" = invented/false things, fakes. The entries were fabrications that were eventually identified as such.'
  },
  {
    id: 1043,
    title: 'Ins',
    passage: 'Today, the mobile application Instagram is thought of exclusively as a photo- and video-sharing program, but image-sharing was originally ______ the app\'s main purpose, which was to allow users to indicate their locations to other users in real time. Only once it became clear how popular the secondary feature of image-sharing was did the company shift to making that the app\'s centerpiece.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['subordinate to', 'duplicated in', 'extracted by', 'intrinsic to'],
    answer: 0,
    explanation: '"But" signals contrast. Now: Instagram = photo-sharing (primary). Originally: photo-sharing was SECONDARY to location-sharing. "Subordinate to" = lower in rank, secondary to.'
  },
  {
    id: 1044,
    title: 'Tempting',
    passage: 'It is tempting to treat the clustering of information technology firms in Northern California as representative of industrial agglomeration generally, but Guilia Faggio et al. caution against ______ this one example: the potential for knowledge spillovers, a dominant driver of collocation in this industry, was largely absent from the paint manufacturing industry.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['corroborating', 'convening with', 'scrutinizing', 'extrapolating from'],
    answer: 3,
    explanation: '"But" + "caution against" signals warning. They warn against GENERALIZING from one example. "Extrapolating from" = using one case to draw broader conclusions. The colon explains WHY (knowledge spillovers unique to IT).'
  },
  {
    id: 1045,
    title: 'Children Lit',
    passage: 'The organizers specifically indicated that the conference was intended to focus on children\'s literature, so despite the education specialist\'s ______ her expertise on the subject in general, she found that she could speak authoritatively about the works of illustrator Ashley Bryan, particularly Beat the Story Drum, Pum-Pum, which she had used effectively in classroom instruction for many years.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['insight into', 'hesitancy about', 'exception to', 'affinity for'],
    answer: 1,
    explanation: '"Despite" signals contrast. She COULD speak authoritatively about ONE topic → despite her UNCERTAINTY about the general subject. "Hesitancy about" = uncertainty, reluctance. Contrast: general hesitancy vs. specific confidence.'
  },
  {
    id: 1046,
    title: 'Voters\' Regards',
    passage: 'Political scientists have found that although voters claim to prefer candidates who have nuanced perspectives on issues and who show a willingness to compromise, when asked to compare speeches expressing such views with speeches expressing ______ views, voters tend to regard the unyielding rhetoric of the latter more favorably.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['dogmatic', 'vacillating', 'banal', 'disingenuous'],
    answer: 0,
    explanation: '"Although" signals contrast. Voters SAY they prefer nuanced/compromising → but actually prefer the opposite: UNYIELDING views. "Dogmatic" = asserting opinions as absolute truth, uncompromising. Restated by "unyielding rhetoric."'
  },
  {
    id: 1047,
    title: 'Hawaiian Lit',
    passage: 'Although the literary works of David Malo and Lee Cataluna have universal appeal, they are also ______ the Hawaiian literary tradition in which both authors work and that stretches back to the traditional stories of the Kānaka Maoli, the Native Hawaiian people.',
    question: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: ['inextricable from', 'subverted by', 'presaged by', 'incongruous with'],
    answer: 0,
    explanation: '"Although" signals a concession — universal appeal, BUT also deeply tied to Hawaiian tradition. "Inextricable from" = impossible to separate from, deeply connected to. The works are inseparably linked to Hawaiian tradition.'
  }
]

export default vocabQuestions
