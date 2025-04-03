"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, Check, Send, RefreshCw } from "lucide-react";
import { generateContent, getCurrentProfile } from "@/app/actions";
import { WritingProfile, PostParams } from "@/app/actions";
import { containerVariants, itemVariants } from "@/lib/animation";

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [postLength, setPostLength] = useState("medium");
  const [platform, setPlatform] = useState("linkedin");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCallToAction, setIncludeCallToAction] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<WritingProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const userProfile = await getCurrentProfile();
        console.log(userProfile);
        if (userProfile) {
          setProfile(userProfile); // Successfully set profile
          setIsLoadingProfile(false);
        } else {
          throw new Error("No profile found.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load your writing profile");
        setIsLoadingProfile(false);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!isLoadingProfile && !profile) {
      router.push("/profile"); // Redirect to the profile page if no profile
    }
  }, [isLoadingProfile, profile, router]);

  const handleGenerate = async () => {
    if (!topic) {
      setError("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Parse keywords from comma-separated string
      const keywords = keywordsInput
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      // Check that the array is defined before passing it to the API
      if (!Array.isArray(keywords)) {
        throw new Error("Keywords should be an array");
      }

      // Prepare params for content generation
      const params: PostParams = {
        topic,
        keywords,
        postLength,
        platform,
        includeHashtags,
        includeCallToAction,
      };

      // Generate content using the server action
      const content = await generateContent(params);
      setGeneratedContent(content);
    } catch (err: unknown) {
      console.error("Error generating content:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate content");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setGeneratedContent("");
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-green-800 animate-spin" />
        <span className="ml-2">Loading your writing profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Generate Content
            </h1>
            <p className="text-gray-600">
              Create content that sounds like you wrote it, powered by AI that
              understands your style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Content Details</CardTitle>
                  <CardDescription>
                    Provide details about the content you want to generate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div variants={itemVariants} className="space-y-3">
                    <Label htmlFor="topic">Topic or Main Idea</Label>
                    <Textarea
                      id="topic"
                      placeholder="Enter the main topic or idea for your content..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3">
                    <Label htmlFor="keywords">Keywords (Optional)</Label>
                    <Input
                      id="keywords"
                      placeholder="Enter keywords separated by commas..."
                      value={keywordsInput}
                      onChange={(e) => setKeywordsInput(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      These keywords will be incorporated into your content
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3">
                    <Label>Content Length</Label>
                    <RadioGroup
                      value={postLength}
                      onValueChange={setPostLength}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="short" id="short" />
                        <Label htmlFor="short">Short (100-150 words)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium (150-250 words)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="long" id="long" />
                        <Label htmlFor="long">Long (250-350 words)</Label>
                      </div>
                    </RadioGroup>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hashtags">Include Hashtags</Label>
                      <Switch
                        id="hashtags"
                        checked={includeHashtags}
                        onCheckedChange={setIncludeHashtags}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cta">Include Call to Action</Label>
                      <Switch
                        id="cta"
                        checked={includeCallToAction}
                        onCheckedChange={setIncludeCallToAction}
                      />
                    </div>
                  </motion.div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic}
                    className="w-full bg-green-800 hover:bg-green-900"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <div>
              <AnimatePresence mode="wait">
                {!generatedContent && !isGenerating ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full bg-gray-50 border-dashed border-gray-300">
                      <div className="flex flex-col items-center justify-center h-full py-12">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                          <Send className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                          Your generated content will appear here
                        </h3>
                        <p className="text-sm text-gray-500 text-center max-w-xs">
                          Fill in the details on the left and click
                          &#34;Generate Content&#34; to create content in your
                          style
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Generated Content</CardTitle>
                          <CardDescription>
                            Content for {platform} in your unique style
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            disabled={isGenerating || !generatedContent}
                          >
                            {isCopied ? (
                              <>
                                <Check className="mr-1 h-4 w-4" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1 h-4 w-4" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            disabled={isGenerating || !generatedContent}
                          >
                            <RefreshCw className="mr-1 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isGenerating ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-green-800 animate-spin mb-4" />
                            <p className="text-gray-600">
                              Generating content that sounds like you...
                            </p>
                          </div>
                        ) : error ? (
                          <div className="bg-red-50 text-red-800 p-4 rounded-md">
                            <p>{error}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap min-h-[300px]">
                            {generatedContent}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <p className="text-xs text-gray-500">
                          Content generated based on your writing profile
                        </p>
                        {generatedContent && !isGenerating && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/dashboard")}
                          >
                            View All Content
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
