import React from 'react';
import { ShieldCheck, Lock, Server, Key, FileKey, Activity } from 'lucide-react';

const SecurityCard = ({ icon: Icon, title, desc }) => (
  <div className="glass-card p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors">
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Security = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-sm mb-6 border border-emerald-500/20">
            <ShieldCheck size={16} /> Security Center
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-6">
            Fortified by Design.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We don't just verify products; we verify every byte of data. 
            Our security architecture is built to Zero Trust standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <SecurityCard 
            icon={Lock} 
            title="End-to-End Encryption" 
            desc="All sensitive data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your trade secrets remain secret."
          />
          <SecurityCard 
            icon={Server} 
            title="Immutable Audit Logs" 
            desc="Every scan, transfer, and alert is cryptographically hashed. Once written, history cannot be altered or deleted by anyone."
          />
          <SecurityCard 
            icon={Key} 
            title="Role-Based Access" 
            desc="Strict ACLs ensure Manufacturers only see their own data, while Regulators get oversight without compromising commercial privacy."
          />
          <SecurityCard 
            icon={FileKey} 
            title="JWT Authentication" 
            desc="Stateless, secure session management using HTTP-only cookies prevents XSS attacks and session hijacking."
          />
          <SecurityCard 
            icon={Activity} 
            title="Anomaly Detection" 
            desc="Our AI monitors for suspicious patterns like velocity spikes (cloning) or GPS spoofing and blocks them instantly."
          />
          <SecurityCard 
            icon={ShieldCheck} 
            title="Regular Audits" 
            desc="We perform automated vulnerability scanning and third-party penetration testing to stay ahead of threats."
          />
        </div>

        <div className="glass rounded-[2.5rem] p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Report a Vulnerability</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Found a security issue? We run a bug bounty program. Please disclose responsibly.
          </p>
          <a href="mailto:security@verifi.ng" className="px-8 py-4 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity">
            Contact Security Team
          </a>
        </div>

      </div>
    </div>
  );
};

export default Security;