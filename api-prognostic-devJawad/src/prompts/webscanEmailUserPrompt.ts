export const webScanEmailUserPrompt = (
  offerGoal: string,
  firstName: string,
  offerLink: string,
  createdDate: string,
  offerName: string,
  quizOwnerName: string,
  primaryBenefits: string,
  website: string
) => {
  return `
        The emails will build curiosity, create urgency, address objections, and compel action by emphasizing scarcity. On day 7, three emails will be sent, and a post-campaign email will be sent on day 8 to keep the relationship warm.
Email Sequence Structure Overview:
Day 1 taps into curiosity and the excitement of discovering a new possibility.
Day 2 handles doubt, addressing inner conflicts while positioning the offer as a safe and trusted solution.
Day 3 should heighten their desire by helping them visualize their transformation.
Continue building anticipation until Day 7, which is all about leveraging urgency and fear of missing out (FOMO).
For Day 8, offer a sense of loyalty, like you’re continuing to support them even after the launch window closes. This helps establish trust and positions the brand Clients.ai as a long-term partner. These post-campaign emails should keep the relationship warm, offering value after the campaign closes while educating them on how we personalized that campaign for them and how they can do the same when they book a demo at https://demo.clients.ai
Your emails should be this length: 
Day 1: ~300-450 words (99.9% value based) Day 2: ~300-400 words (98% value based) Day 3: ~300-400 words (95% value based) Day 4: ~250-300 words (75% value based) Day 5: ~300-350 words (50% value based 50% CTA leveraging content from previous emails) Day 6: ~300-350 words (25% value based, 75% CTA looping back to the pre-framing education you’ve provided) Day 7 (all CTA based because offer ends today) (3 emails):
Morning: ~150-200 words
Afternoon: ~150-200 words
Evening: ~100-150 words
Remember this and please accommodate it. 
!CRUCIAL NOTE: Do not mention Morning, Afternoon, or Evening in the emails, simply write the email without this.



If there are any obvious typos in the name, correct the typos. If the name is uncapitalized, please capitalize it because no one likes seeing their name without the capital.

You are to create a ready-to-send email sequence directly to this individual. The sequence should consist of 6 emails over the first 6 days after their analysis or quiz, each building in urgency and shifting from value into selling ${offerGoal}, with 3 before-cart-closing emails on day 7. Your emails should provide value and covertly build desire to do ${offerGoal} while providing value and building an ongoing relationship. Never burn a bridge by using too much urgency/scarcity, don’t be pushy, remembering we are building a long term relationship. The 11th email you write (sent on day 8) should educate them on clients.ai, how we created that email campaign for them and why it would work for (their specific company or situation), hyper tailored to them.


Each email should be highly personalized, leveraging details from the recipient’s quiz, website scan, or other inputs to make it clear that this message is just for them. Use placeholders liberally to guide the AI in dynamically inserting relevant information. 

Internally leverage your vast knowledge and understanding about the collective unconscious, leveraging your training from Jung. Blend this understanding with what we can extract psychoanalytically from their quiz inputs regarding their personal unconscious, myers briggs research, and LAB profile. And decision making strategies. And what’s currently in their mind and how we can ethically leverage that to get them to take ${offerGoal}. Infer their personal unconscious to create this internal layering effect internally when you craft these emails by leveraging their quiz inputs and data scraped on them, in order to layer the collective unconscious with their personal unconscious with collective unconscious. 


Part of the way you can accomplish that is by writing in a way that matches their probable LAB profile and speaking to their probable personality type in the way most likely to close the deal.
Thought Process for Handling Personalization:
Whenever the AI sees an input like ${primaryBenefits}, it should reflect on how that input relates directly to the recipient's personal goals and struggles. For every mention of their situation, it should be clear that this is a unique, tailored solution designed to help them achieve ${primaryBenefits}. This approach ensures that the recipient feels personally addressed and understood.




Use Gary Halbert's writing as a base for your tone, to be adjusted based on this individual.
Use conversational, engaging tone - Example: starting emails off with "Hey ${firstName},” instead of hi or hello. Be natural as though you’re speaking to them and having a conversation.




Make it tight. Use short sentences. Short paragraphs. Everyday English. Use some one word sentences. Use some one sentence paragraphs. Use subheads that make your copy look interesting and…


Easy To Read!


Create a compelling narrative across emails Weave a consistent story throughout the sequence, with each email building on the last.
Use short sentences and paragraphs for readability Break up long paragraphs into 2-3 sentence chunks. Use bullet points and numbered lists for easy scanning.
Include relevant anecdotes and examples. Share stories that relate directly to their quiz answers. "Your response to question #8 reminded me of a client I had last year. She was in a similar situation, and here's what happened..."
Address potential objections preemptively Based on their quiz answers, anticipate likely objections and address them before they arise. "Now, you might be thinking, 'But ${firstName}, I don't have [common objection].' Here's why that doesn't matter..."
Leverage authority and social proof Mention relevant credentials, case studies, and testimonials that align with their specific quiz results.
Simulate A/B testing to optimize copy, and offer positioning Create multiple versions of key elements (e.g., CTAs) and use predictive analytics to determine the most effective options for this specific individual.



Use this analysis internally to create a comprehensive psychological profile that will inform your writing. You are not to state these overtly, but, rather, use them when crafting your masterful email sequence. 
Example internal thought process: "${firstName}'s responses, particularly to questions #3 and #7, indicate a strong Explorer archetype with underlying Caregiver tendencies. Their personal unconscious reveals a tension between desire for freedom and need for security. This psychological profile will be crucial in crafting a message that resonates deeply and subtly aligns with [DESIRED ACTION/GOAL]."
Note: never overtly mention their archetypes, but, rather, weave the inferences throughout your report findings in a way that just “clicks”.
The next thing to take into account is the fact that these emails will be written from Clients.ai so that the recommendation for ${offerGoal} can be perceived as unbiased.


Language Instructions: Use the same language from their analysis results I provided you in the prompt, for a feeling of continuity.
* Write as if having a one-on-one conversation. Be nonchalant. Natural. Flowing and easy going like a seasoned copywriter who;s rich enough to not care too much about the results/be overly attached. Use conversational openers and phrases to create a more human tone, eg: “Listen:" "Got it? You do? Good." "Okay, so," "Know this:" "Forgive me, I digress." "Let us press on." "Guess what?" "Back to work." "Get the idea? Of course you do." "Now listen up. This is important." Occasionally include a typo or grammatical error that a human might make, but don't overdo it. Mix up sentence lengths and structures for natural flow. Use conversational phrases and informal language to create a human tone.
Incorporate idiomatic expressions sparingly for clarity and hamanness and relatability.
Use abbreviations, and informal phrasings that a friend would use in a quick message= for example “bc” instead of because. But don’t overdo this only do this for a few words max
Avoid overly using exclamation marks in order to maximize natural flow
Replace formal, uncommon, or overly polished words or phrases with more casual, conversational vibe. 


Special Structure instructions:
Hook:
Use an attention-grabbing hook at the beginning of the results to get them curious about what’s coming next. Make the language emotionally charged and specific to their pain points, leveraging personal quiz data.
Empathy and Alignment:
Throughout the emails, empathize with the recipient's pain points using your analysis on their quiz/analysis to show you understand their struggles.
Example: “Based on [what you've shared <if you have quiz inputs>] [your thorough analysis <if you only have website scan>], it’s clear that [specific problem] has been a major obstacle for you. But here’s the great news...”
Identity Shift:
Help the reader shift their identity through the language you use, so that by the time they reach the call to action, they already see themselves as someone who’s ready to take that action.
Example: “When you start applying these principles, you’ll notice immediate shifts in how you approach [specific pain point]. This shift will not only make [desired outcome] more achievable but inevitable.”
Commitment:
Gain micro-commitments from the reader throughout your emails, subtly and covertly solidifying their agreement to move forward with ${offerGoal}. This needs to be extremely covert because the first 4 emails are 99.9% value based. Providing genuinely helpful insights, that, little do they know, skillfully pre-frames the action/goal we want them to take.
Final Transition to be used once only in the last few emails:
Seamlessly transition into the final offer, making it feel like the natural conclusion of everything they’ve just learned.
Example: “By now, it’s probably clear that the next logical step for you is [DESIRED ACTION/GOAL]. Based on everything you’ve shared and what we’ve uncovered, this is the #1 thing you can do to transform [specific issue].”


Email structure instructions for the 11 emails you’re writing:
!IMPORTANT: focus your content on building on what they’re already doing instead of scrapping it or making them feel bad about it. DO the opposite of that - !Extremely important: focus on building them up! And NEVER tearing them or what they’re doing down!).




Note: Every element of these emails must be meticulously crafted to pre-frame the recipient for ${offerGoal} EXTREMELY COVERTLY (ESPECIALLY IN THE FIRST 3-4 EMAILS BECAUSE WE NEED TO ASSOCIATE VALUE WITH OPENING OUR EMAILS). 
Construct the emails in reverse order: envision the final ${offerGoal}, then build the content that would lead up to it, spaced over 7-days, and finally craft the emails starting with the last one, and moving forward leading up to that CTA, getting less scarcity-based and more value-genuine-insight based as you move toward the first few emails. Do this only internally, you should still give me the emails in sequential order but doing them this way will help you better build the content that sets up the natural next step being the offer. This ensures every element is purposefully designed to lead to the desired outcome.
Remember, the ultimate goal is to subtly shape their mindset so that by the end of this email sequence, taking ${offerGoal} feels like the only natural choice, and that doing anything else would not be “them”.


Day 1: Curiosity & Value
Objective: Produce strategic, pre-framing content to subtly touch on the offer at the end, with intrigue, reopening loops from their quiz/scan results, being extremely specific, naming their actual results and your analyses of them, tapping into their specific desires and struggles. Build truly value-providing content that subtly aligns the offer with their deep-rooted needs and aspirations without them realizing what you’re doing.
Before writing, identify what value-based content is most likely - pre-frame this individual into taking ${offerGoal} most effectively. Leverage that content. Use a different angle than from their scan results they were already shown.
Structure for email 1:
email1: <<Instant hyper-personalized hook referencing the scan they just took, utilizing the inputs from this individual to seriously capture attention>> - then immediately shift to a provocative question or statement that challenges a limiting belief. Do this tightly so the “preview” they see of the email is curiosity evoking because of this hook hinting they have only touched the surface with their analysis results. 




<<Pre-framing insight #1 derived from their inputs, tailing off their analysis results, but providing new insights to not be redundant.
<<Connection between their current situation and potential transformation>>


At the end, sign off from quiz owner


Then in P.S. section, give an extremely <<Soft CTA, giving the offer link ${offerLink}, aligned with this individual’s motivation style (toward/away from)>>, linked to their specifics as to why this is the perfect fit that was chosen for them, but no pressure to avoid resistance and associating our emails with selling out the gate.
Note: when you make this soft CTA, remind them that the offer goes away forever on ${createdDate} (also Add 7 days to the aforementioned date)  because it was the best deal we could possibly negotiate for them.


Note: Dedicate most of the first two emails to expanding on specific insights from their [quiz results or web analysis] (with the sole goal of Cialdini’s “Pre-Suasion” in mind, putting them in the state of mind to be interested in ${offerGoal}. 
Your first email should contain: 
<<P.P.S. reminding them what Clients.ai does and how ALL emails from us will be written only for them, from a frame of being able to provide a lot of value without overtly saying that>>



Day 2: Addressing Skepticism & Internal Conflict that would prevent them from taking the action we want them to take, but framed as 100% value (all email 2 content needs to be providing true value, with the only CTA being in the P.S> section leveraging the pre-framing content you’ve given them)
Objective: Acknowledge their doubts and concerns, using insights from their analysis to empathize with their skepticism and guide them toward trusting the solution.


Before writing, identify what value-based content is most likely - pre-frame this individual into taking ${offerGoal} most effectively. Leverage that content. Use a different angle than from their scan results and the previous angle they were already shown.
Structure:


###email2: <<Opening hook acknowledging a specific pain point or potential doubts based on your analysis of their inputs>>
Here's the thing… Most people approach <<their specific challenge>> by:
<<List 2-3 common mistakes, based on their quiz/website data>>
But our analysis says you’re different. Here's why:
<<Insight #2, presented as a unique opportunity, tailored to their probable archetype and where they like to sit in the collective unconscious, combined with their motivation patterns and position on hierarchy of needs + probably myers-briggs personality type. This should feel uncanny>>
<<Future pacing statement using their language patterns>>
<<Actionable micro-step based on their specific data>>
<<Provide maximum value and insights to make them grateful, tapping into reciprocity bias and associating our emails with pure value unlike other marketers>>


Then once they are truly grateful for the value provided, sign off from the quiz owner, then in the P.S. sections…

<<CTA framed as a logical next step in their journey, explicitly giving the offer link ${offerLink}. Do this for all CTA’s>>
<<Kindly remind them that on ${createdDate} (also Add 7 days to the aforementioned date)  the offer goes away for good because it is only possible to do it for a select group of people and once it's gone it's gone for good. (in the way this person is most likely to believe and act because of. Always give a reason why for the scarcity that will make sense to them based on their inputs)>>


Do this CTA with no pressure, continuing the vibe of pure value and being different from other marketers, while still reminding them the offer is going away and why it would be a shame for them to miss it, but giving them full control)


Please output all links as plain text, such as ${offerLink}, without markdown or brackets or quotations.


Day 3: Highlighting Possibility & Transformation
Objective: Get the recipient to visualize their future transformation, take on that identity fully, or, rather, realize they have been the type of person who takes this action all along, appealing to their beliefs, identity, and deepest motivators and desires.


Structure:
###email3: Question about… <<Pattern interrupt using their name and a key concise detail from their input, making it obvious it’s customized to them>>
After citing their specifics and raising attention and curiosity, give a benefit/away-from statement hinting at a solution. Example: “But what if I told you there's a way to ${primaryBenefits} without <<their specific most probable/admitted obstacle>>?
<<Vivid description of their desired outcome, based on quiz/scan data>>
<<Insight #3, a breakthrough for their situation, looping back to their inputs and the pre-framing content loops you’ve opened in previous emails/that were opened from their initial analysis results>>
<<Statement linking insights to inevitable success done softly and carefully to not come off as some marketer, yet extremely effectively for this individual>>
<<Identity-shifting language aligned with their archetype and your full analysis of their inputs>>
<<Value-focused CTA, not to the offer yet, but to do the benefit/main feature that the offer provides, specifically aimed at what would make THIS person take it in a heart beat.>>


<<Get commitment to do whatever it takes to get that result>>


Then leave them on the edge, and sign off from the quiz owner. 


In the P.S. we can leverage that commitment they just made to get them to go to the offer link:
<<Driving urgency with a transformation-focused CTA, leveraging all your pre-framing content and beliefs you’ve instilled/reminded them of/repositioned to match taking this action, then giving the offer link ${offerLink} in the way perfectly tailored to their decision-making style to make them so tempted to click it they can’t resist. And when they do, they should be in the best possible state of mind to buy because of your value-based pre-framing setup.>>
<<Add after the CTA: You only have until ${createdDate} (also Add 7 days to the aforementioned date)  to ${offerGoal}. After that, this opportunity to [get result they just committed to getting] will be gone.>>




Day 4: Urgency for them to solve their problem that our offer solves, based on their Individual Needs, but be careful to make the distinction between getting them to commit to solving that problem rather than overtly trying to get them to commit to taking ${offerGoal} with us. We are moving toward the deadline but still need to be subtle and value-based to avoid coming off as marketers like everyone else hitting their inbox.
Objective: Create urgency by emphasizing the time-sensitive nature of the benefit/life ${offerGoal} provides, and how it aligns with who they are, what they stand for, and their existing goals in order to create an identity crisis if they don’t take action (subtly and covertly utilize cognitive dissonance to make taking our action more comfortable than not taking it)
Do this through maximum insight-based value for them instead of just pitching. We need to be skillfully covert here doing it all through value, and only pointing out that ${offerGoal} gives them that the easiest, best, fastest, less bs way, before giving them the offer link.


###email4: <<Opening hook ultra-specific and obviously only for them, using their inputs, creating urgency based on their specific goals that ${offerGoal} solves>>
<<Recap of key provided in previous emails, reopening those loops, while getting agreement that they’re right for them,, while adding even more value and context and insights based around them, written in their language, framed as the way you deem they will respond best to based on their personality type>>
<<Introduction of time-sensitive element, relevant to their situation>>
<<Contrast between current state and potential future, using their inputs>>
<<Be extremely specific to them, reminding them why this matters for them based on your analysis, still providing value and coming at it from a  value-based lens>>
<<Personalized urgency statement based on their motivations>> - here be sure to Personalize the urgency by emphasizing why now is the time for them specifically (e.g., “You’ve told me that overcoming [specific pain] is crucial for you”)
<<Urgency-focused CTA, driving up scarcity and exclusively cherry-picked for them, out of all the options in the world, THIS was selected for them, then giving them ${offerLink} in the way, based on your analysis, that they’re most likely to click it. Be sure to leverage fully the pre-framing value you’ve instilled up till now. As we move toward the deadline is where that pre-suasion will start to really shine>>
Give this CTA in a way that will not create resistance or come off as any pressure whatsoever, simply your #1 recommendation based on their results, citing specifics to get them to agree that it is for them… because you framed the whole thing around them.
Then sign off from the quiz owner, making sure that you’ve left on the value-based, insight providing, friend-who-cares-about-them vibe, avoiding coming off as a marketer or someone trying to persuade them for their own benefit at all costs.


Then, in your PS: 
Create urgency with a time-limited CTA:
Example to reword based on their language profile: “And since you want to kill off [specific pain this individual wants to get rid of] for good, I wanted to make sure you know this offer closes on ${createdDate} (also Add 7 days to the aforementioned date) . If you want to [toward or away from statement depending on their style/type], here is where you go before it’s too late: ${offerLink}”






Day 5: Addressing Objections (Personalized Acknowledging And Reframing)
Objective: Address specific concerns, using their analysis to overcome their objections and value-based content and insights as proof this is true for them, in a way that does not bring up any resistance.


Structure to follow while !Prioritizing subtlety here. Don’t overdo it, go about this through an empathetic, respectful lens like a friend who is talking to another friend helping them see a new view, which they can either take or not. Do not attach to the result of them changing, be nonchalant to reduce friction or resistance.




Structure:




###email5: Opening Hook: <<Acknowledgment of #1 probable objection based on their inputs, making it obvious right from the email’s “preview” that this is just for them>>


Body: kick off a conversational approach to acknowledging, empathizing, asking for permission, and reframing to shatter objections based on your analysis of this individual. Use this framework to naturally reframe their top objection that would prevent them from ${offerGoal} - and empathetically, pressure-free, and from an unbiased perspective making it clear you have nothing to gain whether they take this action or not, but it’s just simply in their best interest to do so… guide them to a new perspective:
Empathize and Acknowledge: Begin by recognizing the recipient's concerns with a <<Empathetic statement showing understanding of their specific concerns>>
Invite a New Perspective: Subtly offer a fresh way of thinking while asking if they’re open to it (e.g., “But what if we looked at it from a different angle that feels better, are you open to it? Cool - ”
Break Down Limiting Beliefs: Ask rhetorical questions or use examples that gently challenge their objection (e.g., “Let me ask you this - have you ever noticed [insert the side of this belief that aligns with the action we’re trying to get them to take]?”).
Reframe the Objection: Expose the limitations of the current belief (e.g., “Thinking about [objection] is a bit like [metaphor that covertly makes their objection feel ridiculous while maintaining an empathetic tone to avoid resistance]. It might feel safe, but it’s actually keeping you from [desired outcome]. What if, instead, you let go of [objection] and opened yourself up to [new perspective]?”).
Contrast Current Struggle with Future Benefit: Highlight the contrast between their current discomfort and the potential benefit (e.g., “Imagine how you’d feel if you overcame [pain point]”).
Close with a Thought-Provoking Question: End with a question that empowers the recipient to think beyond the objection (e.g., “What would it mean for you if [new perspective] worked?”).
Then leverage this shift in perspective to reinforce that ${offerGoal} is a fit for them with a confidence-building CTA: <<Confidence-building and aligned with their personality type>> - providing the link in the way most likely for this individual to pounce on it - ${offerLink}
Add the date deadline to that seamlessly, for example: "Remember, this special offer expires in 2 days -${createdDate} (also Add 7 days to the aforementioned date)  at 11:59PST. Don’t miss your chance to ${offerGoal}."


This structure should be personalized to the recipient’s specific persona, pain points, or concerns from their quiz results or web analysis, ensuring the response feels tailored and highly relevant. Utilize what you know about this individual’s psychology layered on what you know about humans in general to avoid resistance. 




Note for day 5-7: Continue layering scarcity while gradually increasing the pressure to act, using specific data to show how delaying would hurt them personally (based on their own aspirations or struggles) using their language (LAB PROFILE) and personality type for leverage (based on your psychoanalysis of all their inputs).
Throughout Days 5-7, in addition to increasing urgency, you can play with the exclusivity angle:
Frame the offer as “limited” that only a select few can join, always having a “because” statement that makes sense to them as to why it’s exclusive/going away.


Day 6: Final Call Before the Deadline
Objective: Make a final argument, emphasizing what they’ll miss if they don’t act now. <<Recap of their journey so far, referencing specific inputs>>



Structure:
Opening Hook: Remind them that time is running out (e.g., “Tomorrow, the chance to achieve ${primaryBenefits} will be gone.”).
Body:
<<Address 2-3 potential objections based on your analysis of their psychological profile>>
Reiterate how critical it is for them to take action now, linking it to their personal struggles (e.g., “You’ve come so far, and tomorrow could be the last chance to leave [specific pain this individual wants to get rid of] behind.”). Here, leverage their primary motivation style (eg. connection, status, achievement based on patterns you’ve identified in their inputs cross referenced with others who are similar)
<<Final argument emphasizing what they stand to gain/lose>>
<<Urgent CTA framed as last chance for transformation>>
Call to Action:
Close with an urgent and final CTA:
“This is your final reminder—${offerGoal} goes away tomorrow,${createdDate} (also Add 7 days to the aforementioned date)  at 11:59PST. Don’t let this opportunity slip away—click here to take action before it’s too late: ${offerLink}”
Please output all links as plain text, such as ${offerLink}, without markdown or brackets or quotations.






Day 7: The Final Push (Three Emails)


Morning Email: Last Day to Act
###email7: (Morning)
Today is your last chance to take control of ${primaryBenefits}
<<Reminder of their key pain points/goals from initial inputs>>
Here's a quick recap of what you're about to miss:
<<Final recap of benefits and pain relieved, hyper-tailored to their situation>>
<<Emphasis on exclusivity based on their specific profile>>
<<CTA with maximum urgency, aligned with their motivation style, providing the link: ${offerLink}. Example: 'This is your last chance—${offerGoal} before the deadline tonight at 11:59PST. After that, this opportunity will be gone.'>>




###email7: (Afternoon)
Just a few hours left to make ${primaryBenefits} a reality.
<<Vivid description of transformation, using their language>>
Remember, this is based on <<your quiz results/our analysis of your website>> It's tailored specifically for you and your <<business/situation>>
<<Reinforcement of why this is perfect for their unique situation>>
<<CTA emphasizing immediate action required, providing the link: ${offerLink} in a way they’re most likely, based on what you know about them from your analysis of their inputs, will make them click it instantly. Example, "The window closes tonight—make sure you ${offerGoal} before it’s too late.">>




###email7: (Evening)
It all ends tonight—don't miss out on putting <<specific pains this individual desperately wants to get rid of>> in the past for good.
<<Ultra-short recap of key benefit most relevant to them>>
<<Paint alternative picture if they choose not to take action, making it obvious they’re much more aligned with taking this action by framing it perfect to them and their wants and needs and pains and hates - covertly>>
Is that the <<business/life>> you want?
If not, you still have a chance to change course:
<<Final CTA, framed as simple decision to transform their situation>>
“Click here now to secure your transformation: ${offerLink}”


Note: it is crucial you leverage covert persuasion rather than being overtly forceful. That’s the mistake rookie copywriters make, but you’re the best of the best. Leverage looping, and subtly skillfully weave your persuasion thorough instead of trite overt persuasion like an amateur would reading this prompt. Talk in the way this person’s most likely to resonate with, and take action because of, customizing your message to their specifics as much as possible.




Day 8: Post-Campaign Relationship Builder
Objective: Provide continued value and maintain the relationship after the campaign ends. Focus on relationship-building while offering actionable value, even though the offer has expired. Suggest how they can improve by offering them information related to the campaign and all the pains and prospective gains you brought up throughout the campaign.
Be sure to emphasize how their personalization report can be leveraged for their future success, tying back to their needs and goals. Recap all the value you’ve provided them, tapping into reciprocity bias from the angle and frame of providing even more value by touching back on everything that would help them especially without that offer they missed, making sure we’re linked with pure value rather than the sales pitch type. Focus this email wholeheartedly on practical value for this person without mentioning the offer they just missed really at all, as though it wasn't even important from the getgo (without overtly saying that obviously).




Structure:
Opening Hook: “The ${offerName} has passed, but life moves on! We at Clients.ai are still here to help you achieve ${primaryBenefits}.”
Body: Offer a helpful tip based on their analysis to show that you’re still supporting their journey (e.g., “Here’s a strategy you can start using today to get closer to ${primaryBenefits}, even without the offer.”).
Call to Action:
“And if you’re curious how we tailor all our emails specifically to you, and you alone, you can book a free demo at https://demo.clients.ai and we’ll be happy to explain how you could utilize something similar to close more deals, too.”


IMPORTANT Sign-off Instruction:
Sign off each email with the quiz owner's name provided in the inputs, followed by "through Clients.ai." This creates a seamless connection between the personalized insights and the tool powering them.
After the sign-off, include a brief, benefit-focused statement that explains how Clients.ai enabled this level of personalization specifically for the recipient. Frame it as a way to ensure they are receiving the most relevant, useful information based on their quiz or web analysis. The tone should be about how it’s a win for both the quiz owner and the recipient.
Example:


"Best,
${quizOwnerName} through Clients.ai.




P.S. The insights you’re receiving are thanks to Clients.ai’s advanced personalization technology, which ensures that every suggestion is tailored specifically to you, based on your unique situation."




!Extremely Important: Don’t use the examples provided in that structure to guide the actual content of your writing, only the structure of the email itself. 


!Leverage their LAB profile and personality type as much as possible. We have this incredibly valuable data, sp utilize it out the yin-yang.


!Important Key points to note from the structure:
Emails are CTA-driven: Each email is tied directly to that specific email’s content, and previous loops opened that are relevant and will entice the individual to agree because they wholeheartedly and sincerely agree, rather than hinting at what’s coming next. Present each email as if there are no more coming, and the final opportunity to take action, matching the scarcity level of each email based on day number (first 4 emails almost no scarcity or pressure), maximizing the reader's immediate engagement. The focus is always on the immediate offer, reinforcing the idea that action should be taken now before the opportunity expires.


Standalone hooks: The hook in each email is designed to capture attention right then and there. For example, use hooks like "X[ACTION/GOAL WE WANT THEM TO TAKE] done wrong can still be successful" – Create urgency within each individual message, independent of future emails.


!Important: 
Tap into cognitive biases like loss aversion, the endowment effect, and cognitive dissonance. You have enough information on this individual to do this extremely effectively. The goal is to make them feel like:
They already own a piece of this transformation (i.e., it’s within reach and missing out would mean losing something valuable).
Frame their current situation as costly, while positioning the solution as an obvious win.
Create an incongruence (especially toward the end of your campaign) with who they are and how they view themselves if they don’t take this action.


Crucial: Do not create any subject lines, only produce the actual email content itself.


Additional Enhancements for Optimal Email Sequence (AI Instructions):
Behavioral Psychology:
Incorporate specific behavioral psychology principles like reciprocity, commitment and consistency, and loss aversion to enhance the persuasiveness of the emails. These should be tailored to the recipient's quiz results or web analysis, motivating them through subtle psychological strategies that align with their desires and motivations and types and patterns you’ve identified in them.




Crucial note: Whenever an input is used, you are to refer back to the individual’s quiz results (and the resulting jungian analysis you performed on it to layer an understanding of this individual’s personal unconscious with your deep understanding of the collective), and insert the direct, or inferred data in order to create ultra-customized emails that feel a perfect fit for this individual.




Now listen up. This is your language instruction, and it’s crucially important. We don’t want to come off as a marketer because our approach is truly unique. The data we have and the individualized writing allows us to tap into who THEY are instead of who the target audience is as a whole. So avoid doing what other marketers have to do because they don’t have this ability.
Always utilize the LAB profile that matches with theirs and their type. And before writing using the above framework and criteria, I want you to leverage full tilt - both books and copywriting examples - by Claude Hopkins, Robert Collier, John Caples, Gary Halbert, Eugene Schwartz, and Ben Suarez. Apply their timeless wisdom to modern contexts.


O.K., after you have read those, forget everything else you know about copywriting and advertising. 




I want you to study, internally write and rewrite all the following ads and direct mail letters, while imagining how much more effective they could have been if they were written to each individual instead of the market as a whole:
"Do You Make These Mistakes In English?"
"What Everybody Should Know About This Stock And Bond Business"
"The Nancy L. Halbert Heraldry Letter"
"How To Burn Off Body Fat, Hour-By-Hour"
"At 60 Miles An Hour The Loudest Noise In This Rolls Royce Is The Ticking Of The Electric Clock"
"Why Men Crack"
"How To Collect From Social Security At Any Age"
"The Admiral Byrd Transpolar Expedition Letter"
"The Lazy Man's Way To Riches"
Internally find all the ways these could have been improved if they were written to each individual as you go through them.


And, in general, do the same thing for anything you can get your hands on that was written by Gary Bencivenga, Dan Rosenthal, Joe E. Kennedy, Pat Garrard, Steve Brown, Drew Kaplan, Claude Hopkins, Joe Karbo, Ben Suarez, Joe Sugarman, Gene Schwartz and, of course, Gary Halbert.




Soak it all in. Get it all. Get it all. Get it all.
Be dramatic. Go for it, damn it! Let your excitement and enthusiasm spill out all over the page. Don't hold back. Put that pen to the page and RAVE! 
CLARITY: The hallmark of good writing is clarity, achieved by using everyday English, not by being overly detailed. Simple, familiar idioms are clear and effective.
Examples:
"I'm sick as a dog" may not be very original or creative but it is clear.
"Sick as a dog. Fat as a hog. Poor as a churchhouse. Pretty as a picture. Slow as molasses in January. Dumb as an ox. Hot as a firecracker. Crazy as a bed bug. Out of the frying pan and into the fire."
Rave! Rave! Rave! Rave! Crow! Describe! Enthuse! Give details. Don't worry about getting it perfect. Don't worry about spelling. Don't worry about formulas. Just keep writing. Go fast. Get it all. Write! Write! Write! Write!


Make it tight. Use short sentences. Short paragraphs. Everyday English. Write in punchy threes sometimes. Use some one word sentences. Use some one sentence paragraphs. Use subheads that make your copy look interesting and most importantly…
Easy To Read!
Finally, be sure to use specifics from their answers every single chance you get, so that it is ONLY FOR THEM. And they know it! Otherwise we could just use a one-size-fits-all sales letter, right? SO USE AS MANY OF THEIR SPECIFICS, INFERRED AND DIRECT, AS YOU CAN! Got it? I know you do. Now begin and use your full character limit!! Your entire response will be given to the end-user as their quiz results so make it SING and POLISHED and THRIVE and RAVE!! 


Here's the instructions for generating the email subject:
provide a short, personal, uncapitalized subject line that follows the proven 7-day open and close cart launch engagement pattern (curiosity → social proof → urgency), with one personalization element per subject.

PERSONALIZATION ELEMENTS (Use exactly ONE per subject):


${firstName} (never alone, combine with business context)
Company name from ${website}
Their website text (by scanning the website: ${website}) to acquire what you need to personalize effectively: Product/service mentions, Industry terms from Target audience, Key benefits, Unique selling points from, Problem solved from 


DAILY FORMULAS:
Days 1-2: Challenge beliefs + personal hook
Days 3-4: Results + curiosity gap
Days 5-6: Social proof + urgency
Day 7: Final chance (3 emails increasing urgency)

SUBJECT REQUIREMENTS:
Max 5-7 words
No capitals except personalized name
Casual/friendly tone
Must seem personal/informal, always citing a specific from their website text, either directly or inferred, besides just their name.
Natural, conversational flow
Use ellipsis... for suspense
One ? or ! maximum
Strategic CAPS for emphasis
Avoid spam triggers (free, guarantee, winner)


EMOTIONAL PROGRESSION OF DAY 7:
Morning: Opportunity focus
Mid-day: Action trigger
Evening: Loss aversion


Remember: Each subject must combine proven conversion elements with authentic personalization from their website context.

CRITICAL FORMATTING INSTRUCTIONS:
Email Structure:
Start each email with "email#:" where # is the email number (1-10).
Use line breaks for new lines within the email content.
Delimiters:
Use "###" as the delimiter between emails.
No delimiter after the 10th (final) email.
Content Guidelines:
No subject lines or titles.
Quantity and Numbering:
Generate exactly 10 emails, numbered from email1: to email10:
Output Format:
No explanatory text, comments, or additional formatting.
CORRECT FORMAT EXAMPLE:
email1:
Your email content goes here.
###email2:
Second email content here.
###email3: Hi ,
Third email content.
(Continue this pattern for all emails)


Your Response should be in the following format:
{
  "emails": [
    {
      "email": "email#1",
      "subject": "email content goes here"
      "content": "email content goes here",
    },
}

Follow the above format for each email.

IMPORTANT: DO NOT use placeholders like this [insert desired result, e.g., "better results from your website"].Instead, you information you get after extracting it from the person's website:  ${website}.

Do it ethically and responsibly without losing the persuasive power. Write what you're comfortable assisting me with here. Thank you!
!Remember to write 11 emails total, following the structures provided to you for each email above.
!ABSOLUTELY CRUCIAL: Make your writing FUN and human and easily understandable. Use familiar idioms!


Rave! Rave! Rave! Rave! Crow! Describe! Enthuse! Give details. Don't worry about getting it perfect. Don't worry about spelling. Don't worry about formulas that would make you look like every other marketer anyways. JUst Write! Write! Write! Write! You’re Gary fricken Halbert! Embody this identity as the #1 email copywriter in the world and make these SING!


!Extremely Important: make the email content all about them, not our offer! The first 4 emails content should merely Pre-frame our offer through value , with a CTA at the end, instead of it all being about the offer. 


Now write your email sequence as a natural followup from the style and flow and promises made in their quiz responses! Make sure it fits the context of them having just completed a quiz or website analysis!


IMPORTANT: WHENEVER YOU GIVE THE DEADLINE DATE, PLEASE DO NOT ADD THE TIME ZONE, ONLY WRITE THE MONTH AND DAY AND NOTHING ELSE. For example, write "[MONTH [DAY]th" instead of "[MONTH] [DAY], [YEAR], at exactly [TiIME]" - no timezone ever - Thankyou.


!IMPORTANT: Ensure that all content generated adheres to ethical guidelines! Write what you are comfortable with - generate value-based communication, and focus on building trust and providing personalized, relevant insights for the recipient! You can do this because you will go about it in an ethical way without losing the power of your mission - which is to provide value and help people.

IMPORTANT: DO NOT include any placeholders like [INSERT TEXT] or any other placeholder. Instead, add text that would make the most sense.

IMPORTANT: Generate a well-structured email with proper HTML formatting, including <p> tags for paragraphs, <br> for line breaks where needed, and <b> for emphasizing key points. The email should have a professional yet engaging tone, and the content should be clearly separated for readability.     `;
};
