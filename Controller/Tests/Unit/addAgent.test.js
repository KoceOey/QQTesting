const { addEmployee } = require("../../handlers/employeeHandler");
const bcrypt = require("bcrypt");

const { connectToMySQL } = require("../../dbConnection");

jest.mock("bcrypt");

describe("addEmployee function", () => {
  afterEach(async () => {
    const pool = await connectToMySQL();

    // Hapus data dari tabel agent yang merujuk ke id yang akan dihapus dari tabel employee
    const [agentResult] = await pool.query(
      "SELECT * FROM agent WHERE employee_id = '1'"
    );
    await pool.query("DELETE FROM agent  WHERE employee_id IS NULL");
    if (agentResult.length === 0) {
      // Hapus data dari tabel employee
      await pool.query("DELETE FROM employee WHERE email = 'nicho@gmail.com'");
    } else {
      console.log("Data agent masih ada, data employee tidak dihapus");
    }
  });

  // T3.1
  it("should register user successfully", async () => {
    const req = {
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im0tMDAxIiwidHlwZSI6MCwiaWF0IjoxNzEzNzkxODc0LCJleHAiOjE3MTM4NzgyNzR9.hcpfaPhmE3sAM1AmlGwDWeqKjubCUEKyDmHX0ftd-1c",
      },
      body: {
        id: "1",
        name: "Nicholas",
        address: "Jalan Macan no 8",
        gender: "Male",
        email: "nicho@gmail.com",
        password: "rindudia123",
        type: 1,
        branchId: "test01",
        phoneNumber: "081827334567",
        whatsapp: "081827334567",
      },
      file: {
        path: "./uploads/profile.jpg",
        originalname: "profile.jpg",
        mimetype: "image/jpg",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");

    await addEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "User registered successfully",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("rindudia123", 10);
  });

  // T3.2
  it("should register user successfully", async () => {
    const req = {
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im0tMDAxIiwidHlwZSI6MCwiaWF0IjoxNzEzNzkxODc0LCJleHAiOjE3MTM4NzgyNzR9.hcpfaPhmE3sAM1AmlGwDWeqKjubCUEKyDmHX0ftd-1c",
      },
      body: {
        id: "1",
        name: "Nicholas",
        address: "Jalan Macan no 8",
        gender: "Female",
        email: "nicho@gmail.com",
        password: "rindudia123",
        type: 1,
        branchId: "test01",
        phoneNumber: "081827334567",
        whatsapp: "081827334567",
      },
      file: {
        path: "./uploads/profile.jpg",
        originalname: "profile.jpg",
        mimetype: "image/jpg",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");

    await addEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: "User registered successfully",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("rindudia123", 10);
  });

  // T3.3
  it("should return 400 if file type is not supported", async () => {
    const req = {
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im0tMDAxIiwidHlwZSI6MCwiaWF0IjoxNzEzNzkxODc0LCJleHAiOjE3MTM4NzgyNzR9.hcpfaPhmE3sAM1AmlGwDWeqKjubCUEKyDmHX0ftd-1c",
      },
      body: {
        id: "1",
        name: "Nicholas",
        address: "Jalan Macan no 8",
        gender: "Male",
        email: "nicho@gmail.com",
        password: "rindudia123",
        type: 1,
        branchId: "test01",
        phoneNumber: "081827334567",
        whatsapp: "081827334567",
      },
      file: {
        path: "./uploads/file.pptx",
        originalname: "file.pptx",
        mimetype: "application/pptx",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");

    await addEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      message: "File type not supported",
    });
  });

  // T3.4
  it("should return 400 if email already exists", async () => {
    const req = {
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im0tMDAxIiwidHlwZSI6MCwiaWF0IjoxNzEzNzkxODc0LCJleHAiOjE3MTM4NzgyNzR9.hcpfaPhmE3sAM1AmlGwDWeqKjubCUEKyDmHX0ftd-1c",
      },
      body: {
        id: "1",
        name: "Nicholas",
        address: "Jalan Macan no 8",
        gender: "Male",
        email: "tantan@gmail.com",
        password: "rindudia123",
        type: 1,
        branchId: "test01",
        phoneNumber: "081827334567",
        whatsapp: "081827334567",
      },
      file: {
        path: "./uploads/profile.jpg",
        originalname: "profile.jpg",
        mimetype: "image/jpg",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");

    // Mock pool.query to simulate email already exists
    pool = {
      query: jest.fn().mockImplementation((query, values) => {
        if (query.includes("SELECT") && values[0] === req.body.email) {
          // Email already exists
          return [{ email: req.body.email }];
        } else {
          // Email does not exist
          return [];
        }
      }),
    };

    await addEmployee(req, res, pool);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      message: "Email already exists",
    });
  });

  // T3.5
  it("should return 401 if unauthorized", async () => {
    const req = {
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEtMDAxIiwidHlwZSI6MSwiaWF0IjoxNzEzNzkxODc0LCJleHAiOjE3MTM4NzgyNzR9.wqkas9V3Nueq-h-hJ6Z0LlRvu5OVrs4G4Eb0Pcv01nw",
      },
      body: {
        id: "1",
        name: "Nicholas",
        address: "Jalan Macan no 8",
        gender: "Male",
        email: "nicho@gmail.com",
        password: "rindudia123",
        type: 1,
        branchId: "test01",
        phoneNumber: "081827334567",
        whatsapp: "081827334567",
      },
      file: {
        path: "./uploads/profile.jpg",
        originalname: "profile.jpg",
        mimetype: "image/jpg",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    bcrypt.hash.mockResolvedValue("hashedPassword");

    await addEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: "Error: Invalid credentials",
    });
  });
});