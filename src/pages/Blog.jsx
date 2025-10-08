import React, { useState } from 'react'
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowRight, 
  Search,
  Filter,
  BookOpen,
  Zap,
  Shield,
  Brain,
  TrendingUp
} from 'lucide-react'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'

function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Posts', count: 7 },
    { id: 'tutorials', name: 'Tutorials', count: 1 },
    { id: 'updates', name: 'Updates', count: 2 },
    { id: 'tips', name: 'Tips & Tricks', count: 2 },
    { id: 'case-studies', name: 'Case Studies', count: 2 }
  ]

  const blogPosts = [
    {
      id: 1,
      title: "The Future of File Conversion: AI-Powered Processing",
      excerpt: "Explore how artificial intelligence is revolutionizing file conversion, making it faster, more accurate, and more intelligent than ever before.",
      content: "In this comprehensive guide, we dive deep into the world of AI-powered file conversion...",
      author: "BGDev",
      date: "2025-01-25",
      readTime: "8 min read",
      category: "updates",
      tags: ["AI", "Technology", "Innovation"],
      image: "/api/placeholder/600/300",
      featured: true
    },
    {
      id: 2,
      title: "Privacy-First File Conversion: Why It Matters",
      excerpt: "Learn why privacy-first file conversion is crucial in today's digital landscape and how Convertonix ensures your data never leaves your device.",
      content: "Privacy is not just a feature—it's a fundamental right. In this article...",
      author: "BGDev",
      date: "2025-01-22",
      readTime: "6 min read",
      category: "tips",
      tags: ["Privacy", "Security", "GDPR"],
      image: "/api/placeholder/600/300",
      featured: false
    },
    {
      id: 3,
      title: "Batch File Conversion: A Complete Guide",
      excerpt: "Master the art of batch file conversion with our comprehensive tutorial covering everything from setup to advanced techniques.",
      content: "Batch processing is one of the most powerful features of modern file converters...",
      author: "BGDev",
      date: "2025-01-20",
      readTime: "10 min read",
      category: "tutorials",
      tags: ["Batch Processing", "Tutorial", "Productivity"],
      image: "/api/placeholder/600/300",
      featured: false
    },
    {
      id: 4,
      title: "How We Built Convertonix: A Technical Deep Dive",
      excerpt: "Behind the scenes look at the technology stack and architecture that powers Convertonix's lightning-fast file conversion.",
      content: "Building a file conversion platform that processes files locally while maintaining...",
      author: "BGDev",
      date: "2025-01-18",
      readTime: "12 min read",
      category: "case-studies",
      tags: ["Development", "Architecture", "Technology"],
      image: "/api/placeholder/600/300",
      featured: true
    },
    {
      id: 5,
      title: "10 File Conversion Tips Every Professional Should Know",
      excerpt: "Professional tips and tricks to optimize your file conversion workflow and get the best results every time.",
      content: "Whether you're a designer, developer, or business professional...",
      author: "BGDev",
      date: "2025-01-15",
      readTime: "7 min read",
      category: "tips",
      tags: ["Tips", "Professional", "Workflow"],
      image: "/api/placeholder/600/300",
      featured: false
    },
    {
      id: 7,
      title: "Building BGDev: From Late-Night Coding to Digital Craft Studio",
      excerpt: "The story behind BGDev - how a startup built by creators for creators is reshaping digital experiences with modern, minimal, and powerful solutions.",
      content: "BGDev isn't just another development agency. We're a digital craft studio where every line of code, every pixel, and every animation has a reason...",
      author: "BGDev",
      date: "2025-01-10",
      readTime: "6 min read",
      category: "case-studies",
      tags: ["BGDev", "Startup", "Digital Craft"],
      image: "/api/placeholder/600/300",
      featured: true
    }
  ]

  const featuredPosts = blogPosts.filter(post => post.featured)
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="blog-page">
      <Particles />
      
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <h1>
            <span className="gradient-text">Blog</span>
            <br />
            Insights & Updates
          </h1>
          <p className="hero-subtitle">
            Stay updated with the latest news, tutorials, and insights about file conversion, 
            AI technology, and digital workflows.
          </p>
          
          {/* Search and Filter */}
          <div className="blog-controls">
            <div className="search-container">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="category-filter">
              <Filter size={20} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="featured-posts">
          <div className="container">
            <h2 className="section-title">Featured Articles</h2>
            <div className="featured-grid">
              {featuredPosts.map(post => (
                <article key={post.id} className="featured-post">
                  <div className="post-image">
                    <div className="image-placeholder">
                      <BookOpen size={48} />
                    </div>
                    <div className="post-category">{post.category}</div>
                  </div>
                  <div className="post-content">
                    <div className="post-meta">
                      <span className="post-date">
                        <Calendar size={16} />
                        {formatDate(post.date)}
                      </span>
                      <span className="post-read-time">
                        <Clock size={16} />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="tag">
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="post-footer">
                      <div className="post-author">
                        <User size={16} />
                        {post.author}
                      </div>
                      <button className="read-more">
                        Read More
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="all-posts">
        <div className="container">
          <h2 className="section-title">All Articles</h2>
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <article key={post.id} className="post-card">
                <div className="post-image">
                  <div className="image-placeholder">
                    <BookOpen size={32} />
                  </div>
                  <div className="post-category">{post.category}</div>
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-date">
                      <Calendar size={14} />
                      {formatDate(post.date)}
                    </span>
                    <span className="post-read-time">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-tags">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="post-footer">
                    <div className="post-author">
                      <User size={14} />
                      {post.author}
                    </div>
                    <button className="read-more">
                      Read More
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="no-posts">
              <BookOpen size={64} />
              <h3>No articles found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Stay Updated</h2>
              <p>Get the latest articles and updates delivered to your inbox.</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="topics">
        <div className="container">
          <h2 className="section-title">Popular Topics</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <Brain size={32} />
              <h3>AI & Machine Learning</h3>
              <p>Explore how AI is transforming file conversion</p>
            </div>
            <div className="topic-card">
              <Shield size={32} />
              <h3>Privacy & Security</h3>
              <p>Learn about privacy-first file processing</p>
            </div>
            <div className="topic-card">
              <Zap size={32} />
              <h3>Performance</h3>
              <p>Tips for faster and more efficient conversions</p>
            </div>
            <div className="topic-card">
              <TrendingUp size={32} />
              <h3>Industry Trends</h3>
              <p>Stay ahead of digital transformation trends</p>
            </div>
          </div>
        </div>
      </section>
      
      <BackToTop />
    </div>
  )
}

export default Blog
