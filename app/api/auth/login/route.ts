import { NextRequest, NextResponse } from "next/server"
import sql from "mssql"
import { sign } from "jsonwebtoken"

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "YourPassword123",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "CropcastDb",
  authentication: {
    type: "default",
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split(":")
    const crypto = require("crypto")
    const { scryptSync } = crypto
    const testHash = scryptSync(password, salt, 64).toString("hex")
    return testHash === storedHash
  } catch (error) {
    console.error("[v0] Password verification error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login request:", { email })

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Connect to database
    const pool = new sql.ConnectionPool(config)
    await pool.connect()

    try {
      // Get user by email
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM Users WHERE Email = @email AND IsActive = 1")

      if (result.recordset.length === 0) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }

      const user = result.recordset[0]

      // Verify password
      if (!verifyPassword(password, user.PasswordHash)) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }

      // Generate JWT token
      const token = sign(
        {
          id: user.Id,
          email: user.Email,
          name: `${user.FirstName} ${user.LastName}`.trim(),
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      )

      console.log("[v0] User logged in successfully:", user.Email)

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.Id,
          email: user.Email,
          name: `${user.FirstName} ${user.LastName}`.trim(),
        },
      })
    } finally {
      await pool.close()
    }
  } catch (error) {
    console.error("[v0] Login error:", error)
    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
