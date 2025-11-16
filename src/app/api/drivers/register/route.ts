import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const name = formData.get("name") as string
    const contact = formData.get("contact") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const district = formData.get("district") as string
    const license = formData.get("license") as string
    const vehicle = formData.get("vehicle") as string
    const bloodGroup = formData.get("bloodGroup") as string
    const email = formData.get("email") as string
    const idUpload = formData.get("idUpload") as File

    // Validate required fields
    if (!name || !contact || !address || !city || !district || !license || !vehicle || !bloodGroup) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate file upload
    if (!idUpload || idUpload.size === 0) {
      return NextResponse.json(
        { error: "Vehicle ID/License document is required" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(idUpload.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and PDF are allowed" },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (idUpload.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      )
    }

    // Create driver application
    const application = {
      id: `DRV${Date.now()}`,
      name,
      contact,
      address,
      city,
      district,
      license,
      vehicle,
      bloodGroup,
      email: email || null,
      fileName: idUpload.name,
      fileSize: idUpload.size,
      fileType: idUpload.type,
      status: "pending",
      appliedDate: new Date().toISOString(),
      applicationNumber: Math.random().toString(36).substring(2, 12).toUpperCase(),
    }

    // In a real app, you would:
    // 1. Upload the file to cloud storage (S3, Cloudinary, etc.)
    // 2. Store application in database
    // 3. Send confirmation email/SMS
    // 4. Trigger verification workflow
    // 5. Notify admin team

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      application,
      message: "Application submitted successfully! You'll receive a confirmation within 24-48 hours.",
    })
  } catch (error) {
    console.error("Driver registration error:", error)
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    )
  }
}
