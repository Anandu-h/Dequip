"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, Shield, MapPin, Star, User, CreditCard, FileText } from "lucide-react"
import { format, addDays, differenceInDays } from "date-fns"
import { TOOLCHAIN_CONTRACT_ADDRESS, TOOLCHAIN_ABI, type Tool } from "@/lib/contracts"

interface RentalBookingProps {
  tool: Tool
  onClose: () => void
  onSuccess?: () => void
}

export function RentalBooking({ tool, onClose, onSuccess }: RentalBookingProps) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [notes, setNotes] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const calculateDays = () => {
    if (!startDate || !endDate) return 1
    const days = differenceInDays(endDate, startDate) + 1
    return Math.max(1, days)
  }

  const calculateTotal = () => {
    const days = calculateDays()
    return (Number.parseFloat(tool.pricePerDay) * days).toFixed(4)
  }

  const calculateDeposit = () => {
    const total = Number.parseFloat(calculateTotal())
    return (total * 0.2).toFixed(4) // 20% security deposit
  }

  const calculateTotalPayment = () => {
    const total = Number.parseFloat(calculateTotal())
    const deposit = Number.parseFloat(calculateDeposit())
    return (total + deposit).toFixed(4)
  }

  const handleDateSelect = (date: Date | undefined, type: "start" | "end") => {
    if (!date) return

    if (type === "start") {
      setStartDate(date)
      if (!endDate || date > endDate) {
        setEndDate(addDays(date, 1))
      }
    } else {
      if (startDate && date < startDate) {
        toast({
          title: "Invalid Date",
          description: "End date cannot be before start date",
          variant: "destructive",
        })
        return
      }
      setEndDate(date)
    }
  }

  const handleRent = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to rent this tool",
        variant: "destructive",
      })
      return
    }

    if (!startDate || !endDate) {
      toast({
        title: "Select Dates",
        description: "Please select start and end dates for your rental",
        variant: "destructive",
      })
      return
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the rental terms and conditions",
        variant: "destructive",
      })
      return
    }

    try {
      const days = calculateDays()
      const totalPayment = parseEther(calculateTotalPayment())

      await writeContract({
        address: TOOLCHAIN_CONTRACT_ADDRESS,
        abi: TOOLCHAIN_ABI,
        functionName: "rentTool",
        args: [BigInt(tool.id), BigInt(days)],
        value: totalPayment,
      })

      toast({
        title: "Rental Confirmed!",
        description: `Successfully rented ${tool.name} for ${days} days`,
      })

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Error renting tool:", error)
      toast({
        title: "Rental Failed",
        description: "Failed to process rental. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isValidBooking = startDate && endDate && agreedToTerms && isConnected

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tool Information */}
      <Card className="bg-[#181A20] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F0B90B]" />
            Rental Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <img
              src={tool.imageUrl || "/placeholder.svg"}
              alt={tool.name}
              className="w-20 h-20 rounded-lg object-cover border border-gray-600"
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">{tool.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center text-gray-400">
                  <User className="w-4 h-4 mr-2" />
                  Owner: {tool.owner.slice(0, 6)}...{tool.owner.slice(-4)}
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {tool.location}
                </div>
                <div className="flex items-center text-gray-400">
                  <Star className="w-4 h-4 mr-2 text-[#F0B90B] fill-current" />
                  {tool.rating} rating
                </div>
                <div className="flex items-center text-[#F0B90B] font-semibold">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {tool.pricePerDay} BNB per day
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Selection */}
      <Card className="bg-[#181A20] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#F0B90B]" />
            Select Rental Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-[#0B0E11] border-gray-700 text-white hover:bg-gray-800"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#181A20] border-gray-700">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateSelect(date, "start")}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-white">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-[#0B0E11] border-gray-700 text-white hover:bg-gray-800"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#181A20] border-gray-700">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateSelect(date, "end")}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && (
            <div className="p-3 bg-[#0B0E11] rounded-lg border border-gray-700">
              <div className="flex items-center text-[#F0B90B]">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">Rental Duration: {calculateDays()} days</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card className="bg-[#181A20] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Additional Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or questions for the tool owner..."
            className="bg-[#0B0E11] border-gray-700 text-white placeholder-gray-400"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Pricing Breakdown */}
      <Card className="bg-[#181A20] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#F0B90B]" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>
                Rental ({calculateDays()} days × {tool.pricePerDay} BNB)
              </span>
              <span>{calculateTotal()} BNB</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Security Deposit (20%)
              </span>
              <span>{calculateDeposit()} BNB</span>
            </div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total Payment</span>
                <span className="text-[#F0B90B]">{calculateTotalPayment()} BNB</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">Security deposit will be refunded after tool return</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Actions */}
      <Card className="bg-[#181A20] border-gray-700">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#F0B90B] bg-[#0B0E11] border-gray-600 rounded focus:ring-[#F0B90B]"
            />
            <label htmlFor="terms" className="text-gray-300 text-sm">
              I agree to the <button className="text-[#F0B90B] hover:underline">rental terms and conditions</button> and
              understand that I am responsible for the tool during the rental period.
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRent}
              disabled={!isValidBooking || isPending || isConfirming}
              className="flex-1 bg-[#F0B90B] text-black hover:bg-[#D4A017]"
            >
              {isPending || isConfirming ? "Processing..." : `Rent for ${calculateTotalPayment()} BNB`}
            </Button>
          </div>

          {!isConnected && (
            <div className="text-center">
              <Badge variant="outline" className="border-red-500 text-red-400">
                Connect your wallet to complete rental
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
