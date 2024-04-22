// Import the function to be tested
const { setStatusPropertyHandler } = require('../../handlers/propertyHandler.js');

// Mock dependencies
jest.mock('../../dbConnection.js', () => ({
    connectToMongoDB: jest.fn().mockResolvedValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockImplementation((filter) => {
          if (filter.id === '1') { // Asumption -> only property is with id 1
            return {}; // Return empty object when propertyId is "1"
          } else {
            return null; // Return null for other propertyId values
          }
        }),
      updateOne: jest.fn().mockResolvedValue({}),
    }),
}));

// Mock getTokenData function
jest.mock('../../handlers/authenticationHandler.js', () => ({
  getTokenData: jest.fn().mockReturnValue({ id: 1 }), // Mock token data
  checkUserType: jest.fn().mockImplementation((authHeader) => {
    if (authHeader === 'Bearer mock-admin-token') { // admin token -> type = 0
      return true;
    } else { // agent token -> type = 1
      return false;
    }
  }),
}));

// Mock addLog function
const addLog = jest.fn();

// Mock  and response objects
const res = {
  status: jest.fn().mockReturnThis(), 
  json: jest.fn(),
};

describe('setStatusPropertyHandler', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock function calls after each test
    });
  
    it('should return 200 if property is successfully updated', async () => {
        const req = {
          headers: { authorization: 'Bearer mock-admin-token' },
          body: { propertyId: 1 },
          method: 'PUT',
        };
    
        await setStatusPropertyHandler(req, res);
    
        expect(res.json).toHaveBeenCalledWith({ status: 200, message: 'Property berhasil diapprove' });
      });

    it('should return 404 if property not found', async () => {
      const req = {
        headers: { authorization: 'Bearer mock-admin-token' },
        body: { propertyId: 2 },
        method: 'PUT',
      };
  
      await setStatusPropertyHandler(req, res);
  
      expect(res.json).toHaveBeenCalledWith({ status: 404, message: 'Error: Property not found' });
    });
  
    it('should return 401 if employee type != 0', async () => {
        const req = {
          headers: { authorization: 'Bearer mock-agent-token' },
          body: { propertyId: 1 },
          method: 'PUT',
        };
      
        await setStatusPropertyHandler(req, res);
      
        expect(res.json).toHaveBeenCalledWith({ status: 401, message: 'Error: Invalid credentials' });
    });
});