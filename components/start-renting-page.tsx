"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { RentalBooking } from "@/components/rental-booking"
import { Search, MapPin, Star, Grid3X3, List, SlidersHorizontal, Clock, Shield, Zap, ArrowLeft } from "lucide-react"
import Image from "next/image"
import type { Tool } from "@/lib/contracts"

interface StartRentingPageProps {
  onRentTool?: (tool: Tool) => void
}

export function StartRentingPage({ onRentTool }: StartRentingPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1])
  const [location, setLocation] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [showBooking, setShowBooking] = useState(false)

  const categories = [
    { id: "all", name: "All Categories", count: 156 },
    { id: "power-tools", name: "Power Tools", count: 45 },
    { id: "hand-tools", name: "Hand Tools", count: 32 },
    { id: "garden", name: "Garden Tools", count: 28 },
    { id: "automotive", name: "Automotive", count: 19 },
    { id: "construction", name: "Construction", count: 23 },
    { id: "specialty", name: "Specialty Tools", count: 9 },
  ]

  const tools: Tool[] = [
    {
      id: 1,
      name: "DeWalt 20V MAX Cordless Drill",
      description:
        "Professional grade cordless drill with 2 batteries and charger. Perfect for home improvement projects.",
      pricePerDay: "0.05",
      category: "Power Tools",
      imageUrl: "/placeholder.svg",
      owner: "0x1234...5678",
      isAvailable: true,
      location: "2.3 km away",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Pressure Washer 3000 PSI",
      description: "High-performance electric pressure washer ideal for cleaning driveways, decks, and vehicles.",
      pricePerDay: "0.12",
      category: "Garden Tools",
      imageUrl: "/placeholder.svg",
      owner: "0x9876...4321",
      isAvailable: true,
      location: "1.8 km away",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Circular Saw Professional",
      description: "7-1/4 inch circular saw with laser guide. Includes extra blades for different materials.",
      pricePerDay: "0.08",
      category: "Power Tools",
      imageUrl: "/placeholder.svg",
      owner: "0x5555...9999",
      isAvailable: false,
      location: "3.1 km away",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Angle Grinder Set",
      description: "4.5 inch angle grinder with cutting and grinding discs. Safety equipment included.",
      pricePerDay: "0.06",
      category: "Power Tools",
      imageUrl: "/placeholder.svg",
      owner: "0x7777...8888",
      isAvailable: true,
      location: "4.2 km away",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Lawn Mower Electric",
      description: "Cordless electric lawn mower with mulching capability. Quiet operation and eco-friendly.",
      pricePerDay: "0.15",
      category: "Garden Tools",
      imageUrl: "/placeholder.svg",
      owner: "0x3333...4444",
      isAvailable: true,
      location: "1.5 km away",
      rating: 4.5,
    },
    {
      id: 6,
      name: "Impact Driver Kit",
      description: "High-torque impact driver with bit set. Ideal for heavy-duty fastening applications.",
      pricePerDay: "0.07",
      category: "Power Tools",
      imageUrl: "/placeholder.svg",
      owner: "0x6666...7777",
      isAvailable: true,
      location: "2.8 km away",
      rating: 4.8,
    },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || tool.category.toLowerCase().replace(" ", "-") === selectedCategory
    const matchesPrice =
      Number.parseFloat(tool.pricePerDay) >= priceRange[0] && Number.parseFloat(tool.pricePerDay) <= priceRange[1]

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number.parseFloat(a.pricePerDay) - Number.parseFloat(b.pricePerDay)
      case "price-high":
        return Number.parseFloat(b.pricePerDay) - Number.parseFloat(a.pricePerDay)
      case "rating":
        return b.rating - a.rating
      case "distance":
        return Number.parseFloat(a.location) - Number.parseFloat(b.location)
      default:
        return 0
    }
  })

  const handleRentClick = (tool: Tool) => {
    setSelectedTool(tool)
    setShowBooking(true)
    onRentTool?.(tool)
  }

  const handleBookingClose = () => {
    setShowBooking(false)
    setSelectedTool(null)
  }

  const handleBookingSuccess = () => {
    setShowBooking(false)
    setSelectedTool(null)
    // Could trigger a refresh of available tools here
  }

  if (showBooking && selectedTool) {
    return (
      <div className="min-h-screen bg-[#0B0E11] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBookingClose}
              className="text-gray-300 hover:text-[#F0B90B] hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
          <RentalBooking tool={selectedTool} onClose={handleBookingClose} onSuccess={handleBookingSuccess} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find Tools to Rent</h1>
          <p className="text-gray-400">Discover and rent tools from verified owners in your area</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-[#181A20] border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for tools, equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#0B0E11] border-gray-700 text-white placeholder-gray-400 h-12"
                />
              </div>

              {/* Location */}
              <div className="relative lg:w-48">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 bg-[#0B0E11] border-gray-700 text-white placeholder-gray-400 h-12"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:border-[#F0B90B] hover:text-[#F0B90B] h-12 bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-3 block">Category</label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          className={`w-full justify-between text-left ${
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
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-3 block">Price Range (BNB/day)</label>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1}
                        min={0}
                        step={0.01}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{priceRange[0].toFixed(2)} BNB</span>
                        <span>{priceRange[1].toFixed(2)} BNB</span>
                      </div>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-3 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0B0E11] border border-gray-700 rounded-md text-white"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="distance">Nearest First</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{sortedTools.length} tools available</h2>
            <p className="text-gray-400">
              {selectedCategory !== "all" && `in ${categories.find((c) => c.id === selectedCategory)?.name}`}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-[#F0B90B] text-black" : "text-gray-300 hover:text-[#F0B90B]"}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-[#F0B90B] text-black" : "text-gray-300 hover:text-[#F0B90B]"}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tools Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTools.map((tool) => (
              <Card
                key={tool.id}
                className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={tool.imageUrl || "/placeholder.svg"}
                    alt={tool.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      tool.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {tool.isAvailable ? "Available" : "Rented"}
                  </Badge>
                  <div className="absolute top-3 left-3 flex space-x-1">
                    <Badge className="bg-black/50 text-white border-0">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-1">{tool.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{tool.description}</p>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#F0B90B] font-bold text-lg">{tool.pricePerDay} BNB/day</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[#F0B90B] fill-current mr-1" />
                      <span className="text-gray-300 text-sm">{tool.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {tool.location}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-xs bg-[#F0B90B] text-black">
                          {tool.owner.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-300 text-sm">
                        {tool.owner.slice(0, 6)}...{tool.owner.slice(-4)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#F0B90B] text-black hover:bg-[#D4A017]"
                      disabled={!tool.isAvailable}
                      onClick={() => handleRentClick(tool)}
                    >
                      {tool.isAvailable ? "Rent Now" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTools.map((tool) => (
              <Card key={tool.id} className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors">
                <CardContent className="p-6">
                  <div className="flex space-x-6">
                    <div className="relative">
                      <Image
                        src={tool.imageUrl || "/placeholder.svg"}
                        alt={tool.name}
                        width={150}
                        height={100}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <Badge
                        className={`absolute -top-2 -right-2 ${
                          tool.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {tool.isAvailable ? "Available" : "Rented"}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold text-lg">{tool.name}</h3>
                        <div className="text-right">
                          <div className="text-[#F0B90B] font-bold text-xl">{tool.pricePerDay} BNB/day</div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-[#F0B90B] fill-current mr-1" />
                            <span className="text-gray-300 text-sm">{tool.rating}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-400 mb-3">{tool.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {tool.location}
                          </div>
                          <div className="flex items-center">
                            <Avatar className="w-6 h-6 mr-2">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback className="text-xs bg-[#F0B90B] text-black">
                                {tool.owner.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-gray-300 text-sm">
                              {tool.owner.slice(0, 6)}...{tool.owner.slice(-4)}
                            </span>
                          </div>
                          <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">{tool.category}</Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:border-[#F0B90B] hover:text-[#F0B90B] bg-transparent"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#F0B90B] text-black hover:bg-[#D4A017]"
                            disabled={!tool.isAvailable}
                            onClick={() => handleRentClick(tool)}
                          >
                            {tool.isAvailable ? "Rent Now" : "Unavailable"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {sortedTools.length === 0 && (
          <Card className="bg-[#181A20] border-gray-700 text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tools found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search criteria or browse different categories</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange([0, 1])
                }}
                className="bg-[#F0B90B] text-black hover:bg-[#D4A017]"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-[#181A20] border-gray-700 text-center">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 text-[#F0B90B] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Secure Rentals</h3>
              <p className="text-gray-400 text-sm">All tools are secured with smart contracts and IoT locks</p>
            </CardContent>
          </Card>

          <Card className="bg-[#181A20] border-gray-700 text-center">
            <CardContent className="p-6">
              <Zap className="w-12 h-12 text-[#F0B90B] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Instant Access</h3>
              <p className="text-gray-400 text-sm">Unlock tools instantly with blockchain verification</p>
            </CardContent>
          </Card>

          <Card className="bg-[#181A20] border-gray-700 text-center">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 text-[#F0B90B] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Flexible Duration</h3>
              <p className="text-gray-400 text-sm">Rent for hours, days, or weeks based on your needs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
