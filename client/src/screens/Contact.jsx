import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Mail, MapPin, Send, MessageSquare, HelpCircle, AlertCircle, Building2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Form Data:', formData);
    toast.success('Message sent! We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark transition-colors duration-500 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-4 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about Verifi? Our team is here to help manufacturers, regulators, and consumers secure the supply chain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 flex items-start gap-4 group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-1">General inquiries & support</p>
                <a href="mailto:nexalabs.io@gmail.com" className="text-blue-500 font-semibold hover:underline">nexalabs.io@gmail.com</a>
              </div>
            </div>

            <div className="glass-card p-6 flex items-start gap-4 group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Headquarters</h3>
                <p className="text-sm text-muted-foreground mb-1">Visit our main office</p>
                <p className="text-foreground font-medium text-sm">23 Adeola Odeku Street, VI,<br />Lagos, Nigeria</p>
              </div>
            </div>

            {/* Quick FAQ / Note */}
            <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
              <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                <HelpCircle size={18} /> Need Help Fast?
              </h4>
              <p className="text-sm text-muted-foreground">
                Check our <a href="/docs" className="text-primary underline">Documentation</a> for integration guides or visit the <a href="#" className="text-primary underline">Help Center</a>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-primary" /> Send a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-foreground ml-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-foreground ml-1">Subject</label>
                  <select 
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="Support">Technical Support</option>
                    <option value="Sales">Manufacturer Sales</option>
                    <option value="Report">Report a Bug</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-foreground ml-1">Message</label>
                  <textarea 
                    id="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-foreground text-background font-bold rounded-xl shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;