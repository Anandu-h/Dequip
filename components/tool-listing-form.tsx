"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { GreenfieldUpload } from "./greenfield-upload"
import { Wrench, MapPin, Calendar, DollarSign, Tag, FileText, ImageIcon } from "lucide-react"
import type { UploadResult } from "@/lib/greenfield-storage"

interface ToolFormData {
  name: string
  description: string
  category: string
  pricePerDay: string
  location: string
  availability: string
  condition: string
  imageHash?: string
  imageUrl?: string
}

const TOOL_CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Garden Tools",
  "Construction Equipment",
  "Automotive Tools",
  "Cleaning Equipment",
  "Kitchen Appliances",
  "Electronics",
  "Sports Equipment",
  "Other",
]

const TOOL_CONDITIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"]

export function ToolListingForm() {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState<ToolFormData>({
    name: "",
    description: "",
    category: "",
    pricePerDay: "",
    location: "",
    availability: "",
    condition: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)

  const handleInputChange = (field: keyof ToolFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (result: UploadResult) => {
    if (result.success) {
      setFormData((prev) => ({
        ...prev,
        imageHash: result.hash,
        imageUrl: result.url,
      }))
      setImageUploaded(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to list a tool",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    const requiredFields = ["name", "description", "category", "pricePerDay", "location", "condition"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof ToolFormData])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate smart contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, this would call the smart contract
      console.log("Listing tool with data:", formData)

      toast({
        title: "Tool Listed Successfully!",
        description: "Your tool is now available for rent on the platform",
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        pricePerDay: "",
        location: "",
        availability: "",
        condition: "",
      })
      setImageUploaded(false)
    } catch (error) {
      toast({
        title: "Listing Failed",
        description: "Failed to list your tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-[#181A20] border-gray-700 text-white max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to list tools for rent on the platform.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-[#181A20] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#F0B90B]" />
            List Your Tool for Rent
          </CardTitle>
          <p className="text-gray-400">
            Share your tools with the community and earn tokens while helping others complete their projects.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool Information Form */}
        <Card className="bg-[#181A20] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F0B90B]" />
              Tool Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tool Name */}
              <div>
                <Label htmlFor="name" className="text-white">
                  Tool Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., DeWalt Circular Saw"
                  className="bg-[#0B0E11] border-gray-600 text-white"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-white">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your tool, its condition, and any special instructions..."
                  className="bg-[#0B0E11] border-gray-600 text-white min-h-[100px]"
                />
              </div>

              {/* Category */}
              <div>
                <Label className="text-white">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-[#0B0E11] border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B0E11] border-gray-600">
                    {TOOL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price and Location Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-white flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Price per Day (TCT) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.pricePerDay}
                    onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
                    placeholder="10.00"
                    className="bg-[#0B0E11] border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-white flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                    className="bg-[#0B0E11] border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Condition and Availability Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Condition *
                  </Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger className="bg-[#0B0E11] border-gray-600 text-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0E11] border-gray-600">
                      {TOOL_CONDITIONS.map((condition) => (
                        <SelectItem key={condition} value={condition} className="text-white hover:bg-gray-700">
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="availability" className="text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Availability
                  </Label>
                  <Input
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleInputChange("availability", e.target.value)}
                    placeholder="Available immediately"
                    className="bg-[#0B0E11] border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017] font-semibold"
              >
                {isSubmitting ? "Listing Tool..." : "List Tool for Rent"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <div className="space-y-6">
          <Card className="bg-[#181A20] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#F0B90B]" />
                Tool Images
              </CardTitle>
              <p className="text-gray-400 text-sm">Upload high-quality images to attract more renters</p>
            </CardHeader>
          </Card>

          <GreenfieldUpload onUploadComplete={handleImageUpload} acceptedTypes={["image/*"]} maxSize={10} />

          {/* Upload Status */}
          {imageUploaded && (
            <Card className="bg-[#0B0E11] border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Image Uploaded</Badge>
                  <span className="text-green-400 text-sm">Ready to list!</span>
                </div>
                {formData.imageHash && (
                  <p className="text-gray-400 text-xs mt-2">Greenfield Hash: {formData.imageHash}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
