"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";

const infoSteps = [
  {
    title: "Understanding of Voice",
    description:
      "The AI learns whether your writing is spontaneous, conversational, formal, or technical—allowing it to capture that essence in generated content.",
    details:
      "By analyzing your writing style preferences, the AI can determine if you prefer a more structured approach or a free-flowing style. It identifies patterns in your tone, formality level, and technical depth to ensure the generated content feels authentic to your voice.",
  },
  {
    title: "Tone and Flow",
    description:
      "Your preferences on authenticity, rhythm, and engagement guide the AI to make the writing feel alive and engaging, as though it's written directly by you.",
    details:
      "The AI adapts to your unique cadence and rhythm, whether you prefer short, punchy sentences or longer, more elaborate constructions. It captures your natural transitions between ideas and maintains your characteristic flow throughout the content.",
  },
  {
    title: "Structure with Flexibility",
    description:
      "Your format preferences help the AI balance structure with natural flow, reflecting your unique style while maintaining readability.",
    details:
      "The AI respects your preferences for paragraph length, use of headings, and organizational patterns. It adapts to your preferred structure while ensuring the content remains engaging and readable, creating a perfect balance between organization and natural expression.",
  },
  {
    title: "Specific Language Requirements",
    description:
      "By including language preferences, you avoid any awkward mismatches in tone, dialect, or vocabulary that might make the content feel inauthentic.",
    details:
      "The AI incorporates your dialect preferences (American, British, etc.), vocabulary range, and industry-specific terminology. It also respects your preferences for sentence complexity and jargon usage, ensuring the language feels natural and appropriate for your audience.",
  },
  {
    title: "Minimal Editing Required",
    description:
      "The more detailed your profile, the less editing you'll need to do. The AI can generate content that sounds like you wrote it yourself.",
    details:
      "With a comprehensive profile, the AI can produce content that requires minimal to no editing, saving you valuable time. The generated content will maintain your voice consistently across all platforms and topics, allowing you to focus on strategy rather than writing.",
  },
];

export function InfoDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < infoSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-green-800 hover:text-green-900 hover:bg-green-50"
        >
          <Info className="h-4 w-4 mr-1" />
          <span>Why is this detailed profile important?</span>
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[600px]" forceMount>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>How This Helps AI Write for You</DialogTitle>
                <DialogDescription>
                  This detailed profile helps the AI understand your unique
                  writing style and preferences.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6">
                <Stepper
                  currentStep={currentStep}
                  totalSteps={infoSteps.length}
                  className="mb-6"
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium text-green-800">
                        {infoSteps[currentStep - 1].title}
                      </h3>
                      <p className="text-gray-600">
                        {infoSteps[currentStep - 1].description}
                      </p>
                      <div className="mt-4 p-4 bg-green-50 rounded-md">
                        <p className="text-sm text-green-800">
                          {infoSteps[currentStep - 1].details}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < infoSteps.length ? (
                    <Button
                      onClick={handleNextStep}
                      className="bg-green-800 hover:bg-green-900 flex items-center"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setOpen(false)}
                      className="bg-green-800 hover:bg-green-900"
                    >
                      Got it
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
