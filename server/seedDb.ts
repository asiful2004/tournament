import { storage } from './storage';
import { hashPassword } from './auth';

export async function seedDatabase() {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail('asiful2004@yahoo.com');
    
    if (!existingAdmin) {
      // Create demo admin account
      const hashedPassword = await hashPassword('1234');
      
      const admin = await storage.createUser({
        name: 'Demo Admin',
        email: 'asiful2004@yahoo.com',
        password: hashedPassword,
        role: 'admin',
        isAgeVerified: true,
        emailVerified: true,
        acceptedTerms: true,
        acceptedPrivacy: true,
        dateOfBirth: new Date('1990-01-01'),
      });

      console.log('✓ Demo admin created:', admin.email);
      
      // Create default settings
      await storage.setSetting('website_name', 'SkillsMoney Tournament Platform');
      await storage.setSetting('website_logo', '/logo.png');
      await storage.setSetting('website_favicon', '/favicon.ico');
      await storage.setSetting('smtp_host', '');
      await storage.setSetting('smtp_port', '587');
      await storage.setSetting('smtp_user', '');
      await storage.setSetting('smtp_password', '');
      await storage.setSetting('smtp_sender', '');
      
      console.log('✓ Default settings created');
    } else {
      console.log('✓ Admin already exists, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}