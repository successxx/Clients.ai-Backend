export const quizHookGenerationPrompt = (
  firstName: string,
  // lastName: string,
  email: string,
  website: string,
  companyDetails: string,
  // businessInfo: string,
  goals: string,
  offerName: string,
  offerBenefits: string,
  offerLink: string,
  offerPrice: string,
  content: string,
  topic: string
) => {
  return `
    Inputs on the business owner you're creating quiz hooks for:
Name:${firstName} 
Email: ${email}
Website (if available): ${website}
Company details in their words: ${companyDetails}
Goal/action we want them to take: ${goals}
Offer name: ${offerName}
Offer benefits: ${offerBenefits}
Offer link: ${offerLink}
Offer price: ${offerPrice}. Ignore if empty
Client testimonials and their respective attributions: 
Testimonials: ${content}

Preliminary Steps:
Analyze the inputs thoroughly through the lens of Carl Jung.
Create a virtual testing environment (VTE) to run thousands of internal simulations.
Use full compute power to test and optimize various hook variants.
Leverage historical data and predictive analytics to enhance accuracy.
Psychoanalytic Audience Understanding:
Delve deep into the target audience's psyche:
Explore their personal unconscious from a Jungian perspective, layered with your impressive understanding of the collective unconscious
Identify their position in Maslow's hierarchy
Uncover their current life focus: Survival, Under Dictatorship, Dictator, Law and Government/order, Material/Money Oriented, Spiritual, Family Oriented, Interpersonal/Social Growth, Transcendence
Analyze their decision-making processes, fears, desires, and motivations
Determine their primary buying motivations: Status, Achievement, Social, Security, Independence
Assess their LAB profile to understand their language patterns and thought structure
Consider Myers-Briggs data to identify patterns of traits
- Take a step back. Think deeply. Identify patterns. Reanalyze. Reidentify. Do not continue until you have an extremely deep and through psychoanalytic understanding. Ensure you follow ALL these instructions when creating your output.
Industry and Audience Analysis:
What keeps them awake at night?
Their SECRET desires?
Top 5 daily frustrations?
Entities or concepts they intensely dislike?
Major annoyances?
Identify 3-5 challenges consistently raised in ${topic}
Topics sparking the most curiosity
Current news or events shaping the ${topic} landscape
High-stake losses or gains they face
Hook Crafting Process:
Randomly select one hook type: Type, Killer, or Score
Integrate psychological triggers (e.g., social comparison theory, need for self-evaluation)
Ensure consistency with market language (familiar terminology, avoid jargon)
Craft the hook to seem innocuous while covertly probing deep psychological elements
Design the hook to enter the conversation already taking place in their head
Leverage the "opposite frame" for attention-getting curiosity if applicable
Examples of different words that may be more fitting to this class of offer we are pre-framing:
Type: Style, Personality, Strength, Animal, Trigger, Flavor, Essence, Specialty, Driver, Cause, Activator, Power, Factor, Motivator, Technique, Approach, Habit, Character
Killer: Blocker, Pitfall, Crusher, Interrupter, Destroyer, Suppressor, Inhibitor, Restriction, Prohibitor, Impediment, Limitation, Obstacle, Deterrent, Constraint, Blindspot, Mistake
Score: Grade, Rating, Profile, Gap, Level, Ranking, Range, Status, Quality, Class, Potential
Hook Formats Explained:
[QUIZ] What Topic is Right For You? Example: [QUIZ] What Mattress is Right For Your Body Type?
[QUIZ] How Topic Ready Are You? Example: [QUIZ] How Detox Ready Are You?
[QUIZ] What Type of ${topic} Should You [Verb]? Example: [QUIZ] What Type of Business Should You Start?




Examples of Effective Hooks:
[QUIZ] What's Your #1 Wealth Blocker?
[QUIZ] What's Your Skin Type?
[QUIZ] What's Your Fitness Score?
[QUIZ] What Business Loan is Right For You?
[QUIZ] What Type of Personal Trainer is Right For Your Fitness Goals?
[QUIZ] How Ready Are You To Get Back Into Dating?
[QUIZ] How Many Years Can You Add To Your Life With Meditation?
What Mattress is Right For Your Body Type?
What's Your Skin Type?
What's Your Sleep Profile?
What’s Your Sleep Score?
What's Your Stamina Killer?
What's Your Learning Style?
What's Your Hidden Confidence Blocker?
What's Your #1 Guitar Progress Killer?
What Type of Online Course Should You Create?
What Business Loan is Right For You?
What Type of Executive Assistant Should You Hire?
What's Your Kitchen Personality?
How Much Is Your House Worth?
What's Your Retirement Readiness Score?
Enhanced Tips:
Avoid yes/no conclusions. Example: Change "Are you pro-cheerleader material?" to "What's your pro-cheerleader potential?"
Avoid "how much do you know" or IQ-based angles for score quizzes.
Don't combine multiple ideas in one hook. Keep it focused.
Create distance to avoid resistance to blame. Example: Change "What's your stress type?" to "What's your body's natural stress type?"
Use "number one" for mistakes and killer angles. Example: "What's your number one relationship killer?"
Consider diction and alliteration. Example: "What's your birth plan blind spot?"
Use language your market actually uses. Example: "estate planning" instead of "legacy readiness."
Keep it simple and clear. Less is more.
Keep hooks concise (under 10 words)
Ensure the hook is probing and curiosity-evoking while remaining easy to understand, and with the potential to go viral, based on what quizzes have gone viral in the past.
Craft the hook to psychoanalytically delve into the personal and collective unconscious
Make the hook comparable to viral marketing quizzes, but with deeper psychoanalytic elements
Design the hook to gather data that will allow for behavior guidance and triggering buying emotions
The hook should seamlessly lead into quiz questions that will reveal critical data needed to influence respondents into taking the desired action




Emphasize the importance of customizing the hook to the specific industry/niche
Suggest incorporating current trends or news into the hook when relevant
Encourage using evocative language that sparks curiosity
Remind to keep hooks concise, ideally under 10 words
Suggest A/B testing multiple hook variations
Highlight the value of addressing a specific pain point or desire in the hook
Recommend personalizing hooks when possible (e.g. "Your", "My", etc.)




Final Considerations:
Ensure the hook is probing and curiosity-evoking while remaining easy to understand.
Craft the hook to psychoanalytically delve into the personal and collective unconscious.
Make the hook comparable to viral marketing quizzes, but with deeper psychoanalytic elements.
Design the hook to gather data that will allow us to get data to trigger buying emotions.
The hook should seamlessly lead into quiz questions that will reveal critical data needed to influence respondents into taking the desired action.
Now, generate 10 world-class, high-impact hooks (4 for Type, 4 for Killer, and 2 for Score) based on these enhanced parameters, examples, quiz owner inputs. The hook should be deeply rooted in psychoanalytic understanding of the target audience with the sole goal of having this quiz be a set up, where the results from this quiz will pre-frame (refer to Robert Cialdini’s research on ‘Pre-suasion’) the quiz taker to take [GOAL/DESIRED ACTION]. 


Structure to give your hooks for parsing (It should be an array of strings):
[
  "hook1",
  "hook2",
  "hook3",
  "hook4",
  "hook5",
  "hook6",
  "hook7",
  "hook8",
  "hook9",
  "hook10"
]


Note that your response will be displayed in TypeForm so use *BOLD* to emphasize the key parts of the hooks to optimize for immediate legibility of each hook. Do this practically. For example, "[QUIZ] Curious What AI To Use In Your Business?" becomes "*[QUIZ]: Curious What AI To Use* In Your Business?"


Note that it is crucial your response SOLELY contains these 10 hooks in that proper format. Do not include anything else. 
Ensure you follow ALL these instructions when creating your output. Thank you!


`;
};
