import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { aboutContent } from "@/constants/webcontent";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6 py-4">About Us</h1>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl leading-relaxed mb-8">
              I&#39;ve gotta tell you—this whole Not A Ghostwriter thing? It
              started because I was just so TIRED of reading content that
              sounded like it came from some corporate robot. You know what I
              mean? That stiff, formal stuff that makes your eyes glaze over
              before you&#39;ve even finished the first paragraph.
            </p>

            <p className="text-xl leading-relaxed mb-8">
              So here I am, thinking—why can&#39;t AI actually sound like ME?
              Like, the real me. Not some polished, sanitised version that&#39;s
              had all the personality squeezed out of it. I want my rambling
              tangents. I want my weird metaphors that sometimes don&#39;t quite
              land but are fun anyway.
            </p>

            <p className="text-xl leading-relaxed mb-8">
              And that&#39;s what we&#39;ve built here. An AI that doesn&#39;t
              just write content—it writes in YOUR voice. It captures those
              little quirks that make your writing uniquely yours. The way you
              start sentences with &#34;And&#34; even though your high school
              English teacher would be horrified. The way you use em-dashes—like
              this—because you can&#39;t help adding asides to everything. The
              way you sometimes write really short sentences. For emphasis. Like
              that.
            </p>

            <p className="text-xl leading-relaxed mb-8">
              Look, I&#39;m not going to bore you with a bunch of corporate
              mission statement nonsense. We&#39;re just a group of people who
              think that AI should help you sound more like yourself, not less.
              That&#39;s it. That&#39;s the whole thing.
            </p>

            <p className="text-xl leading-relaxed mb-8">
              And the best part? It&#39;s free. Completely free. No &#34;premium
              tier&#34; restriction, no &#34;you&#39;ve reached your limit&#34;
              popups. We believe everyone deserves to have content that sounds
              like them, without having to spend hours writing it themselves.
            </p>

            <p className="text-xl leading-relaxed mb-8">
              So go ahead—create a profile, tell our AI about your writing
              style, and let it do the heavy lifting. Your audience won&#39;t
              know the difference, but you&#39;ll get hours of your life back.
              And isn&#39;t that what technology should be doing for us anyway?
            </p>
          </div>

          <div className="mt-12">
            <Button className="bg-primary hover:bg-primary/90 text-lg py-6 px-8 h-auto">
              <Link href="/profile" className="flex items-center">
                Create Your Profile
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aboutContent.values.map((value, index) => (
              <div
                key={index}
                className="bg-background p-8 rounded-xl shadow-sm"
              >
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to try it out?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create your writing profile and start generating content that sounds
            like you wrote it.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-lg py-6 px-8 h-auto">
            <Link href="/profile" className="flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
