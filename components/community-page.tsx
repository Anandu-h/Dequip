"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, Calendar, MapPin, Users, Plus, Filter, Award, TrendingUp } from "lucide-react"

interface Post {
  id: number
  author: string
  avatar: string
  content: string
  category: string
  likes: number
  comments: number
  timestamp: string
  isLiked: boolean
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  attendees: number
  maxAttendees: number
  category: string
}

interface LeaderboardUser {
  rank: number
  address: string
  reputation: number
  totalRentals: number
  badge: string
}

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")
  const [newPost, setNewPost] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const posts: Post[] = [
    {
      id: 1,
      author: "0x1234...5678",
      avatar: "/placeholder-user.jpg",
      content:
        "Just rented a DeWalt drill for my home renovation project. The smart lock system worked flawlessly! 🔧 #ToolChain #DePIN",
      category: "showcase",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      isLiked: false,
    },
    {
      id: 2,
      author: "0x9876...4321",
      avatar: "/placeholder-user.jpg",
      content:
        "Pro tip: Always check the tool's maintenance history before renting. The blockchain records are super helpful for this! 💡",
      category: "tips",
      likes: 18,
      comments: 5,
      timestamp: "4 hours ago",
      isLiked: true,
    },
    {
      id: 3,
      author: "0x5555...9999",
      avatar: "/placeholder-user.jpg",
      content:
        "Looking for recommendations on the best pressure washers available in the downtown area. Any suggestions? 🤔",
      category: "help",
      likes: 12,
      comments: 15,
      timestamp: "6 hours ago",
      isLiked: false,
    },
  ]

  const events: Event[] = [
    {
      id: 1,
      title: "Tool Maintenance Workshop",
      description: "Learn how to properly maintain and care for power tools to extend their lifespan.",
      date: "2024-01-15",
      location: "Community Center, Downtown",
      attendees: 23,
      maxAttendees: 50,
      category: "workshop",
    },
    {
      id: 2,
      title: "DePIN Meetup",
      description: "Discuss the future of decentralized physical infrastructure networks.",
      date: "2024-01-20",
      location: "Tech Hub, Silicon Valley",
      attendees: 45,
      maxAttendees: 100,
      category: "meetup",
    },
    {
      id: 3,
      title: "Tool Sharing Competition",
      description: "Win prizes by sharing your most creative tool rental experiences!",
      date: "2024-01-25",
      location: "Online Event",
      attendees: 78,
      maxAttendees: 200,
      category: "competition",
    },
  ]

  const leaderboard: LeaderboardUser[] = [
    { rank: 1, address: "0x1111...1111", reputation: 2450, totalRentals: 89, badge: "Gold" },
    { rank: 2, address: "0x2222...2222", reputation: 2180, totalRentals: 76, badge: "Gold" },
    { rank: 3, address: "0x3333...3333", reputation: 1950, totalRentals: 65, badge: "Silver" },
    { rank: 4, address: "0x4444...4444", reputation: 1720, totalRentals: 54, badge: "Silver" },
    { rank: 5, address: "0x5555...5555", reputation: 1580, totalRentals: 48, badge: "Bronze" },
  ]

  const categories = [
    { id: "all", name: "All Posts", count: posts.length },
    { id: "tips", name: "Tips & Tricks", count: 1 },
    { id: "showcase", name: "Showcase", count: 1 },
    { id: "help", name: "Help & Support", count: 1 },
    { id: "general", name: "General", count: 0 },
  ]

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Add new post logic here
      setNewPost("")
    }
  }

  const toggleLike = (postId: number) => {
    // Toggle like logic here
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Community Hub</h1>
          <p className="text-gray-400">Connect, share, and learn with the ToolChain community</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#181A20] border-gray-700">
            <TabsTrigger value="feed" className="text-gray-300 data-[state=active]:text-[#F0B90B]">
              Community Feed
            </TabsTrigger>
            <TabsTrigger value="events" className="text-gray-300 data-[state=active]:text-[#F0B90B]">
              Events
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-gray-300 data-[state=active]:text-[#F0B90B]">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-[#181A20] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-[#F0B90B]" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className={`w-full justify-between ${
                          selectedCategory === category.id
                            ? "bg-[#F0B90B] text-black"
                            : "text-gray-300 hover:text-[#F0B90B] hover:bg-gray-800"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-6">
                {/* Create Post */}
                <Card className="bg-[#181A20] border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-[#F0B90B] text-black">U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-4">
                        <Textarea
                          placeholder="Share your thoughts, tips, or experiences..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="bg-[#0B0E11] border-gray-700 text-white placeholder-gray-400"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            {["tips", "showcase", "help", "general"].map((cat) => (
                              <Badge
                                key={cat}
                                variant="outline"
                                className="cursor-pointer border-gray-600 text-gray-400 hover:border-[#F0B90B] hover:text-[#F0B90B]"
                              >
                                #{cat}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            onClick={handlePostSubmit}
                            className="bg-[#F0B90B] text-black hover:bg-[#D4A017]"
                            disabled={!newPost.trim()}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                {posts.map((post) => (
                  <Card key={post.id} className="bg-[#181A20] border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <Avatar>
                          <AvatarImage src={post.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-[#F0B90B] text-black">
                            {post.author.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-white font-semibold">{post.author}</span>
                            <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                              {post.category}
                            </Badge>
                            <span className="text-gray-400 text-sm">{post.timestamp}</span>
                          </div>
                          <p className="text-gray-300 mb-4">{post.content}</p>
                          <div className="flex items-center space-x-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-gray-400 hover:text-red-400 ${post.isLiked ? "text-red-400" : ""}`}
                              onClick={() => toggleLike(post.id)}
                            >
                              <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#F0B90B]">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#F0B90B]">
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
              <Button className="bg-[#F0B90B] text-black hover:bg-[#D4A017]">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="bg-[#181A20] border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">{event.title}</CardTitle>
                      <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">{event.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees}/{event.maxAttendees} attendees
                      </div>
                    </div>
                    <Button className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017]">Join Event</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Community Leaderboard</h2>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#F0B90B]" />
                <span className="text-gray-400">Updated daily</span>
              </div>
            </div>

            <Card className="bg-[#181A20] border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-4 rounded-lg bg-[#0B0E11] border border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F0B90B] text-black font-bold">
                          {user.rank}
                        </div>
                        <Avatar>
                          <AvatarFallback className="bg-[#F0B90B] text-black">
                            {user.address.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-semibold">{user.address}</p>
                          <p className="text-gray-400 text-sm">{user.totalRentals} rentals completed</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-[#F0B90B] font-bold">{user.reputation}</p>
                          <p className="text-gray-400 text-sm">reputation</p>
                        </div>
                        <Badge
                          className={`${
                            user.badge === "Gold"
                              ? "bg-yellow-500 text-black"
                              : user.badge === "Silver"
                                ? "bg-gray-400 text-black"
                                : "bg-orange-600 text-white"
                          }`}
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {user.badge}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
