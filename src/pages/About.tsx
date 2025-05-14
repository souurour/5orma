import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Brain,
  ChevronRight,
  HeartPulse,
  Microscope,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16">
        <div className="container max-w-6xl space-y-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              About the Medical Image Classification App
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Our advanced AI platform is designed to assist healthcare
              professionals in classifying and analyzing medical images with
              high accuracy and efficiency.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/classification">
                  Try Classification <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-slate-600 mb-4">
                We are committed to revolutionizing medical imaging diagnosis
                through cutting-edge artificial intelligence. Our goal is to
                provide healthcare professionals with reliable, accurate, and
                efficient tools that enhance their diagnostic capabilities.
              </p>
              <p className="text-slate-600">
                By leveraging advanced deep learning algorithms and medical
                expertise, our platform enables faster identification of
                conditions, reduces diagnostic errors, and ultimately improves
                patient outcomes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Powered by state-of-the-art neural networks trained on
                    millions of annotated medical images
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" />
                    Precision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    High diagnostic accuracy validated through extensive testing
                    with medical professionals
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Healthcare Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Developed specifically for clinical environments with input
                    from practicing radiologists
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    Patient-Centered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Ultimately aimed at improving patient outcomes through
                    earlier and more accurate diagnosis
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16">
        <div className="container max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Modality Support</CardTitle>
                <CardDescription>
                  Compatible with various imaging types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Our system supports a wide range of medical imaging
                  modalities, including X-rays, CT scans, MRIs, ultrasound
                  images, and more. This versatility makes it suitable for
                  different medical specialties and diagnostic needs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Analysis</CardTitle>
                <CardDescription>
                  Immediate classification results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Get instant classification results with confidence scores for
                  each potential diagnosis. Our optimized algorithms process
                  images in seconds, providing quick decision support for
                  time-sensitive clinical situations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Reporting</CardTitle>
                <CardDescription>
                  Detailed insights and export options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Generate detailed reports with classification results,
                  confidence levels, and supporting information. These reports
                  can be exported in multiple formats and integrated with
                  existing electronic health record systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How accurate is the image classification?
              </AccordionTrigger>
              <AccordionContent>
                Our AI models have been validated on diverse datasets and
                achieve accuracy rates of 85-95% depending on the specific
                condition and image quality. Each classification comes with a
                confidence score to help healthcare professionals make informed
                decisions. However, the system is designed to be a diagnostic
                aid and not a replacement for clinical judgment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What types of medical images can be processed?
              </AccordionTrigger>
              <AccordionContent>
                The platform supports a wide range of medical imaging
                modalities, including X-rays, CT scans, MRIs, ultrasound images,
                histopathology slides, and dermatological images. Files can be
                uploaded in various formats including DICOM, JPEG, PNG, TIFF,
                and NIfTI.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                How is patient data protected?
              </AccordionTrigger>
              <AccordionContent>
                We implement enterprise-grade security measures including
                end-to-end encryption, secure cloud storage, and strict access
                controls. All data processing adheres to HIPAA compliance
                standards and other relevant healthcare data protection
                regulations. Personal identifiers can be automatically removed
                from images before processing if required.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Can the system integrate with existing hospital systems?
              </AccordionTrigger>
              <AccordionContent>
                Yes, our platform supports integration with major Electronic
                Health Record (EHR) systems, PACS (Picture Archiving and
                Communication Systems), and other healthcare IT infrastructure
                through standard protocols like HL7, DICOM, and FHIR. Custom
                integration services are also available for unique requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                How often are the AI models updated?
              </AccordionTrigger>
              <AccordionContent>
                Our AI models undergo continuous improvement through regular
                training cycles with new, validated data. Major updates are
                typically released quarterly, with minor enhancements and
                optimizations deployed more frequently. All updates undergo
                rigorous testing to ensure reliability and improved performance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container max-w-6xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to enhance your diagnostic capabilities?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Start using our medical image classification platform today and
            experience the power of AI-assisted diagnosis.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/classification">Try Classification</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent"
              asChild
            >
              <Link to="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
