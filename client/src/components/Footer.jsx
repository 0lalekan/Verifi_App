import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store';
import verifiLogo from '../assets/verifi-logo.png';
import { Twitter, Linkedin, Github, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

const Footer = () => {
  const { userInfo } = useAuthStore();

  return (
    <footer className="relative z-10 border-t border-border/40 bg-background/40 backdrop-blur-xl pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <img src={verifiLogo} alt="Verifi" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-2xl font-display font-extrabold tracking-tight text-foreground">Verifi</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Building the trust layer for the global supply chain. We combine blockchain transparency with AI-driven authentication to protect brands and consumers alike.
            </p>
            <div className="flex gap-3 pt-2">
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Linkedin size={18} />} href="#" />
              <SocialLink icon={<Github size={18} />} href="https://github.com/0lalekan/" />
              <SocialLink icon={<Mail size={18} />} href="mailto:nexalabs.io@gmail.com" />
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 md:pl-10">
            <div>
              <h3 className="font-bold text-foreground mb-6">Platform</h3>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><FooterLink to="/features">Features</FooterLink></li>
                <li><FooterLink to="/pricing">Pricing</FooterLink></li>
                <li><FooterLink to="/docs">API Docs</FooterLink></li>
                {!userInfo && <li><FooterLink to="/login">Sign In</FooterLink></li>}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-6">Company</h3>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><FooterLink to="/about">About Us</FooterLink></li>
                <li><FooterLink to="/contact">Contact</FooterLink></li>
                <li><FooterLink to="/careers">Careers</FooterLink></li>
                <li><FooterLink to="/blog">Blog</FooterLink></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-6">Legal</h3>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
                <li><FooterLink to="/security">Security</FooterLink></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NEXA Labs  . All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-xl bg-secondary/50 border border-border/50 text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }) => (
  <Link to={to} className="hover:text-primary transition-colors flex items-center group">
    {children}
    <ArrowRight size={12} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
  </Link>
);

export default Footer;