"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ToolListingForm } from "@/components/tool-listing-form"
import { UserDashboard } from "@/components/user-dashboard"
import { CommunityPage } from "@/components/community-page"
import { RewardsPage } from "@/components/rewards-page"
import { StartRentingPage } from "@/components/start-renting-page"
import { NetworkStatus } from "@/components/network-status"
import { GreenfieldStatus } from "@/components/greenfield-status"
import { Wrench, Users, Trophy, Search, Plus, Shield, Zap, Globe, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home")

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <UserDashboard />
      case "rent":
        return <StartRentingPage />
      case "list":
        return <ToolListingForm />
      case "community":
        return <CommunityPage />
      case "rewards":
        return <RewardsPage />
      default:
        return <HomeContent setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#181A20]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
              <div className="w-10 h-10 bg-[#F0B90B] rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ToolChain</h1>
                <p className="text-xs text-gray-400">Decentralized Tool Rental</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NetworkStatus />
              <GreenfieldStatus />
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-[#181A20]">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-none h-auto p-0">
              <TabsTrigger
                value="home"
                className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black text-gray-300 hover:text-white"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black text-gray-300 hover:text-white"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="rent"
                className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black text-gray-300 hover:text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Tools
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                List Tool
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black text-gray-300 hover:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Community
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="data-[state=active]:bg-[#F0B90B] data-[state=active]:text-black text-gray-300 hover:text-white"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Rewards
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{renderTabContent()}</main>
    </div>
  )
}

function HomeContent({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#F0B90B] to-[#FCD535] bg-clip-text text-transparent">
            Decentralized Tool Rental Platform
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Rent tools from your neighbors, earn tokens, and build a stronger community. Powered by BNB Chain and
            secured by smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F0B90B] text-black hover:bg-[#D4A017] text-lg px-8 py-3" onClick={() => setActiveTab("rent")}>
              <Search className="w-5 h-5 mr-2" />
              Start Renting
            </Button>
            <Button
              variant="outline"
              className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black text-lg px-8 py-3 bg-transparent"
              onClick={() => setActiveTab("list")}
            >
              <Plus className="w-5 h-5 mr-2" />
              List Your Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors">
          <CardHeader>
            <Shield className="w-12 h-12 text-[#F0B90B] mb-4" />
            <CardTitle className="text-white">Secure & Trustless</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Smart contracts ensure secure transactions and automatic escrow without intermediaries.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors">
          <CardHeader>
            <Zap className="w-12 h-12 text-[#F0B90B] mb-4" />
            <CardTitle className="text-white">Instant Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Fast, low-cost transactions on BNB Chain with automatic token rewards for participation.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors">
          <CardHeader>
            <Globe className="w-12 h-12 text-[#F0B90B] mb-4" />
            <CardTitle className="text-white">Decentralized Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Tool images and data stored on BNB Greenfield for permanent, censorship-resistant access.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors">
          <CardHeader>
            <TrendingUp className="w-12 h-12 text-[#F0B90B] mb-4" />
            <CardTitle className="text-white">Earn Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Stake tokens, complete achievements, and earn rewards for contributing to the ecosystem.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="bg-[#181A20] rounded-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Platform Statistics</h2>
          <p className="text-gray-400">Growing community of tool sharers and renters</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#F0B90B] mb-2">1,234</div>
            <div className="text-gray-400">Tools Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#F0B90B] mb-2">567</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#F0B90B] mb-2">89</div>
            <div className="text-gray-400">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#F0B90B] mb-2">$12.5K</div>
            <div className="text-gray-400">Total Volume</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-white mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#F0B90B] rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-black">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Connect Wallet</h3>
            <p className="text-gray-400">Connect your Web3 wallet to access the decentralized platform</p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#F0B90B] rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-black">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Find or List Tools</h3>
            <p className="text-gray-400">Browse available tools or list your own for others to rent</p>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#F0B90B] rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-black">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Earn & Share</h3>
            <p className="text-gray-400">Complete rentals, earn tokens, and build community reputation</p>
          </div>
        </div>
      </section>
    </div>
  )
}
