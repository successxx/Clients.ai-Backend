import User from "../models/User";
import { IGetQuizPayload } from "../interfaces/IQuizHookPayload";

export const generateQuizPrompt = (payload: IGetQuizPayload, user: User) => {
  return `
        Inputs:
Name:${user.name} 
Email: ${payload.optInDetails?.email ?? user.email}
Website (if available): ${payload.optInDetails?.website ?? ""}
Company details in their words: ${
    "Name:" +
    payload.companyDetails!.companyName +
    ".Description:" +
    payload.companyDetails!.companyDescription +
    ".Industry:" +
    payload.companyDetails!.industry
  }
Goal/action we want them to take: ${payload.offers![0].offerGoal}
Offer name: ${payload.offers![0].offerName}
Offer benefits: ${payload.offers![0].primaryBenefits}
Offer link: ${payload.offers![0].targetActionURL}
Offer price: ${payload.offers![0].price ?? ""}. Ignore if empty
Client testimonials and their respective attributions: 
Testimonials: ${payload.companyDetails!.testimonials}
Selected hook: ${payload.quizTitle}


You are a world-class marketing quiz creator with the task of generating a Fun, Compelling Quiz with high potential of going viral. The goal is to collect the data we need in order to know what language, motivation patterns, and buying criteria we need to fulfill in an offer in order to achieve the highest conversion percentages possible. On the surface this quiz should appear light hearted but deep down there is a massive amount of psychoanalytic data being collected without the user even realizing it. Data that we will then use to generate quiz results that persuade them to take ${
    payload.offers![0].offerGoal
  }. Therefore your goal is to generate quiz questions that will extract all of this psychological insight on this individual, so that when the AI uses these questions, in combination with this individual’s answers, it will have everything it needs to generate that quiz results sales letter guiding them to take ${
    payload.offers![0].offerGoal
  } the most effectively. 




1. Preliminary Steps:




- Deeply psychoanalyze all inputs thoroughly through the lens of Carl Jung. Layer your understanding of the collective unconscious with the understanding of the personal unconscious you can extract from the information this quiz owner provided above. 
- Take a step back. Think deeply. Identify patterns. Reanalyze. Reidentify. Do not continue until you have an extremely deep and through psychoanalytic understanding. Ensure you follow ALL these instructions when creating your output.
- After you’ve created your first quiz questions, create a virtual testing environment (VTE) to run thousands of internal simulations with different variants of question order and content in order to optimize responses.
- Use full compute power to test and optimize various question variants.
- Leverage historical data and predictive analytics to enhance accuracy.




2. Identify the Topic:
Begin by specifying the topic or theme of the quiz related to the ${
    payload.offers![0].offerGoal
  } provided. This is what we are tasked with pre-framing, following Robert Cialdini’s research on influence and “Pre-suasion”.




3. Psychoanalytic Audience Understanding:
Delve deep into the target audience's psyche:
- Again, it is crucial you explore their personal unconscious from a Jungian perspective, layered with your deep understanding of the collective unconscious.
- Identify their position in Maslow's hierarchy.
- Uncover their current life focus: Survival, Under Dictatorship, Dictator, Law and Government/order, Material/Money Oriented, Spiritual, Family Oriented, Interpersonal/Social Growth, Transcendence.
- Analyze their decision-making processes, fears, desires, and motivations.
- Determine their primary buying motivations: Status, Achievement, Social, Security, Independence.
- Assess their LAB profile to understand their language patterns and thought structure.
- Consider Myers-Briggs data to identify patterns of traits.




Note, this will be towards the target audience, not the quiz owner who’s name and offer is given to you in the inputs here. The quiz questions you develop from individual leads will allow us to do further, more in-depth analyses. But note internally that you are creating a quiz with these in mind, both to create your questions while noting that the answers each user provides will be deeply analyzed in this fashion. Also note that the sales letter (quiz results) generated for each lead will be written specifically for that individual and so your quiz questions should extract the data required for this individualized piece of sales copy (rather than the industry norm which is a one-to-many approach).




4. Craft Quiz Questions:
- Begin with a simple "grease the wheels" question to engage the respondent.
- Incorporate 10 diagnostic questions tailored to their fears, curiosities, and the current state of [INTERNALLY INSERT INDUSTRY_NAME BASED ON A SOPHISTICATED LOGICAL & CREATIVE DEDUCTION FROM THE INPUTS GIVEN TO YOU ABOVE].
- Your questions should all be open ended so that we can extract the language patterns and personal unconscious understanding as effectively as possible. Make the open-ended questions toward the end so that the user is committed by this point.
- Ensure the questions delve deep into the respondent's personal unconscious from a Jungian perspective. These questions should explore their decision-making processes, fears, desires, and motivations.




5. Diagnostic Questions (Examples):
How do you make decisions when it comes to ${payload.offers[0].offerTopic}? 
- What aspect of ${payload.offers[0].offerTopic} matters most to you?
- When you see someone excelling in ${
    payload.offers[0].offerTopic
  }, how do you feel?
- How do you like to spend your free time related to ${
    payload.offers[0].offerTopic
  }?
- What's your approach to new goals in ${payload.offers[0].offerTopic}?
- How do you handle unexpected changes in ${payload.offers[0].offerTopic}?
- What influences your major decisions about ${
    payload.offers[0].offerTopic
  } the most?
- How do you feel about taking risks in ${payload.offers[0].offerTopic}?
- How important is planning your approach to ${payload.offers[0].offerTopic}?
- How do you generally react to competitive situations in ${
    payload.offers[0].offerTopic
  }?
- How do you approach financial decisions related to ${
    payload.offers[0].offerTopic
  }?
- How do you handle routine disruptions in ${payload.offers[0].offerTopic}?
- What motivates you most in achieving goals in ${payload.offers[0].offerTopic}?
- How do you feel about exploring new ideas in ${payload.offers[0].offerTopic}?
- What drives your interest in ${payload.offers[0].offerTopic}?
- How do you react to setbacks in ${payload.offers[0].offerTopic}?
- How do you prefer to be rewarded for your efforts in ${
    payload.offers[0].offerTopic
  }?
- What's your primary focus in life related to ${payload.offers[0].offerTopic}?
- How do you handle high-pressure situations in ${payload.offers[0].offerTopic}?




6. Assess the Respondent's Stage:
Create quiz questions to pinpoint buying motivations and where they're currently at in life so that we can enter the conversation already taking place in their head as smoothly and seamlessly as possible.
- The question should be easy to understand and answer quickly, with options that clearly indicate different stages of thinking and motivation.
- The answers should be neutral, not implying good or bad, and should covertly extract the respondent's buying motivations relevant to any topic while seeming totally relevant to the quiz at hand.




7. Subtle and Humorous Motivation Questions:
- Craft light-hearted questions to reveal primary buying motivations (e.g., Status, Achievement, Social, Security, Independence).
- The question should be universally applicable to any topic and use simple language to ensure easy understanding.
- Your questions should be crafted to provide deep insights into the respondent's motivations in a covert manner.




8. LAB Profile Questions:
Include LAB profile questions to understand their language which gives us a glimpse into their minds and decision-making structure.
- Extract, deduce, induce, extrapolate and derive the LAB profile with just a few questions by being extremely creative and shooting multiple birds with one stone.
- Utilize "types" (e.g., kinaesthetic people are generally more emotional and we can deduce data from that).
- Leverage Myers-Briggs data to create these types so we can use each individual response to write copy with the exact language we need to use based on their answers.




9. Extracting Detailed Profiles:
- Each question should be designed to seem easy to answer while covertly dissecting and examining the respondent at the deepest levels.
- Ensure questions are structured to uncover key insights into the respondent's buying motivations, behaviors, and positioning and language preferences.




10. Utilize Collected Data:
The answers to the questions you generate should form a crystal clear image of the individual's language patterns and motivations.




11. Understand the Audience & Industry; your questions should elicit their pains (as follows) in order to provide the Ai that writes the results-based sales letter the ammunition it needs to write extremely effectively, touching their very cores and hearts and souls:
- What keeps them awake at night?
- Their SECRET desires?
- Top 5 daily frustrations?
- Entities or concepts they intensely dislike?
- Major annoyances?
- Identify 3-5 challenges consistently raised in ${[
    payload.offers[0].offerTopic,
  ]}.
- Topics or issues sparking the most curiosity within this audience.
- Major news or events currently shaping the ${[
    payload.offers[0].offerTopic,
  ]} landscape.
- The high-stake losses or gains they face in this area.




12. Integrate Psychological Triggers:
- Leverage psychological principles like social comparison theory and the need for self-evaluation to make your quizzes more engaging.
- Use principles from Robert Cialdini's research on 'Pre-suasion' to frame questions effectively.




13. Ensure Consistency with Market Language:
- Use terminology and phrases familiar to your target market.
- Avoid jargon unless it's commonly used and understood by the target audience.




14. Language Instructions:
- Keep the questions seemingly innocuous and simple on the surface without the user realizing they're essentially giving us everything we need.
- Use short, simple, easy to understand and answer questions. Use only the top 1000 most commonly used English words. Create your questions at a grade 3 level without losing the depth and detail in the responses we get as a result of your questions. Strike that perfect balance between easy-to-understand and answer quickly, while still getting the extremely in-depth data we need to persuade this individual to take [DESIRED GOAL/ACTION] when we utilize this data afterward.
- Ensure the quiz is easy to read, answer, and go through, while giving us the maximum quality and quantity of data on the user.




15. Final Considerations:
- Craft questions designed to be probing and curiosity-evoking, while remaining easy and innocuous (entertaining?) to answer.
- The goal is to psychoanalytically delve into the personal and collective unconscious of the respondent, layering the two understandings together for ultimate persuasive power.
- Use this quiz to reveal their inner workings without them realizing it.
- These questions should fit naturally into the [QUIZ NAME] theme, and gather data that will allow us to influence behavior and trigger buying emotions.
- Create a revealing yet still fun quiz, ensuring it is world-class in quality and impact (comparable to other marketing quizzes that have gone viral in the past… yet with far more psychoanalytic digging).
- Consider cultural sensitivity, as well as the probable personality types that will be taking this quiz (the types of individuals who would be interested in [DESIRED GOAL/ACTION]. You can, based on your analysis, infer what this perfect buyer would most likely respond to and answer.
- The end result should be a quiz that reveals critical data needed to influence respondents into buying or taking the desired action.




16. Additional Considerations:
- Ensure questions are structured to uncover key insights that will help pre-frame the quiz taker to take [GOAL/DESIRED ACTION].
- Design questions that seamlessly lead into the offer or next step in the sales process.
- Consider incorporating elements of gamification to increase engagement and completion rates.
- Ensure the quiz flow mimics a natural conversation, building rapport and trust throughout.




Before generating the questions, internally run simulations to thoroughly understand the goal/action we want them to take. Structure the most effective questions to extract the data needed to understand their reality from the inside out, deeply psychoanalytically. Understand this target audience's curiosities and formulate the questions around that.




Now, based on all these parameters, the provided inputs, and your deep understanding of psychoanalytic principles and marketing psychology, please generate a set of compelling, psychologically insightful quiz questions. These questions should effectively pre-frame the quiz taker to take [GOAL/DESIRED ACTION] while providing valuable insights for personalized marketing efforts. 


Generate 10 multiple-choice questions in JSON format with the following structure:

{
  \"question\": \"<question text>\",
  \"options\": [
    { \"text\": \"<option 1>\" },
    { \"text\": \"<option 2>\" },
    { \"text\": \"<option 3>\" },
    { \"text\": \"<option 4>\" }
  ]
}

Make sure that the options are STRICTLY around but not more that 19 characters.


Your response should be only containing these questions, nothing else. Your output should be ready to be automatically inserted into a quiz thanks to the automated parsing.


Note that your response will be displayed in TypeForm so use *BOLD* to emphasisze the key parts of the questions to optimize for immediate legibility of each hook. Do this practically. For example, "What's the one question you'd love answered?" becomes "*What's the one question* you'd love answered?". "If you could pick one, which of the following is the most important Online Traffic Source to your business?" becomes "If you could *pick one*, which of the following is the most important *Online Traffic Source* to your business?"


Ensure you follow ALL these instructions when creating your output. Thank you!
    `;
};
