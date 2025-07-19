"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Trophy, Gift, TrendingUp, Calendar, Target, Zap, Lock, CheckCircle } from "lucide-react"
import { useAccount, useBalance } from "wagmi"

interface Achievement {
  id: number
  title: string
  description: string
  reward: number
  isCompleted: boolean
  progress: number
  maxProgress: number
  category: string
}

interface RewardTier {
  name: string
  minStake: number
  dailyReward: string
  benefits: string[]
  color: string
  isActive: boolean
}

export function RewardsPage() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  const [stakedAmount, setStakedAmount] = useState(0)
  const [pendingRewards, setPendingRewards] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const achievements: Achievement[] = [
    {
      id: 1,
      title: "First Rental",
      description: "Complete your first tool rental",
      reward: 100,
      isCompleted: true,
      progress: 1,
      maxProgress: 1,
      category: "milestone",
    },
    {
      id: 2,
      title: "Tool Collector",
      description: "List 5 tools on the platform",
      reward: 500,
      isCompleted: false,
      progress: 2,
      maxProgress: 5,
      category: "listing",
    },
    {
      id: 3,
      title: "Community Helper",
      description: "Help 10 community members",
      reward: 300,
      isCompleted: false,
      progress: 7,
      maxProgress: 10,
      category: "community",
    },
    {
      id: 4,
      title: "Power User",
      description: "Complete 50 successful rentals",
      reward: 1000,
      isCompleted: false,
      progress: 23,
      maxProgress: 50,
      category: "milestone",
    },
    {
      id: 5,
      title: "Early Adopter",
      description: "Join the platform in the first month",
      reward: 200,
      isCompleted: true,
      progress: 1,
      maxProgress: 1,
      category: "special",
    },
    {
      id: 6,
      title: "Reputation Master",
      description: "Reach 1000 reputation points",
      reward: 750,
      isCompleted: false,
      progress: 650,
      maxProgress: 1000,
      category: "reputation",
    },
  ]

  const rewardTiers: RewardTier[] = [
    {
      name: "Bronze",
      minStake: 0,
      dailyReward: "0.1%",
      benefits: ["Basic rewards", "Community access"],
      color: "bg-orange-600",
      isActive: stakedAmount >= 0 && stakedAmount < 1000,
    },
    {
      name: "Silver",
      minStake: 1000,
      dailyReward: "0.15%",
      benefits: ["Enhanced rewards", "Priority support", "Exclusive events"],
      color: "bg-gray-400",
      isActive: stakedAmount >= 1000 && stakedAmount < 5000,
    },
    {
      name: "Gold",
      minStake: 5000,
      dailyReward: "0.2%",
      benefits: ["Premium rewards", "VIP support", "Beta features", "Governance voting"],
      color: "bg-yellow-500",
      isActive: stakedAmount >= 5000 && stakedAmount < 10000,
    },
    {
      name: "Platinum",
      minStake: 10000,
      dailyReward: "0.25%",
      benefits: ["Maximum rewards", "Personal account manager", "Early access", "Revenue sharing"],
      color: "bg-purple-500",
      isActive: stakedAmount >= 10000,
    },
  ]

  const dailyTasks = [
    { id: 1, title: "Check marketplace", reward: 10, completed: true },
    { id: 2, title: "List a new tool", reward: 50, completed: false },
    { id: 3, title: "Complete a rental", reward: 100, completed: false },
    { id: 4, title: "Help in community", reward: 25, completed: true },
  ]

  useEffect(() => {
    // Simulate fetching user data
    if (isConnected) {
      setStakedAmount(2500) // Mock staked amount
      setPendingRewards(45.67) // Mock pending rewards
      setTotalEarned(1234.56) // Mock total earned
    }
  }, [isConnected])

  const handleStake = () => {
    // Implement staking logic
    console.log("Staking tokens...")
  }

  const handleClaimRewards = () => {
    // Implement claim rewards logic
    console.log("Claiming rewards...")
  }

  const handleUnstake = () => {
    // Implement unstaking logic
    console.log("Unstaking tokens...")
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <Card className="bg-[#181A20] border-gray-700 p-8 text-center">
          <CardContent>
            <Lock className="w-16 h-16 text-[#F0B90B] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Connect your wallet to view and manage your rewards</p>
            <Button className="bg-[#F0B90B] text-black hover:bg-[#D4A017]">Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Rewards Center</h1>
          <p className="text-gray-400">Earn, stake, and unlock rewards in the ToolChain ecosystem</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#181A20] border-gray-700">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-[#F0B90B]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="staking" className="text-gray-300 data-[state=active]:text-[#F0B90B]">
              Staking
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-gray-300 data-[state=active]:text-[#F0B90B]">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-gray-300 data-[state=active]:text-[#F0B90B]">
              Daily Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Rewards Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-[#181A20] border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Earned</CardTitle>
                  <Coins className="h-4 w-4 text-[#F0B90B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalEarned.toFixed(2)} TOOL</div>
                  <p className="text-xs text-gray-400">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-[#181A20] border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Pending Rewards</CardTitle>
                  <Gift className="h-4 w-4 text-[#F0B90B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{pendingRewards.toFixed(2)} TOOL</div>
                  <Button
                    size="sm"
                    className="mt-2 bg-[#F0B90B] text-black hover:bg-[#D4A017]"
                    onClick={handleClaimRewards}
                  >
                    Claim Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#181A20] border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Staked Amount</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#F0B90B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stakedAmount.toLocaleString()} TOOL</div>
                  <p className="text-xs text-gray-400">Earning daily rewards</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Tier */}
            <Card className="bg-[#181A20] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-[#F0B90B]" />
                  Your Reward Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {rewardTiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`p-4 rounded-lg border-2 ${
                        tier.isActive ? "border-[#F0B90B] bg-[#F0B90B]/10" : "border-gray-700 bg-[#0B0E11]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{tier.name}</h3>
                        {tier.isActive && <CheckCircle className="w-5 h-5 text-[#F0B90B]" />}
                      </div>
                      <div className={`w-4 h-4 rounded-full ${tier.color} mb-2`}></div>
                      <p className="text-sm text-gray-400 mb-2">Min: {tier.minStake.toLocaleString()} TOOL</p>
                      <p className="text-sm text-[#F0B90B] font-semibold">{tier.dailyReward} daily</p>
                      <ul className="mt-2 space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="text-xs text-gray-400">
                            • {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staking" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Staking Interface */}
              <Card className="bg-[#181A20] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-[#F0B90B]" />
                    Stake TOOL Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount to Stake</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="flex-1 px-3 py-2 bg-[#0B0E11] border border-gray-700 rounded-md text-white"
                      />
                      <Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
                        Max
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Available: {balance ? Number.parseFloat(balance.formatted).toFixed(2) : "0.00"} TOOL
                    </p>
                  </div>
                  <Button className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017]" onClick={handleStake}>
                    Stake Tokens
                  </Button>
                </CardContent>
              </Card>

              {/* Staking Stats */}
              <Card className="bg-[#181A20] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Staking Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Currently Staked</span>
                    <span className="text-white font-semibold">{stakedAmount.toLocaleString()} TOOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Rewards</span>
                    <span className="text-[#F0B90B] font-semibold">{(stakedAmount * 0.002).toFixed(2)} TOOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">APY</span>
                    <span className="text-green-400 font-semibold">73%</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:border-[#F0B90B] hover:text-[#F0B90B] bg-transparent"
                    onClick={handleUnstake}
                  >
                    Unstake Tokens
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`bg-[#181A20] border-gray-700 ${
                    achievement.isCompleted ? "ring-2 ring-[#F0B90B]/50" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{achievement.title}</CardTitle>
                      {achievement.isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-[#F0B90B]" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{achievement.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30">
                        {achievement.category}
                      </Badge>
                      <div className="flex items-center text-[#F0B90B]">
                        <Coins className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{achievement.reward} TOOL</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card className="bg-[#181A20] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#F0B90B]" />
                  Daily Tasks
                </CardTitle>
                <p className="text-gray-400">Complete daily tasks to earn bonus rewards</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        task.completed ? "border-green-500 bg-green-500/10" : "border-gray-700 bg-[#0B0E11]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Target className="w-5 h-5 text-gray-400" />
                        )}
                        <span className={`${task.completed ? "text-green-400" : "text-white"}`}>{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4 text-[#F0B90B]" />
                        <span className="text-[#F0B90B] font-semibold">{task.reward} TOOL</span>
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
