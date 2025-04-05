import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { landingContent, siteConfig } from "@/constants/webcontent";

// landing page component
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* hero */}
      <section className="relative py-24 bg-gradient-to-br from-background to-secondary">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-primary mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  Trusted by 2,000+ businesses
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  Content that sounds like{" "}
                  <span className="text-primary">you</span> wrote it
                </h1>
                <p className="mt-6 text-xl text-muted-foreground">
                  {landingContent.hero.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-lg py-6 px-8 h-auto">
                  <Link href="/profile" className="flex items-center">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:text-primary hover:bg-secondary text-lg py-6 px-8 h-auto"
                >
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary mr-2" />
                <span>No credit card required • 100% free</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Not A Ghostwriter Dashboard"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* social proof */}
          <div className="mt-20">
            <p className="text-center text-muted-foreground mb-8">
              {landingContent.socialProof.title}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8">
                  <Image
                    src={`/placeholder.svg?height=32&width=120&text=LOGO%20${i}`}
                    alt={`Company ${i}`}
                    width={120}
                    height={32}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {landingContent.features.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {landingContent.features.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {landingContent.features.items.map((feature, index) => (
              <Card key={index} className="border-secondary/50 shadow-sm">
                <CardContent className="pt-6">
                  <div className="bg-secondary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:text-primary hover:bg-secondary"
            >
              <Link href="/features">
                Explore all features <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {landingContent.howItWorks.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {landingContent.howItWorks.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {landingContent.howItWorks.steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-background rounded-xl shadow-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=500&width=1200&text=Platform%20Workflow%20Demo"
              alt="How Not A Ghostwriter works"
              width={1200}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {landingContent.testimonials.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of professionals who trust{" "}
              <span className="text-primary">{siteConfig.name}</span> for their
              content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landingContent.testimonials.items.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="border-secondary/50 shadow-sm"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">
                    &#34;{testimonial.content}&#34;
                  </p>
                  <div className="flex items-center">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              {landingContent.cta.title}
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              {landingContent.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-background text-primary hover:bg-background/90 text-lg py-6 px-8 h-auto">
                <Link href="/profile" className="flex items-center">
                  {landingContent.cta.primaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-background bg-primary text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary/90 text-lg py-6 px-8 h-auto"
              >
                <Link href="/demo">{landingContent.cta.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
