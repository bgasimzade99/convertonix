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
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Particles from '../components/Particles'
import BackToTop from '../components/BackToTop'
import Footer from '../components/Footer'

function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Posts', count: 6 },
    { id: 'Technology', name: 'Technology', count: 2 },
    { id: 'Privacy', name: 'Privacy', count: 1 },
    { id: 'Tutorial', name: 'Tutorial', count: 1 },
    { id: 'Development', name: 'Development', count: 1 },
    { id: 'Tips', name: 'Tips', count: 1 },
    { id: 'Company', name: 'Company', count: 1 }
  ]

  const blogPosts = [
    {
      id: 1,
      slug: 'future-of-file-conversion-ai-powered-processing',
      title: "The Future of File Conversion: AI-Powered Processing",
      excerpt: "Explore how artificial intelligence is revolutionizing file conversion, making it faster, more accurate, and more intelligent than ever before.",
      author: "BGDev Team",
      date: "2025-01-25",
      readTime: "8 min read",
      category: "Technology",
      tags: ["AI", "Technology", "Innovation"],
      featured: true
    },
    {
      id: 2,
      slug: 'privacy-first-file-conversion-why-it-matters',
      title: "Privacy-First File Conversion: Why It Matters",
      excerpt: "Learn why privacy-first file conversion is crucial in today's digital landscape and how Convertonix ensures your data never leaves your device.",
      author: "BGDev Team",
      date: "2025-01-22",
      readTime: "6 min read",
      category: "Privacy",
      tags: ["Privacy", "Security", "GDPR"],
      featured: false
    },
    {
      id: 3,
      slug: 'batch-file-conversion-complete-guide',
      title: "Batch File Conversion: A Complete Guide",
      excerpt: "Master the art of batch file conversion with our comprehensive tutorial covering everything from setup to advanced techniques.",
      author: "BGDev Team",
      date: "2025-01-20",
      readTime: "10 min read",
      category: "Tutorial",
      tags: ["Batch Processing", "Tutorial", "Productivity"],
      featured: false
    },
    {
      id: 4,
      slug: 'how-we-built-convertonix-technical-deep-dive',
      title: "How We Built Convertonix: A Technical Deep Dive",
      excerpt: "Behind the scenes look at the technology stack and architecture that powers Convertonix's lightning-fast file conversion.",
      author: "Babak Gasimzade",
      date: "2025-01-18",
      readTime: "12 min read",
      category: "Development",
      tags: ["Development", "Architecture", "Technology"],
      featured: true
    },
    {
      id: 5,
      slug: '10-file-conversion-tips-professional',
      title: "10 File Conversion Tips Every Professional Should Know",
      excerpt: "Professional tips and tricks to optimize your file conversion workflow and get the best results every time.",
      author: "BGDev Team",
      date: "2025-01-15",
      readTime: "7 min read",
      category: "Tips",
      tags: ["Tips", "Professional", "Workflow"],
      featured: false
    },
    {
      id: 6,
      slug: 'building-bgdev-digital-craft-studio',
      title: "Building BGDev: From Late-Night Coding to Digital Craft Studio",
      excerpt: "The story behind BGDev - how a startup built by creators for creators is reshaping digital experiences with modern, minimal, and powerful solutions.",
      author: "Babak Gasimzade",
      date: "2025-01-10",
      readTime: "6 min read",
      category: "Company",
      tags: ["BGDev", "Startup", "Digital Craft"],
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
          </h1>
          <p className="hero-subtitle">
            Insights, tutorials, and updates about file conversion, AI technology, and digital workflows.
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
        <section className="featured-posts premium-section">
          <div className="container">
            <h2 className="section-title">Featured Articles</h2>
            <p className="section-subtitle">
              Handpicked articles worth reading
            </p>
            <div className="featured-grid">
              {featuredPosts.map(post => (
                <article key={post.id} className="featured-post premium-card">
                  <div className="post-image">
                    <div className="image-placeholder">
                      <Sparkles size={48} />
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
                      <Link to={`/blog/${post.slug}`} className="read-more premium-btn">
                        Read More
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="all-posts premium-section">
        <div className="container">
          <h2 className="section-title">All Articles</h2>
          {filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.map(post => (
                <article key={post.id} className="post-card premium-card">
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
                      <Link to={`/blog/${post.slug}`} className="read-more premium-btn">
                        Read More
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-posts premium-card">
              <BookOpen size={64} />
              <h3>No articles found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Topics */}
      <section className="topics premium-section">
        <div className="container">
          <h2 className="section-title">Popular Topics</h2>
          <p className="section-subtitle">
            Explore our most popular content categories
          </p>
          <div className="topics-grid">
            <div className="topic-card premium-card">
              <div className="topic-icon">
                <Brain size={32} />
              </div>
              <h3>AI & Machine Learning</h3>
              <p>Explore how AI is transforming file conversion and document processing</p>
            </div>
            <div className="topic-card premium-card">
              <div className="topic-icon">
                <Shield size={32} />
              </div>
              <h3>Privacy & Security</h3>
              <p>Learn about privacy-first file processing and data protection</p>
            </div>
            <div className="topic-card premium-card">
              <div className="topic-icon">
                <Zap size={32} />
              </div>
              <h3>Performance</h3>
              <p>Tips for faster and more efficient file conversions</p>
            </div>
            <div className="topic-card premium-card">
              <div className="topic-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Industry Trends</h3>
              <p>Stay ahead of digital transformation and technology trends</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Blog
