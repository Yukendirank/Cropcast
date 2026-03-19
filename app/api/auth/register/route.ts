import { NextRequest, NextResponse } from "next/server"
import sql from "mssql"

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

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    console.log("[v0] Registration request:", { email, name })

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Connect to database
    const pool = new sql.ConnectionPool(config)
    await pool.connect()

    try {
      // Check if user already exists
      const existingUser = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM Users WHERE Email = @email")

      if (existingUser.recordset.length > 0) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        )
      }

      // Hash password using bcrypt
      // Using Node.js crypto for now - in production use bcrypt package
      const crypto = require("crypto")
      const { scryptSync, randomBytes } = crypto
      
      const salt = randomBytes(16).toString("hex")
      const hashedPassword = scryptSync(password, salt, 64).toString("hex")
      const passwordHash = `${salt}:${hashedPassword}`

      // Insert user
      const result = await pool
        .request()
        .input("firstName", sql.VarChar, name.split(" ")[0] || name)
        .input("lastName", sql.VarChar, name.split(" ").slice(1).join(" ") || "")
        .input("email", sql.VarChar, email)
        .input("passwordHash", sql.VarChar, passwordHash)
        .input("location", sql.VarChar, "")
        .input("createdAt", sql.DateTime, new Date())
        .input("isActive", sql.Bit, 1)
        .query(`
          INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Location, CreatedAt, IsActive)
          VALUES (@firstName, @lastName, @email, @passwordHash, @location, @createdAt, @isActive);
          SELECT * FROM Users WHERE Email = @email
        `)

      const newUser = result.recordset[result.recordset.length - 1]

      console.log("[v0] User registered successfully:", newUser.Email)

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.Id,
          email: newUser.Email,
          name: `${newUser.FirstName} ${newUser.LastName}`.trim(),
        },
      })
    } finally {
      await pool.close()
    }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
