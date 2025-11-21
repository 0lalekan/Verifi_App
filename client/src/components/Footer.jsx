import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store';
import verifiLogo from '../assets/verifi-logo.png';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  const { userInfo } = useAuthStore();

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-lg pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <img src={verifiLogo} alt="Verifi" className="w-6 h-6" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Verifi</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              The global standard for product authenticity. We combine blockchain transparency with real-time AI monitoring to secure supply chains and protect public health.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Linkedin size={18} />} href="#" />
              <SocialLink icon={<Github size={18} />} href="#" />
              <SocialLink icon={<Mail size={18} />} href="mailto:hello@verifi.app" />
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">Platform</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {!userInfo ? (
                  <>
                    <li><FooterLink to="/register">Get Started</FooterLink></li>
                    <li><FooterLink to="/login">Live Demo</FooterLink></li>
                  </>
                ) : (
                  <li><FooterLink to="/dashboard">Dashboard</FooterLink></li>
                )}
                <li><FooterLink to="/pricing">Pricing</FooterLink></li>
                <li><FooterLink to="/features">Features</FooterLink></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><FooterLink to="/about">About Us</FooterLink></li>
                <li><FooterLink to="/contact">Contact</FooterLink></li>
                <li><FooterLink to="/careers">Careers</FooterLink></li>
                <li><FooterLink to="/blog">Blog</FooterLink></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
                <li><FooterLink to="/security">Security</FooterLink></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Verifi Systems Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }) => (
  <Link to={to} className="hover:text-primary transition-colors block py-1">
    {children}
  </Link>
);

export default Footer;