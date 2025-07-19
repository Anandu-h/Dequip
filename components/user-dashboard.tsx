"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Wrench, Calendar, DollarSign, Star, TrendingUp, Clock, MapPin, Eye, Edit } from "lucide-react"
import type { Tool, Rental } from "@/lib/contracts"

function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function UserDashboard() {
  const hasMounted = useHasMounted()
  const { address, isConnected } = useAccount()
  const [userStats, setUserStats] = useState({
    totalEarnings: "0",
    reputation: 0,
    toolsListed: 0,
    activeRentals: 0,
  })

  // Mock data for demonstration
  const [userTools] = useState<Tool[]>([
    {
      id: 1,
      name: "DeWalt Cordless Drill",
      description: "Professional grade cordless drill with 2 batteries",
      pricePerDay: "0.05",
      category: "Power Tools",
      imageUrl: "/placeholder.svg",
      owner: address || "",
      isAvailable: true,
      location: "Downtown",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Circular Saw",
      description: "High-performance circular saw for wood cutting",
      pricePerDay: "0.08",
      category: "Power Tools",
      imageUrl: "/placeholder.svg",
      owner: address || "",
      isAvailable: false,
      location: "City Center",
      rating: 4.9,
    },
  ])

  const [userRentals] = useState<Rental[]>([
    {
      id: 1,
      toolId: 3,
      toolName: "Pressure Washer",
      renter: address || "",
      owner: "0x1234...5678",
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      totalPrice: "0.24",
      status: "active",
    },
    {
      id: 2,
      toolId: 4,
      toolName: "Lawn Mower",
      renter: address || "",
      owner: "0x9876...4321",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      totalPrice: "0.15",
      status: "completed",
    },
  ])

  // Simulate contract reads
  useEffect(() => {
    if (isConnected && address) {
      // Mock data - in real app, these would be contract calls
      setUserStats({
        totalEarnings: "1.25",
        reputation: 485,
        toolsListed: userTools.length,
        activeRentals: userRentals.filter((r) => r.status === "active").length,
      })
    }
  }, [isConnected, address, userTools.length, userRentals])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!hasMounted) return null

  if (!isConnected) {
    return (
      <Card className="bg-[#181A20] border-gray-700">
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400">Connect your wallet to view your dashboard</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card className="bg-[#181A20] border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-[#F0B90B] text-black text-xl">
                  {address ? address.slice(2, 4).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-white text-2xl font-bold">My Dashboard</h2>
                <p className="text-gray-400">{formatAddress(address!)}</p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-[#F0B90B] fill-current mr-1" />
                  <span className="text-white font-semibold">{userStats.reputation}</span>
                  <span className="text-gray-400 ml-1">reputation points</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black bg-transparent"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#181A20] border-gray-700">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-[#F0B90B] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userStats.totalEarnings} BNB</div>
            <div className="text-gray-400 text-sm">Total Earnings</div>
          </CardContent>
        </Card>

        <Card className="bg-[#181A20] border-gray-700">
          <CardContent className="p-4 text-center">
            <Wrench className="w-8 h-8 text-[#F0B90B] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userStats.toolsListed}</div>
            <div className="text-gray-400 text-sm">Tools Listed</div>
          </CardContent>
        </Card>

        <Card className="bg-[#181A20] border-gray-700">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-[#F0B90B] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userStats.activeRentals}</div>
            <div className="text-gray-400 text-sm">Active Rentals</div>
          </CardContent>
        </Card>

        <Card className="bg-[#181A20] border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-[#F0B90B] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{userStats.reputation}</div>
            <div className="text-gray-400 text-sm">Reputation</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="my-tools" className="space-y-4">
        <TabsList className="bg-[#181A20] border-gray-700">
          <TabsTrigger value="my-tools" className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black">
            My Tools
          </TabsTrigger>
          <TabsTrigger value="my-rentals" className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black">
            My Rentals
          </TabsTrigger>
          <TabsTrigger value="earnings" className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black">
            Earnings
          </TabsTrigger>
        </TabsList>

        {/* My Tools Tab */}
        <TabsContent value="my-tools" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTools.map((tool) => (
              <Card key={tool.id} className="bg-[#181A20] border-gray-700">
                <div className="relative">
                  <img
                    src={tool.imageUrl || "/placeholder.svg"}
                    alt={tool.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className={`absolute top-3 right-3 ${tool.isAvailable ? "bg-green-500" : "bg-red-500"}`}>
                    {tool.isAvailable ? "Available" : "Rented"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#F0B90B] font-bold">{tool.pricePerDay} BNB/day</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[#F0B90B] fill-current mr-1" />
                      <span className="text-gray-300 text-sm">{tool.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {tool.location}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 bg-transparent">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Rentals Tab */}
        <TabsContent value="my-rentals" className="space-y-4">
          {userRentals.map((rental) => (
            <Card key={rental.id} className="bg-[#181A20] border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Wrench className="w-8 h-8 text-[#F0B90B]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{rental.toolName}</h3>
                      <p className="text-gray-400 text-sm">Owner: {formatAddress(rental.owner)}</p>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {rental.startDate} - {rental.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#F0B90B] font-bold text-lg">{rental.totalPrice} BNB</div>
                    <Badge
                      className={`${
                        rental.status === "active"
                          ? "bg-blue-500"
                          : rental.status === "completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                      }`}
                    >
                      {rental.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-4">
          <Card className="bg-[#181A20] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#0B0E11] rounded-lg">
                  <div className="text-2xl font-bold text-[#F0B90B]">{userStats.totalEarnings} BNB</div>
                  <div className="text-gray-400 text-sm">Total Earned</div>
                </div>
                <div className="text-center p-4 bg-[#0B0E11] rounded-lg">
                  <div className="text-2xl font-bold text-[#F0B90B]">0.15 BNB</div>
                  <div className="text-gray-400 text-sm">This Month</div>
                </div>
                <div className="text-center p-4 bg-[#0B0E11] rounded-lg">
                  <div className="text-2xl font-bold text-[#F0B90B]">0.05 BNB</div>
                  <div className="text-gray-400 text-sm">Available</div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017]">Withdraw Earnings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
