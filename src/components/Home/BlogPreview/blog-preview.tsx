import { Calendar } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Organizing Successful Corporate Events",
    excerpt: "Learn the best practices for planning and executing memorable corporate events that leave lasting impressions.",
    date: "2024-05-15",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    category: "Tips",
  },
  {
    id: 2,
    title: "The Future of Virtual Events: What to Expect",
    excerpt: "Explore how technology is reshaping the event industry and what trends will dominate in the coming years.",
    date: "2024-05-10",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80",
    category: "Trends",
  },
  {
    id: 3,
    title: "Creating Memorable Wedding Experiences",
    excerpt: "Discover creative ideas and inspiration for planning the perfect wedding day that guests will remember forever.",
    date: "2024-05-05",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    category: "Weddings",
  },
];

export const BlogPreview = () => {
  return (
    <section className="py-20">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Latest from Our Blog</h2>
          <p className="text-muted-foreground">Tips, trends, and insights for event organizers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-card rounded-xl overflow-hidden border">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
