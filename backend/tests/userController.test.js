import { jest } from '@jest/globals';

// Mock the User model
const mockSave = jest.fn();
const mockUser = {
  _id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  isAdmin: false,
  theme: 'light',
  save: mockSave,
};

// Provide a mocked default export for the User model
jest.unstable_mockModule('../models/userModel.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

// Import the module under test (ESM dynamic import since jest ESM mocks unstable)
let updateUserProfile;
let User;

beforeAll(async () => {
  User = (await import('../models/userModel.js')).default;
  const ctrl = await import('../controllers/userController.js');
  updateUserProfile = ctrl.updateUserProfile;
});

beforeEach(() => {
  jest.clearAllMocks();
  // Default behavior: findById returns a user object whose save resolves to updated user
  mockSave.mockResolvedValue({
    _id: mockUser._id,
    name: mockUser.name,
    email: mockUser.email,
    isAdmin: mockUser.isAdmin,
    theme: 'dark',
  });
  User.findById.mockResolvedValue({ ...mockUser, save: mockSave });
});

test('updateUserProfile updates theme and returns updated user', async () => {
  const req = {
    user: { _id: mockUser._id },
    body: { theme: 'dark' },
  };

  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const res = { json, status };

  await updateUserProfile(req, res);

  expect(User.findById).toHaveBeenCalledWith(mockUser._id);
  expect(mockSave).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ theme: 'dark' })
  );
});
