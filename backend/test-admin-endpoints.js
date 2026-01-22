import express from 'express';
import dotenv from 'dotenv';
import adminRouter from './src/routes/admin.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

const PORT = 3999;

const server = app.listen(PORT, async () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log('═'.repeat(60));

  const endpoints = [
    '/api/admin/health',
    '/api/admin/stats',
    '/api/admin/leads',
    '/api/admin/contacts',
    '/api/admin/newsletter',
    '/api/admin/email-logs'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint}`);
      const response = await fetch(`http://localhost:${PORT}${endpoint}`);
      const data = await response.json();

      if (response.ok) {
        console.log(`   ✅ Status: ${response.status}`);
        if (data.total !== undefined) {
          console.log(`   📊 Total records: ${data.total}`);
        }
        if (endpoint === '/api/admin/stats') {
          console.log(`   📈 Leads: ${data.leads?.total || 0}`);
          console.log(`   📈 Contacts: ${data.contacts?.total || 0}`);
          console.log(`   📈 Newsletter: ${data.newsletter?.total || 0}`);
          console.log(`   📈 Emails: ${data.emails?.total || 0}`);
        }
      } else {
        console.log(`   ❌ Status: ${response.status}`);
        console.log(`   Error: ${data.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ Pruebas completadas');
  server.close(() => {
    process.exit(0);
  });
});
