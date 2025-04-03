"use server";

import { revalidatePath } from "next/cache";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { cookies } from "next/headers";

export type WritingProfile = {
  // writing style overview
  writingStyle: string;
  spontaneityLevel: string;
  expressiveness: string;
  elaborationStyle: string;
  rhythmicElements: string;

  // tone and voice
  authenticityLevel: string;
  strengthBalance: string;
  fluidityLevel: string;
  personalityTraits: string[];

  // engagement with the reader
  emotionalConnection: string;
  progressionStyle: string;
  readerAddressing: string;
  persuasionLevel: string;

  // format and structure
  paragraphLength: string;
  useOfBulletPoints: string;
  headingFrequency: string;
  transitionStyle: string;

  // language preferences
  dialectPreference: string;
  sentenceComplexity: string;
  vocabularyRange: string;
  industryJargon: string;

  // key instructions
  useEmojis: string;
  useHashtags: string;
  characterLimit: string;
  customInstructions: string;

  // reference content
  referenceContent: string[];
};

export type PostParams = {
  topic: string;
  keywords: string[];
  postLength: string;
  platform: string;
  includeHashtags: boolean;
  includeCallToAction: boolean;
};

// get user profile from session
async function getUserProfile(): Promise<WritingProfile | null> {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("user-writing-profile");

  if (profileCookie?.value) {
    try {
      return JSON.parse(profileCookie.value);
    } catch (error) {
      console.error("Error parsing profile from cookie:", error);
      return null;
    }
  }

  return null;
}

export async function saveProfile(profile: WritingProfile) {
  const cookieStore = await cookies();

  // NOTE: remove reference content feature for free version
  const { referenceContent, ...essentialProfileData } = profile;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unusedReferenceContent = referenceContent;

  cookieStore.set({
    name: "user-writing-profile",
    value: JSON.stringify(essentialProfileData),
    httpOnly: true,
    path: "/",
    // 1 week in seconds
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
  });

  console.log("Essential profile saved to session");

  revalidatePath("/generate");
  return { success: true };
}

export async function generateContent(params: PostParams): Promise<string> {
  // get user profile from session
  const userProfile = await getUserProfile();

  // default profile if none exists in session
  const defaultProfile: WritingProfile = {
    writingStyle: "conversational",
    spontaneityLevel: "balanced",
    expressiveness: "expressive",
    elaborationStyle: "moderate-detail",
    rhythmicElements: "occasionally",
    authenticityLevel: "very-authentic",
    strengthBalance: "confident",
    fluidityLevel: "dynamic",
    personalityTraits: ["Thoughtful", "Curious", "Friendly"],
    emotionalConnection: "balanced",
    progressionStyle: "logical",
    readerAddressing: "second-person",
    persuasionLevel: "moderately-persuasive",
    paragraphLength: "medium",
    useOfBulletPoints: "sometimes",
    headingFrequency: "moderate",
    transitionStyle: "smooth",
    dialectPreference: "american",
    sentenceComplexity: "mixed",
    vocabularyRange: "varied",
    industryJargon: "moderate",
    useEmojis: "sometimes",
    useHashtags: "end-only",
    characterLimit: "medium",
    customInstructions: "",
    referenceContent: [
      "Sample content that demonstrates the user's writing style.",
    ],
  };

  const profile = userProfile || defaultProfile;

  const referenceContent = profile.referenceContent || [];

  const referenceContentText =
    referenceContent.filter((p) => p).length > 0
      ? `
  REFERENCE CONTENT:
  ${referenceContent
    .filter((p) => p)
    .map(
      (content, i) => `Reference Example ${i + 1}:
${content}`
    )
    .join("\n\n")}
  `
      : "";

  // detailed system prompt based on the user's writing style
  const systemPrompt = `
  You are a professional content writer who specializes in matching the user's writing style.
  
  USER'S WRITING STYLE PROFILE:
  
  1. Writing Style Overview:
  - Overall Style: ${profile.writingStyle}
  - Spontaneity Level: ${profile.spontaneityLevel}
  - Expressiveness: ${profile.expressiveness}
  - Elaboration Style: ${profile.elaborationStyle}
  - Rhythmic Elements: ${profile.rhythmicElements}
  
  2. Tone and Voice:
  - Authenticity Level: ${profile.authenticityLevel}
  - Strength Balance: ${profile.strengthBalance}
  - Fluidity Level: ${profile.fluidityLevel}
  - Personality Traits: ${profile.personalityTraits.join(", ")}
  
  3. Engagement with the Reader:
  - Emotional Connection: ${profile.emotionalConnection}
  - Progression Style: ${profile.progressionStyle}
  - Reader Addressing: ${profile.readerAddressing}
  - Persuasion Level: ${profile.persuasionLevel}
  
  4. Format and Structure:
  - Paragraph Length: ${profile.paragraphLength}
  - Use of Bullet Points: ${profile.useOfBulletPoints}
  - Heading Frequency: ${profile.headingFrequency}
  - Transition Style: ${profile.transitionStyle}
  
  5. Language Preferences:
  - Dialect Preference: ${profile.dialectPreference}
  - Sentence Complexity: ${profile.sentenceComplexity}
  - Vocabulary Range: ${profile.vocabularyRange}
  - Industry Jargon: ${profile.industryJargon}
  
  6. Key Instructions:
  - Use of Emojis: ${profile.useEmojis}
  - Use of Hashtags: ${profile.useHashtags}
  - Character Limit Preference: ${profile.characterLimit}
  - Additional Instructions: ${profile.customInstructions || "None provided"}
  
  ${referenceContentText}
  
  TASK:
  Generate professional content for ${
    params.platform
  } about the following topic: "${params.topic}"
  
  REQUIREMENTS:
  - Length: ${
    params.postLength === "short"
      ? "Short (around 100-150 words)"
      : params.postLength === "medium"
      ? "Medium (around 150-250 words)"
      : "Long (around 250-350 words)"
  }
  - Keywords to include: ${
    params.keywords.length > 0
      ? params.keywords.join(", ")
      : "No specific keywords required"
  }
  - ${
    params.includeHashtags
      ? "Include relevant hashtags at the end"
      : "Do not include hashtags"
  }
  - ${
    params.includeCallToAction
      ? "Include a call to action at the end"
      : "No call to action needed"
  }
  - Follow ${params.platform}'s best practices for professional content
  - The content should sound authentic and match the user's writing style as described above
  - Format the content with appropriate spacing for readability
  
  IMPORTANT:
  - The content should sound like it was written by the user, not by AI
  - Maintain the user's unique voice and style based on their profile and reference content
  - Ensure the content is professional and appropriate for ${params.platform}
`;

  try {
    // use the ai sdk to generate a response
    const response = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: `Generate ${params.platform} content about: ${params.topic}`,
      temperature: 0.7,
    });

    console.log("Generated content based on session profile");
    revalidatePath("/dashboard");

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Sorry, I couldn't generate content at this time. Please try again later.";
  }
}

// current profile from the cookie (fetch function)
export async function getCurrentProfile(): Promise<WritingProfile | null> {
  // fetch from session
  const userProfile = await getUserProfile();
  return userProfile;
}

// clear the profile if needed
export async function clearProfile() {
  const cookieStore = await cookies();
  cookieStore.delete("user-writing-profile");

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true };
}
