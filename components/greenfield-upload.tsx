"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon, File } from "lucide-react"
import { type UploadResult } from "@/lib/greenfield-storage"
import { useGreenfield } from "@/hooks/use-greenfield"
import { toast } from "@/hooks/use-toast"

interface GreenfieldUploadProps {
  onUploadComplete: (result: UploadResult) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  multiple?: boolean
}

export function GreenfieldUpload({
  onUploadComplete,
  acceptedTypes = ["image/*"],
  maxSize = 10,
  multiple = false,
}: GreenfieldUploadProps) {
  const { uploadFile: greenfieldUpload, isInitialized, isLoading: isGreenfieldLoading, error: greenfieldError } = useGreenfield()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ file: File; result: UploadResult }>>([])

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some((type) => {
      if (type === "image/*") return file.type.startsWith("image/")
      if (type === "video/*") return file.type.startsWith("video/")
      if (type === "audio/*") return file.type.startsWith("audio/")
      return file.type === type
    })

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(", ")}`
    }

    return null
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await greenfieldUpload(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        const uploadedFile = { file, result }
        setUploadedFiles((prev) => [...prev, uploadedFile])
        onUploadComplete(result)

        toast({
          title: "Upload Successful",
          description: `${file.name} uploaded to BNB Greenfield`,
        })
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload file",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleFiles = async (files: FileList) => {
    // Check if wallet is connected and Greenfield is initialized
    if (!isInitialized) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to upload files to Greenfield",
        variant: "destructive",
      })
      return
    }

    if (greenfieldError) {
      toast({
        title: "Greenfield Error",
        description: greenfieldError,
        variant: "destructive",
      })
      return
    }

    const fileArray = Array.from(files)

    if (!multiple && fileArray.length > 1) {
      toast({
        title: "Multiple Files Not Allowed",
        description: "Please select only one file",
        variant: "destructive",
      })
      return
    }

    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        toast({
          title: "Invalid File",
          description: error,
          variant: "destructive",
        })
        continue
      }

      await uploadFile(file)

      if (!multiple) break // Only upload one file if multiple is false
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-[#F0B90B]" />
    return <File className="w-8 h-8 text-[#F0B90B]" />
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging
            ? "border-[#F0B90B] bg-[#F0B90B]/5"
            : isUploading
              ? "border-blue-500 bg-blue-500/5"
              : "border-gray-600 hover:border-[#F0B90B] bg-[#181A20]"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={acceptedTypes.join(",")}
            multiple={multiple}
            onChange={handleFileInput}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
              <div>
                <p className="text-white font-medium mb-2">Uploading to BNB Greenfield...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-gray-400 text-sm mt-2">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-[#F0B90B]" />
              </div>
              <div>
                <p className="text-white font-medium mb-2">
                  {isDragging ? "Drop files here" : "Upload to BNB Greenfield"}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Drag and drop files or{" "}
                  <label htmlFor="file-upload" className="text-[#F0B90B] hover:underline cursor-pointer">
                    browse
                  </label>
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                  <span>Max size: {maxSize}MB</span>
                  <span>•</span>
                  <span>Types: {acceptedTypes.join(", ")}</span>
                  {multiple && (
                    <>
                      <span>•</span>
                      <span>Multiple files allowed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium">Uploaded Files</h4>
          {uploadedFiles.map((item, index) => (
            <Card key={index} className="bg-[#0B0E11] border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(item.file)}
                    <div>
                      <p className="text-white font-medium">{item.file.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{formatFileSize(item.file.size)}</span>
                        {item.result.success && (
                          <>
                            <span>•</span>
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Uploaded
                            </Badge>
                          </>
                        )}
                        {!item.result.success && (
                          <>
                            <span>•</span>
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Failed
                            </Badge>
                          </>
                        )}
                      </div>
                      {item.result.hash && <p className="text-xs text-gray-500 mt-1">Hash: {item.result.hash}</p>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Greenfield Info */}
      <Card className="bg-[#F0B90B]/5 border-[#F0B90B]/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#F0B90B] rounded-full animate-pulse"></div>
            <p className="text-[#F0B90B] text-sm font-medium">BNB Greenfield Storage</p>
          </div>
          <p className="text-gray-300 text-xs mt-1">
            Files are stored on decentralized storage with permanent availability and content addressing.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
