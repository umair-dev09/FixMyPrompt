import React from 'react';
import { Header } from '@/components/layout/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | FixMyPrompt - AI Prompt Refinement Tool',
  description: 'Read our terms and conditions for using FixMyPrompt. Understand your rights, responsibilities, and our AI-powered prompt refinement service policies.',
  robots: 'index, follow',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using FixMyPrompt ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              FixMyPrompt is an AI-powered tool that helps users refine and improve their prompts for various AI applications. Our service provides:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Prompt refinement and optimization suggestions</li>
              <li>Quality scoring and analytics for prompts</li>
              <li>Multiple variations of improved prompts</li>
              <li>Integration with various AI platforms and models</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            
            <h3 className="text-xl font-medium mb-3">3.1 Acceptable Use</h3>
            <p className="mb-4">You agree to use FixMyPrompt only for lawful purposes and in accordance with these Terms. You shall not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Submit prompts containing illegal, harmful, or offensive content</li>
              <li>Use the service to generate content that violates intellectual property rights</li>
              <li>Attempt to reverse engineer, hack, or exploit the service</li>
              <li>Share your account credentials with unauthorized parties</li>
              <li>Use the service for spam, harassment, or malicious activities</li>
              <li>Submit prompts containing personal information of others without consent</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">3.2 Content Responsibility</h3>
            <p className="mb-4">
              You are solely responsible for the content of your prompts and any resulting outputs. We do not endorse, support, represent, or guarantee the completeness, truthfulness, accuracy, or reliability of any content processed through our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-medium mb-3">4.1 Your Content</h3>
            <p className="mb-4">
              You retain ownership of your original prompt content. By using our service, you grant us a limited, non-exclusive license to process and refine your prompts to provide our services.
            </p>

            <h3 className="text-xl font-medium mb-3">4.2 Our Service</h3>
            <p className="mb-4">
              FixMyPrompt, including its design, features, algorithms, and branding, is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our service without explicit permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. AI-Generated Content</h2>
            <p className="mb-4">
              FixMyPrompt uses artificial intelligence to generate refined prompts and suggestions. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>AI-generated content may not always be accurate or appropriate</li>
              <li>You should review and validate all AI suggestions before use</li>
              <li>We are not responsible for the outcomes of using AI-generated prompts</li>
              <li>AI models may have inherent biases or limitations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Usage</h2>
            <p className="mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using FixMyPrompt, you consent to the collection and use of your information as outlined in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
            <p className="mb-4">
              We strive to maintain high service availability, but we do not guarantee uninterrupted access to FixMyPrompt. The service may be temporarily unavailable due to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Scheduled maintenance and updates</li>
              <li>Technical difficulties or server issues</li>
              <li>Third-party service dependencies</li>
              <li>Force majeure events</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, FixMyPrompt and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use or inability to use our service</li>
              <li>Any AI-generated content or suggestions</li>
              <li>Unauthorized access to your data</li>
              <li>Service interruptions or technical issues</li>
              <li>Any third-party content or actions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless FixMyPrompt, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorney's fees) arising from your use of the service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="mb-4">
              We reserve the right to terminate or suspend your access to FixMyPrompt at any time, with or without cause, and with or without notice. Upon termination, your right to use the service ceases immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Third-Party Services</h2>
            <p className="mb-4">
              FixMyPrompt may integrate with third-party AI services and platforms. Your use of such services is subject to their respective terms and conditions. We are not responsible for the availability, content, or practices of third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website. Your continued use of FixMyPrompt after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the remaining Terms will otherwise remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> fixmyprompt@gmail.com</p>
              <p><strong>Subject:</strong> Terms and Conditions Inquiry</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
            <p className="mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and FixMyPrompt regarding the use of our service and supersede all prior agreements and understandings.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
