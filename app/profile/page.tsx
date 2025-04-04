"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/global/Stepper";
import { InfoDialog } from "@/components/global/InfoDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  BookOpen,
  Feather,
  MessageSquare,
  Type,
  Globe,
  Settings,
} from "lucide-react";
import { saveProfile } from "../actions";
import { pageVariants } from "@/lib/animation";

const TOTAL_STEPS = 7;

// profile data structure
type ProfileData = {
  // step 1: writing style overview
  writingStyle: string;
  spontaneityLevel: string;
  expressiveness: string;
  elaborationStyle: string;
  rhythmicElements: string;

  // step 2: tone and voice
  authenticityLevel: string;
  strengthBalance: string;
  fluidityLevel: string;
  personalityTraits: string[];

  // step 3: engagement with the reader
  emotionalConnection: string;
  progressionStyle: string;
  readerAddressing: string;
  persuasionLevel: string;

  // step 4: format and structure
  paragraphLength: string;
  useOfBulletPoints: string;
  headingFrequency: string;
  transitionStyle: string;

  // step 5: language preferences
  dialectPreference: string;
  sentenceComplexity: string;
  vocabularyRange: string;
  industryJargon: string;

  // step 6: key instructions
  useEmojis: string;
  useHashtags: string;
  characterLimit: string;
  customInstructions: string;

  // step 7: reference content
  referenceContent: string[];
};

const stepIcons = [
  <Feather key="feather" className="h-6 w-6" />,
  <MessageSquare key="message" className="h-6 w-6" />,
  <BookOpen key="book" className="h-6 w-6" />,
  <Type key="type" className="h-6 w-6" />,
  <Globe key="globe" className="h-6 w-6" />,
  <Settings key="settings" className="h-6 w-6" />,
  <Feather key="feather2" className="h-6 w-6" />,
];

export default function ProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    // step 1: writing style overview
    writingStyle: "",
    spontaneityLevel: "",
    expressiveness: "",
    elaborationStyle: "",
    rhythmicElements: "",

    // step 2: tone and voice
    authenticityLevel: "",
    strengthBalance: "",
    fluidityLevel: "",
    personalityTraits: [],

    // step 3: engagement with the reader
    emotionalConnection: "",
    progressionStyle: "",
    readerAddressing: "",
    persuasionLevel: "",

    // step 4: format and structure
    paragraphLength: "",
    useOfBulletPoints: "",
    headingFrequency: "",
    transitionStyle: "",

    // step 5: language preferences
    dialectPreference: "",
    sentenceComplexity: "",
    vocabularyRange: "",
    industryJargon: "",

    // step 6: key instructions
    useEmojis: "",
    useHashtags: "",
    characterLimit: "",
    customInstructions: "",

    // step 7: reference content
    referenceContent: ["", "", ""],
  });

  // check if current step is complete
  const isCurrentStepComplete = () => {
    switch (currentStep) {
      case 1:
        return (
          profileData.writingStyle &&
          profileData.spontaneityLevel &&
          profileData.expressiveness &&
          profileData.elaborationStyle &&
          profileData.rhythmicElements
        );
      case 2:
        return (
          profileData.authenticityLevel &&
          profileData.strengthBalance &&
          profileData.fluidityLevel &&
          profileData.personalityTraits.length > 0
        );
      case 3:
        return (
          profileData.emotionalConnection &&
          profileData.progressionStyle &&
          profileData.readerAddressing &&
          profileData.persuasionLevel
        );
      case 4:
        return (
          profileData.paragraphLength &&
          profileData.useOfBulletPoints &&
          profileData.headingFrequency &&
          profileData.transitionStyle
        );
      case 5:
        return (
          profileData.dialectPreference &&
          profileData.sentenceComplexity &&
          profileData.vocabularyRange &&
          profileData.industryJargon
        );
      case 6:
        return (
          profileData.useEmojis &&
          profileData.useHashtags &&
          profileData.characterLimit
        );
      case 7:
        // at least one reference content is required
        // TODO: ensure that only applies for paid version - should be disabled altogether on free version
        return profileData.referenceContent.some(
          (content) => content.trim() !== ""
        );
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // save profile
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // filter out empty reference content
      const filteredReferenceContent = profileData.referenceContent.filter(
        (content) => content.trim() !== ""
      );

      const finalProfileData = {
        ...profileData,
        referenceContent: filteredReferenceContent,
      };

      // save profile to session
      // TODO: free version or paid check
      await saveProfile(finalProfileData);

      console.log("Profile saved:", finalProfileData);

      // redirect to page to generate content
      router.push("/generate");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // checkbox change for personality traits
  const handlePersonalityTraitChange = (trait: string, checked: boolean) => {
    if (checked) {
      setProfileData({
        ...profileData,
        personalityTraits: [...profileData.personalityTraits, trait],
      });
    } else {
      setProfileData({
        ...profileData,
        personalityTraits: profileData.personalityTraits.filter(
          (t) => t !== trait
        ),
      });
    }
  };

  // reference content change
  const handleReferenceContentChange = (index: number, value: string) => {
    const updatedReferenceContent = [...profileData.referenceContent];
    updatedReferenceContent[index] = value;
    setProfileData({
      ...profileData,
      referenceContent: updatedReferenceContent,
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Writing Style Overview";
      case 2:
        return "Tone and Voice";
      case 3:
        return "Engagement with the Reader";
      case 4:
        return "Format and Structure";
      case 5:
        return "Language Preferences";
      case 6:
        return "Key Instructions";
      case 7:
        return "Reference Content";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about your overall writing style and approach.";
      case 2:
        return "Help us understand the tone and voice that makes your writing unique.";
      case 3:
        return "Tell us how you engage with your readers through your writing.";
      case 4:
        return "Tell us about your preferences for formatting and structuring your content.";
      case 5:
        return "Tell us about your language preferences and style.";
      case 6:
        return "Provide specific instructions for how your content should be formatted.";
      case 7:
        return "Provide examples of your writing to help the AI better understand your style.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
              Your Writing Profile
            </h1>
            <p className="text-xl text-gray-600 font-serif leading-relaxed max-w-2xl mx-auto">
              Help us understand your unique writing style so our AI can
              generate content that sounds like you wrote it.
            </p>
          </div>

          <Stepper
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            className="mb-8"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8 border-0 shadow-lg overflow-hidden">
                <div className="bg-green-800 text-white py-6 px-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      {stepIcons[currentStep - 1]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold">
                        {getStepTitle()}
                      </h2>
                      <p className="text-green-100">{getStepDescription()}</p>
                    </div>
                  </div>
                </div>

                {currentStep === 1 && (
                  <>
                    <CardContent className="p-8 space-y-6 font-serif">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          What best describes your overall writing style?
                        </Label>
                        <RadioGroup
                          value={profileData.writingStyle}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              writingStyle: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="formal" id="formal" />
                            <Label htmlFor="formal" className="text-base">
                              Formal and professional
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="conversational"
                              id="conversational"
                            />
                            <Label
                              htmlFor="conversational"
                              className="text-base"
                            >
                              Conversational and friendly
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="technical" id="technical" />
                            <Label htmlFor="technical" className="text-base">
                              Technical and detailed
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="storytelling"
                              id="storytelling"
                            />
                            <Label htmlFor="storytelling" className="text-base">
                              Narrative and storytelling
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="persuasive"
                              id="persuasive"
                            />
                            <Label htmlFor="persuasive" className="text-base">
                              Persuasive and compelling
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How spontaneous is your writing flow?
                        </Label>
                        <Select
                          value={profileData.spontaneityLevel}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              spontaneityLevel: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select spontaneity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="highly-structured">
                              Highly structured and planned
                            </SelectItem>
                            <SelectItem value="somewhat-structured">
                              Somewhat structured with room for spontaneity
                            </SelectItem>
                            <SelectItem value="balanced">
                              Balanced between structure and spontaneity
                            </SelectItem>
                            <SelectItem value="mostly-spontaneous">
                              Mostly spontaneous with minimal structure
                            </SelectItem>
                            <SelectItem value="completely-spontaneous">
                              Completely spontaneous and free-flowing
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How expressive is your writing tone?
                        </Label>
                        <Select
                          value={profileData.expressiveness}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              expressiveness: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select expressiveness level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reserved">
                              Reserved and understated
                            </SelectItem>
                            <SelectItem value="moderate">
                              Moderately expressive
                            </SelectItem>
                            <SelectItem value="expressive">
                              Expressive and animated
                            </SelectItem>
                            <SelectItem value="highly-expressive">
                              Highly expressive and passionate
                            </SelectItem>
                            <SelectItem value="dramatic">
                              Dramatic and intense
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How do you typically elaborate on ideas?
                        </Label>
                        <RadioGroup
                          value={profileData.elaborationStyle}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              elaborationStyle: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="concise" id="concise" />
                            <Label htmlFor="concise" className="text-base">
                              Concise and to the point
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="moderate-detail"
                              id="moderate-detail"
                            />
                            <Label
                              htmlFor="moderate-detail"
                              className="text-base"
                            >
                              Moderate detail on key points
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="thorough" id="thorough" />
                            <Label htmlFor="thorough" className="text-base">
                              Thorough and comprehensive
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="meandering"
                              id="meandering"
                            />
                            <Label htmlFor="meandering" className="text-base">
                              Meandering and exploratory
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="example-driven"
                              id="example-driven"
                            />
                            <Label
                              htmlFor="example-driven"
                              className="text-base"
                            >
                              Example-driven with stories
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Do you use rhythmic or repetitive elements in your
                          writing?
                        </Label>
                        <RadioGroup
                          value={profileData.rhythmicElements}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              rhythmicElements: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="never" id="never" />
                            <Label htmlFor="never" className="text-base">
                              Never or rarely
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="occasionally"
                              id="occasionally"
                            />
                            <Label htmlFor="occasionally" className="text-base">
                              Occasionally for emphasis
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="sometimes" id="sometimes" />
                            <Label htmlFor="sometimes" className="text-base">
                              Sometimes in key sections
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="frequently"
                              id="frequently"
                            />
                            <Label htmlFor="frequently" className="text-base">
                              Frequently throughout
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="signature-style"
                              id="signature-style"
                            />
                            <Label
                              htmlFor="signature-style"
                              className="text-base"
                            >
                              It&#39;s a signature part of my style
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <CardContent className="p-8 space-y-6 font-serif">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How authentic and raw is your writing voice?
                        </Label>
                        <Select
                          value={profileData.authenticityLevel}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              authenticityLevel: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select authenticity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="polished">
                              Polished and refined
                            </SelectItem>
                            <SelectItem value="balanced">
                              Balanced between polished and raw
                            </SelectItem>
                            <SelectItem value="mostly-authentic">
                              Mostly authentic with some polish
                            </SelectItem>
                            <SelectItem value="very-authentic">
                              Very authentic and genuine
                            </SelectItem>
                            <SelectItem value="completely-raw">
                              Completely raw and unfiltered
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How would you describe the strength of your writing
                          voice?
                        </Label>
                        <RadioGroup
                          value={profileData.strengthBalance}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              strengthBalance: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="gentle" id="gentle" />
                            <Label htmlFor="gentle" className="text-base">
                              Gentle and soft-spoken
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="moderate" id="moderate" />
                            <Label htmlFor="moderate" className="text-base">
                              Moderate and balanced
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="confident" id="confident" />
                            <Label htmlFor="confident" className="text-base">
                              Confident and assertive
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="strong" id="strong" />
                            <Label htmlFor="strong" className="text-base">
                              Strong and authoritative
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="powerful" id="powerful" />
                            <Label htmlFor="powerful" className="text-base">
                              Powerful and commanding
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How fluid and dynamic is your writing voice?
                        </Label>
                        <Select
                          value={profileData.fluidityLevel}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              fluidityLevel: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select fluidity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consistent">
                              Consistent and steady
                            </SelectItem>
                            <SelectItem value="mostly-consistent">
                              Mostly consistent with some variation
                            </SelectItem>
                            <SelectItem value="balanced">
                              Balanced between consistency and variation
                            </SelectItem>
                            <SelectItem value="dynamic">
                              Dynamic and varied
                            </SelectItem>
                            <SelectItem value="highly-dynamic">
                              Highly dynamic and constantly shifting
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Which personality traits come through in your writing?
                          (Select all that apply)
                        </Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {[
                            "Thoughtful",
                            "Humorous",
                            "Analytical",
                            "Empathetic",
                            "Direct",
                            "Optimistic",
                            "Skeptical",
                            "Passionate",
                            "Curious",
                            "Practical",
                            "Inspirational",
                            "Methodical",
                            "Creative",
                            "Authoritative",
                            "Friendly",
                            "Reflective",
                          ].map((trait) => (
                            <div
                              key={trait}
                              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                            >
                              <Checkbox
                                id={trait.toLowerCase()}
                                checked={profileData.personalityTraits.includes(
                                  trait
                                )}
                                onCheckedChange={(checked) =>
                                  handlePersonalityTraitChange(
                                    trait,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={trait.toLowerCase()}
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {trait}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <CardContent className="p-8 space-y-6 font-serif">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How do you create emotional connection with readers?
                        </Label>
                        <RadioGroup
                          value={profileData.emotionalConnection}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              emotionalConnection: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="factual" id="factual" />
                            <Label htmlFor="factual" className="text-base">
                              Factual with minimal emotional appeal
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="subtle" id="subtle" />
                            <Label htmlFor="subtle" className="text-base">
                              Subtle emotional undertones
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="balanced" id="balanced" />
                            <Label htmlFor="balanced" className="text-base">
                              Balanced facts and emotional appeal
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="emotional" id="emotional" />
                            <Label htmlFor="emotional" className="text-base">
                              Emotionally engaging throughout
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="deeply-emotional"
                              id="deeply-emotional"
                            />
                            <Label
                              htmlFor="deeply-emotional"
                              className="text-base"
                            >
                              Deeply emotional and moving
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How do your ideas typically progress in your writing?
                        </Label>
                        <Select
                          value={profileData.progressionStyle}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              progressionStyle: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select progression style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">
                              Linear and sequential
                            </SelectItem>
                            <SelectItem value="structured">
                              Structured with clear sections
                            </SelectItem>
                            <SelectItem value="logical">
                              Logical with connected arguments
                            </SelectItem>
                            <SelectItem value="exploratory">
                              Exploratory with related tangents
                            </SelectItem>
                            <SelectItem value="organic">
                              Organic and naturally evolving
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How do you typically address your readers?
                        </Label>
                        <RadioGroup
                          value={profileData.readerAddressing}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              readerAddressing: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="third-person"
                              id="third-person"
                            />
                            <Label htmlFor="third-person" className="text-base">
                              Third-person (they, readers)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="second-person"
                              id="second-person"
                            />
                            <Label
                              htmlFor="second-person"
                              className="text-base"
                            >
                              Second-person (you, your)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="first-person-inclusive"
                              id="first-person-inclusive"
                            />
                            <Label
                              htmlFor="first-person-inclusive"
                              className="text-base"
                            >
                              First-person inclusive (we, us, our)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="mixed" id="mixed" />
                            <Label htmlFor="mixed" className="text-base">
                              Mixed approach depending on context
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="impersonal"
                              id="impersonal"
                            />
                            <Label htmlFor="impersonal" className="text-base">
                              Impersonal with no direct addressing
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How persuasive is your writing typically?
                        </Label>
                        <Select
                          value={profileData.persuasionLevel}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              persuasionLevel: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select persuasion level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="informative">
                              Informative without persuasion
                            </SelectItem>
                            <SelectItem value="gently-persuasive">
                              Gently persuasive
                            </SelectItem>
                            <SelectItem value="moderately-persuasive">
                              Moderately persuasive
                            </SelectItem>
                            <SelectItem value="strongly-persuasive">
                              Strongly persuasive
                            </SelectItem>
                            <SelectItem value="highly-persuasive">
                              Highly persuasive and compelling
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <CardContent className="p-8 space-y-6 font-serif">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          What paragraph length do you typically use?
                        </Label>
                        <RadioGroup
                          value={profileData.paragraphLength}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              paragraphLength: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="very-short"
                              id="very-short"
                            />
                            <Label htmlFor="very-short" className="text-base">
                              Very short (1-2 sentences)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="short" id="short" />
                            <Label htmlFor="short" className="text-base">
                              Short (2-3 sentences)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium" className="text-base">
                              Medium (3-5 sentences)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="long" id="long" />
                            <Label htmlFor="long" className="text-base">
                              Long (5-7 sentences)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="varied" id="varied" />
                            <Label htmlFor="varied" className="text-base">
                              Varied lengths for rhythm
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How do you use bullet points or lists?
                        </Label>
                        <Select
                          value={profileData.useOfBulletPoints}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              useOfBulletPoints: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select bullet point usage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">
                              Never or rarely
                            </SelectItem>
                            <SelectItem value="occasionally">
                              Occasionally for key points
                            </SelectItem>
                            <SelectItem value="sometimes">
                              Sometimes for clarity
                            </SelectItem>
                            <SelectItem value="frequently">
                              Frequently throughout
                            </SelectItem>
                            <SelectItem value="extensively">
                              Extensively as a core format
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How frequently do you use headings and subheadings?
                        </Label>
                        <RadioGroup
                          value={profileData.headingFrequency}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              headingFrequency: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="never" id="headings-never" />
                            <Label
                              htmlFor="headings-never"
                              className="text-base"
                            >
                              Never or rarely
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="main-sections"
                              id="main-sections"
                            />
                            <Label
                              htmlFor="main-sections"
                              className="text-base"
                            >
                              Only for main sections
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="moderate"
                              id="headings-moderate"
                            />
                            <Label
                              htmlFor="headings-moderate"
                              className="text-base"
                            >
                              Moderate use for clarity
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="frequent" id="frequent" />
                            <Label htmlFor="frequent" className="text-base">
                              Frequent use throughout
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="extensive" id="extensive" />
                            <Label htmlFor="extensive" className="text-base">
                              Extensive hierarchical structure
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How do you transition between ideas?
                        </Label>
                        <Select
                          value={profileData.transitionStyle}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              transitionStyle: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select transition style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="abrupt">
                              Abrupt with clear breaks
                            </SelectItem>
                            <SelectItem value="minimal">
                              Minimal transitions
                            </SelectItem>
                            <SelectItem value="standard">
                              Standard transitional phrases
                            </SelectItem>
                            <SelectItem value="smooth">
                              Smooth and flowing connections
                            </SelectItem>
                            <SelectItem value="elaborate">
                              Elaborate bridges between ideas
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <CardContent className="p-8 space-y-6 font-serif">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Which dialect do you prefer?
                        </Label>
                        <RadioGroup
                          value={profileData.dialectPreference}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              dialectPreference: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="american" id="american" />
                            <Label htmlFor="american" className="text-base">
                              American English
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="british" id="british" />
                            <Label htmlFor="british" className="text-base">
                              British English
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="australian"
                              id="australian"
                            />
                            <Label htmlFor="australian" className="text-base">
                              Australian English
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="canadian" id="canadian" />
                            <Label htmlFor="canadian" className="text-base">
                              Canadian English
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="neutral" id="neutral" />
                            <Label htmlFor="neutral" className="text-base">
                              Neutral/International English
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How complex are your sentences typically?
                        </Label>
                        <Select
                          value={profileData.sentenceComplexity}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              sentenceComplexity: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select sentence complexity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">
                              Simple and straightforward
                            </SelectItem>
                            <SelectItem value="mostly-simple">
                              Mostly simple with some complexity
                            </SelectItem>
                            <SelectItem value="mixed">
                              Mixed simple and complex
                            </SelectItem>
                            <SelectItem value="mostly-complex">
                              Mostly complex with some simple
                            </SelectItem>
                            <SelectItem value="complex">
                              Complex and sophisticated
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          What vocabulary range do you typically use?
                        </Label>
                        <RadioGroup
                          value={profileData.vocabularyRange}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              vocabularyRange: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="simple" id="vocab-simple" />
                            <Label htmlFor="vocab-simple" className="text-base">
                              Simple and accessible
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="everyday" id="everyday" />
                            <Label htmlFor="everyday" className="text-base">
                              Everyday with occasional specialized terms
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="varied" id="vocab-varied" />
                            <Label htmlFor="vocab-varied" className="text-base">
                              Varied and contextual
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="advanced" id="advanced" />
                            <Label htmlFor="advanced" className="text-base">
                              Advanced and precise
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="sophisticated"
                              id="sophisticated"
                            />
                            <Label
                              htmlFor="sophisticated"
                              className="text-base"
                            >
                              Sophisticated and extensive
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          How do you use industry jargon or specialized
                          terminology?
                        </Label>
                        <Select
                          value={profileData.industryJargon}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              industryJargon: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select jargon usage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="avoid">
                              Avoid jargon completely
                            </SelectItem>
                            <SelectItem value="minimal">
                              Minimal with explanations
                            </SelectItem>
                            <SelectItem value="moderate">
                              Moderate use where appropriate
                            </SelectItem>
                            <SelectItem value="frequent">
                              Frequent use for expert audience
                            </SelectItem>
                            <SelectItem value="extensive">
                              Extensive technical terminology
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </>
                )}

                {currentStep === 6 && (
                  <>
                    <CardContent className="p-8 space-y-6 font-serif">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Do you use emojis in your writing?
                        </Label>
                        <RadioGroup
                          value={profileData.useEmojis}
                          onValueChange={(value) =>
                            setProfileData({ ...profileData, useEmojis: value })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="never" id="emojis-never" />
                            <Label htmlFor="emojis-never" className="text-base">
                              Never use emojis
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="rarely" id="rarely" />
                            <Label htmlFor="rarely" className="text-base">
                              Rarely (1-2 per post)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="sometimes"
                              id="emojis-sometimes"
                            />
                            <Label
                              htmlFor="emojis-sometimes"
                              className="text-base"
                            >
                              Sometimes (3-5 per post)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="frequently"
                              id="emojis-frequently"
                            />
                            <Label
                              htmlFor="emojis-frequently"
                              className="text-base"
                            >
                              Frequently (throughout post)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="extensively"
                              id="emojis-extensively"
                            />
                            <Label
                              htmlFor="emojis-extensively"
                              className="text-base"
                            >
                              Extensively (multiple per paragraph)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Do you use hashtags in your content?
                        </Label>
                        <RadioGroup
                          value={profileData.useHashtags}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              useHashtags: value,
                            })
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="never" id="hashtags-never" />
                            <Label
                              htmlFor="hashtags-never"
                              className="text-base"
                            >
                              Never use hashtags
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="end-only" id="end-only" />
                            <Label htmlFor="end-only" className="text-base">
                              Only at the end (2-3 hashtags)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="end-many" id="end-many" />
                            <Label htmlFor="end-many" className="text-base">
                              Many at the end (4+ hashtags)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem
                              value="integrated"
                              id="integrated"
                            />
                            <Label htmlFor="integrated" className="text-base">
                              Integrated within the text
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both" className="text-base">
                              Both integrated and at the end
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          What is your preferred content length?
                        </Label>
                        <Select
                          value={profileData.characterLimit}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              characterLimit: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select content length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="very-short">
                              Very short (under 100 words)
                            </SelectItem>
                            <SelectItem value="short">
                              Short (100-200 words)
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium (200-400 words)
                            </SelectItem>
                            <SelectItem value="long">
                              Long (400-800 words)
                            </SelectItem>
                            <SelectItem value="very-long">
                              Very long (800+ words)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Any additional custom instructions? (Optional)
                        </Label>
                        <Textarea
                          placeholder="Add any specific instructions or preferences not covered above..."
                          value={profileData.customInstructions || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              customInstructions: e.target.value,
                            })
                          }
                          className="min-h-[150px] text-base font-serif"
                        />
                      </div>
                    </CardContent>
                  </>
                )}

                {currentStep === 7 && (
                  <>
                    <CardContent className="p-8 space-y-6 font-serif">
                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Example 1: Paste a sample of your writing
                        </Label>
                        <Textarea
                          placeholder="Paste a sample of your writing here..."
                          value={profileData.referenceContent[0] || ""}
                          onChange={(e) =>
                            handleReferenceContentChange(0, e.target.value)
                          }
                          className="min-h-[200px] text-base font-serif leading-relaxed"
                        />
                        <p className="text-sm text-gray-500 italic">
                          This could be a blog post, article, social media post,
                          or any other content that represents your writing
                          style.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Example 2: Paste another sample (Optional)
                        </Label>
                        <Textarea
                          placeholder="Paste another sample of your writing here..."
                          value={profileData.referenceContent[1] || ""}
                          onChange={(e) =>
                            handleReferenceContentChange(1, e.target.value)
                          }
                          className="min-h-[200px] text-base font-serif leading-relaxed"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-medium">
                          Example 3: Paste another sample (Optional)
                        </Label>
                        <Textarea
                          placeholder="Paste another sample of your writing here..."
                          value={profileData.referenceContent[2] || ""}
                          onChange={(e) =>
                            handleReferenceContentChange(2, e.target.value)
                          }
                          className="min-h-[200px] text-base font-serif leading-relaxed"
                        />
                      </div>

                      <div className="bg-green-50 p-6 rounded-md border border-green-100">
                        <p className="text-base text-green-800 font-serif leading-relaxed">
                          <strong>Tip:</strong> The more examples you provide,
                          the better the AI will understand your unique writing
                          style. Include different types of content if possible,
                          such as formal and informal writing, to give the AI a
                          comprehensive understanding of your voice.
                        </p>
                      </div>
                    </CardContent>
                  </>
                )}

                <CardFooter className="flex justify-between p-8 bg-gray-50 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="text-base font-medium"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      onClick={handleNextStep}
                      disabled={!isCurrentStepComplete()}
                      className="bg-green-800 hover:bg-green-900 text-base font-medium"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !isCurrentStepComplete()}
                      className="bg-green-800 hover:bg-green-900 text-base font-medium"
                    >
                      {isSubmitting ? (
                        <>Saving...</>
                      ) : (
                        <>
                          Save Profile
                          <Save className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center">
            <InfoDialog />
          </div>
        </div>
      </main>
    </div>
  );
}
