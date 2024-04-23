const { getPropertyHandler } = require("../../handlers/propertyHandler"); // Sesuaikan dengan modul propertyHandler Anda
const { connectToMongoDB } = require("../../dbConnection"); // Sesuaikan dengan modul koneksi database Anda

jest.mock("../../dbConnection"); // Mock modul koneksi database

describe("Unit Testing for getPropertyHandler", () => {
  let req, res, db;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    db = {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn(),
      }),
    };
    connectToMongoDB.Get.mockResolvedValue(db);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // T2.1
  it("should return properties based on provided filters", async () => {
    req.body = {
      id: 1,
      City: "Bandung",
      Type: "House",
      "Price Range (min)": 500000000,
      "Price Range (max)": 2000000000,
      "Land Area Range": "0-100",
      "Floor Level": 2,
    };

    const mockProperties = [
      {
        id: "7Pp8zIYd",
        agent: "a-001",
        title: "Best Price. Rumah Melati Mas, Lengkong",
        desc: "Luas tanah 90m2,\nSHM,\nHadap Utara,\nRow jalan 2 mobil,\n\nHarga : Rp. 1,25M nego\n\n\nHubungi :\nReza (Ray White BSD City - 081284089468)\n- Top 3 Ray White BSD City (rank 2)\n- Top 3 Ray White BSD City (rank 3) 2022",
        type: "House",
        area: "Bandung",
        price: 1250000000,
        bedroomCount: 2,
        bathroomCount: 1,
        landArea: 90,
        garage: "true",
        floorLevel: "2",
        listingDate: "17-04-2024",
        approvedDate: "2024-04-18",
        status: 1,
        images: [
          "https://storage.googleapis.com/quantum-quarters-property/House/7Pp8zIYd/427550-87973156__1713364039-114221-IMG-20240417-WA0015-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/House/7Pp8zIYd/427550-87973157__1713364041-126308-IMG-20240416-WA0002-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/House/7Pp8zIYd/427550-87973158__1713364042-120334-IMG-20240416-WA0003-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/House/7Pp8zIYd/427550-87973159__1713364045-126319-IMG-20240416-WA0005-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/House/7Pp8zIYd/427550-87973162__1713364050-112481-IMG-20240416-WA0008-794.jpg",
        ],
      },
    ];

    db.collection().find().toArray.mockResolvedValue(mockProperties);

    await getPropertyHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: mockProperties,
    });
  });

  // T2.2
  it("should return properties based on provided filters", async () => {
    req.body = {
      id: 1,
      City: "Jakarta",
      Type: "Apartment",
      "Price Range (min)": 500000000,
      "Price Range (max)": 1200000000,
      "Land Area Range": "0-100",
      "Floor Level": 1,
    };

    const mockProperties = [
      {
        id: "tcZn8cXm",
        agent: "a-001",
        title: "Dijual/disewakan Unit Apartment Belleza Permata Hijau",
        desc: "Dijual/disewakan Unit Apartment Belleza Permata Hijau\nJakarta Selatan\n\nLuas 45m2\nSemi gross\nFull furnish\nType Studio\n\nHarga Jual Rp. 1,125 Milyar nego",
        type: "Apartment",
        area: "Jakarta",
        price: 1125000000,
        bedroomCount: 3,
        bathroomCount: 1,
        landArea: 45,
        garage: "true",
        floorLevel: "1",
        listingDate: "17-04-2024",
        approvedDate: "",
        status: 0,
        images: [
          "https://storage.googleapis.com/quantum-quarters-property/Apartment/tcZn8cXm/427494-87960391__1713336014-112280-WhatsAppImage2024-04-03at14.14.37-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/Apartment/tcZn8cXm/427494-87960379__1713336004-105487-WhatsAppImage2024-04-03at14.14.35-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/Apartment/tcZn8cXm/427494-87960382__1713336006-60026-WhatsAppImage2024-04-03at14.14.361-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/Apartment/tcZn8cXm/427494-87960384__1713336008-105878-WhatsAppImage2024-04-03at14.14.36-794.jpg",
          "https://storage.googleapis.com/quantum-quarters-property/Apartment/tcZn8cXm/427494-87960387__1713336010-105684-WhatsAppImage2024-04-03at14.14.371-794.jpg",
        ],
      },
    ];

    db.collection().find().toArray.mockResolvedValue(mockProperties);

    await getPropertyHandler(req, res);
    console.log("Response:", res.json.mock.calls[0][0]);
    console.log(mockProperties);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: mockProperties,
    });
  });

  // T2.3
  it("should return properties based on provided filters", async () => {
    req.body = {
      id: 1,
      City: "Jakarta",
      Type: "Office",
      "Price Range (min)": 800000000,
      "Price Range (max)": 5000000000,
      "Land Area Range": "100-250",
      "Floor Level": 2,
    };

    const mockProperties = [{}];

    db.collection().find().toArray.mockResolvedValue(mockProperties);

    await getPropertyHandler(req, res);
    console.log("Response:", res.json.mock.calls[0][0]);
    console.log(mockProperties);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: mockProperties,
    });
  });
});
