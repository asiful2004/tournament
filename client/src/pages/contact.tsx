import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Clock, TriangleAlert } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message sent successfully',
        description: 'We will get back to you within 24 hours.',
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send message',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300">
              Get in touch with our support team
            </p>
            
            {/* Age Requirement Notice */}
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg max-w-md mx-auto">
              <TriangleAlert className="inline mr-2 h-5 w-5 text-red-400" />
              <span className="text-red-300 font-medium">Support available for users 15+ years only</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-gray-900/90 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Your Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-name"
                              placeholder="Enter your full name"
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-email"
                              type="email"
                              placeholder="Enter your email"
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Subject</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-subject"
                              placeholder="What is this about?"
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              data-testid="textarea-message"
                              placeholder="Tell us how we can help you..."
                              rows={6}
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      data-testid="button-send-message"
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-gray-900/90 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Mail className="h-6 w-6 text-purple-400" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-2">For general inquiries and support:</p>
                  <a 
                    href="mailto:support@skillsmoney.com" 
                    className="text-purple-400 hover:text-purple-300 font-semibold"
                    data-testid="link-email-support"
                  >
                    support@skillsmoney.com
                  </a>
                  <p className="text-sm text-gray-400 mt-2">
                    We respond to all emails within 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/90 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Phone className="h-6 w-6 text-purple-400" />
                    WhatsApp Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-2">For urgent tournament support:</p>
                  <a 
                    href="https://wa.me/8801234567890" 
                    className="text-purple-400 hover:text-purple-300 font-semibold"
                    data-testid="link-whatsapp-support"
                  >
                    +880 1234 567890
                  </a>
                  <p className="text-sm text-gray-400 mt-2">
                    Available during tournament hours only
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/90 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Clock className="h-6 w-6 text-purple-400" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Email Support:</span>
                      <span className="text-green-400">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tournament Support:</span>
                      <span className="text-green-400">During matches</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Issues:</span>
                      <span className="text-green-400">10 AM - 10 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-300">Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <ul className="space-y-2 text-sm">
                    <li>• Payment issues: Include transaction ID</li>
                    <li>• Tournament problems: Include tournament name and time</li>
                    <li>• Account issues: Include your registered email</li>
                    <li>• Technical bugs: Include screenshots if possible</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}