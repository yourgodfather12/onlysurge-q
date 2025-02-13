import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Search,
  Calendar,
  User,
  ArrowRight,
  Tag,
  Clock
} from 'lucide-react';

export function Blog() {
  const featuredPost = {
    title: "Maximizing Your Content Strategy with AI",
    excerpt: "Learn how AI can revolutionize your content creation workflow and boost engagement across all platforms.",
    image: "https://source.unsplash.com/random/1200x600?technology",
    author: "Sarah Johnson",
    date: "March 1, 2024",
    readTime: "8 min read",
    tags: ["AI", "Content Strategy", "Growth"]
  };

  const posts = Array.from({ length: 6 }, (_, i) => ({
    title: `How to ${["Grow Your Following", "Increase Engagement", "Optimize Content", "Automate Posting", "Analyze Metrics", "Build Your Brand"][i]}`,
    excerpt: "Discover the best practices and strategies to take your content creation to the next level.",
    image: `https://source.unsplash.com/random/600x400?creator${i}`,
    author: `Author ${i + 1}`,
    date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    readTime: `${Math.floor(Math.random() * 10 + 5)} min read`,
    tags: ["Growth", "Strategy", "Tips"]
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-gray-400">Latest insights, tips, and strategies for content creators.</p>
        </div>
        <Input
          placeholder="Search articles..."
          icon={<Search className="w-4 h-4" />}
          className="w-full sm:w-64"
        />
      </div>

      {/* Featured Post */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 md:h-auto">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {featuredPost.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {featuredPost.readTime}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
            <p className="text-gray-400 mb-4">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-4 mb-6">
              <img
                src="https://source.unsplash.com/random/100x100?portrait"
                alt={featuredPost.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm text-gray-400">{featuredPost.author}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredPost.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-purple-900/20 text-purple-400 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Button
              variant="primary"
              className="w-fit"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Read More
            </Button>
          </div>
        </div>
      </Card>

      {/* Post Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://source.unsplash.com/random/100x100?portrait${i}`}
                  alt={post.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-400">{post.author}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="px-2 py-1 rounded-full bg-purple-900/20 text-purple-400 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter */}
      <Card>
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-400 mb-6">
              Get the latest content creation tips and strategies delivered straight to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1"
              />
              <Button variant="primary">Subscribe</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}