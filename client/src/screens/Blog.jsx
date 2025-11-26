import React from 'react';
import { BookOpen } from 'lucide-react';

const BlogPost = ({ category, title, date, image }) => (
  <div className="glass-card p-0 group hover:-translate-y-1 transition-transform cursor-pointer">
    <div className="h-48 bg-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <img src={image} alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <span className="absolute bottom-4 left-4 z-20 text-white text-xs font-bold bg-primary px-2 py-1 rounded-md">
        {category}
      </span>
    </div>
    <div className="p-6">
      <div className="text-xs text-muted-foreground mb-2">{date}</div>
      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">Read more...</p>
    </div>
  </div>
);

const Blog = () => {
  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 pt-24 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">Verifi Insights</h1>
          <p className="text-lg text-muted-foreground">News, updates, and deep dives into supply chain security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BlogPost 
            category="Engineering"
            title="How we stopped a massive counterfeit ring in Lagos"
            date="Oct 12, 2025"
            image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
          />
          <BlogPost 
            category="Company"
            title="Verifi raises Series A to expand across Africa"
            date="Sep 28, 2025"
            image="https://images.unsplash.com/photo-1559136555-930b79631189?auto=format&fit=crop&q=80&w=800"
          />
          <BlogPost 
            category="Product"
            title="Introducing the B2B Trade Hub"
            date="Sep 15, 2025"
            image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
          />
        </div>

      </div>
    </div>
  );
};

export default Blog;