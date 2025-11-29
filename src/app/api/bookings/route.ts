import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { pickup, dropoff, vehicleType, datetime, seats, fare, paymentId, orderId } = body
    
    if (!pickup || !dropoff || !vehicleType || !datetime || !seats || !fare) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate payment information
    if (!paymentId || !orderId) {
      return NextResponse.json(
        { error: "Payment information is required. Please complete payment first." },
        { status: 400 }
      )
    }

    // Create booking with payment details
    const booking = {
      id: `BM${Date.now()}`,
      ...body,
      status: "confirmed",
      paymentStatus: "paid",
      paymentId,
      orderId,
      bookingDate: new Date().toISOString(),
      confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
    }

    // In a real app, you would:
    // 1. Store booking in database with payment details
    // 2. Update seat availability
    // 3. Send confirmation email/SMS with booking & payment info
    // 4. Create a transaction record

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking confirmed successfully! Payment received.",
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get bookings for a user (mock data)
    const bookings = [
      {
        id: "BM1234567890",
        pickup: "City Center",
        dropoff: "Airport",
        vehicleType: "government-bus",
        datetime: new Date().toISOString(),
        seats: ["1A", "1B"],
        fare: 100,
        status: "confirmed",
        paymentStatus: "paid",
        confirmationCode: "ABCD1234",
      },
    ]

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}