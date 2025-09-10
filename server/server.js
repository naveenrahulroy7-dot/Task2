const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Serve static files (uploaded images)
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes

// Database overview route - shows all data in table format
app.get('/', (req, res) => {
  db.getAllTablesData((err, data) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    // Generate HTML table view
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HR Database Overview</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .section {
            margin: 20px;
          }
          .section h2 {
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
          }
          tr:hover {
            background-color: #f9fafb;
          }
          .status-active { color: #059669; font-weight: 500; }
          .status-inactive { color: #dc2626; font-weight: 500; }
          .status-pending { color: #d97706; font-weight: 500; }
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
          }
          .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #2563eb;
          }
          .stat-label {
            color: #6b7280;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HR Database Overview</h1>
            <p>Complete database view for HR Management System</p>
          </div>
          
          <div class="section">
            <div class="stats">
              <div class="stat-card">
                <div class="stat-number">${data.employees?.length || 0}</div>
                <div class="stat-label">Total Employees</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.departments?.length || 0}</div>
                <div class="stat-label">Departments</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.attendance?.length || 0}</div>
                <div class="stat-label">Attendance Records</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.leave_requests?.length || 0}</div>
                <div class="stat-label">Leave Requests</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.payroll?.length || 0}</div>
                <div class="stat-label">Payroll Records</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.reports?.length || 0}</div>
                <div class="stat-label">Reports Generated</div>
              </div>
            </div>
          </div>
    `;

    // Employees table
    if (data.employees && data.employees.length > 0) {
      html += `
        <div class="section">
          <h2>Employees (${data.employees.length})</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      data.employees.forEach(emp => {
        const avatarSrc = emp.avatar ? `/uploads/${path.basename(emp.avatar)}` : '/placeholder.svg';
        html += `
          <tr>
            <td>${emp.id}</td>
            <td><img src="${avatarSrc}" alt="Avatar" class="avatar" onerror="this.src='/placeholder.svg'"></td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.department}</td>
            <td>${emp.position}</td>
            <td class="status-${emp.status.toLowerCase().replace(' ', '-')}">${emp.status}</td>
            <td>${emp.join_date}</td>
            <td>${emp.salary ? '$' + emp.salary : 'N/A'}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Departments table
    if (data.departments && data.departments.length > 0) {
      html += `
        <div class="section">
          <h2>Departments (${data.departments.length})</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Manager</th>
                <th>Employee Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      data.departments.forEach(dept => {
        html += `
          <tr>
            <td>${dept.id}</td>
            <td>${dept.name}</td>
            <td>${dept.description}</td>
            <td>${dept.manager}</td>
            <td>${dept.employee_count}</td>
            <td class="status-${dept.status.toLowerCase()}">${dept.status}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Attendance table
    if (data.attendance && data.attendance.length > 0) {
      html += `
        <div class="section">
          <h2>Attendance Records (${data.attendance.length})</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      data.attendance.forEach(att => {
        html += `
          <tr>
            <td>${att.id}</td>
            <td>${att.employee_name}</td>
            <td>${att.date}</td>
            <td>${att.check_in || 'N/A'}</td>
            <td>${att.check_out || 'N/A'}</td>
            <td>${att.hours_worked || 0}h</td>
            <td class="status-${att.status.toLowerCase().replace(' ', '-')}">${att.status}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }
    // Payroll table
    if (data.payroll && data.payroll.length > 0) {
      html += `
        <div class="section">
          <h2>Payroll Records (${data.payroll.length})</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Position</th>
                <th>Basic Salary</th>
                <th>Gross Pay</th>
                <th>Net Pay</th>
                <th>Period</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      data.payroll.forEach(pay => {
        html += `
          <tr>
            <td>${pay.id}</td>
            <td>${pay.employee_name}</td>
            <td>${pay.position}</td>
            <td>$${pay.basic_salary?.toLocaleString() || 0}</td>
            <td>$${pay.gross_pay?.toLocaleString() || 0}</td>
            <td>$${pay.net_pay?.toLocaleString() || 0}</td>
            <td>${pay.pay_period}</td>
            <td class="status-${pay.status.toLowerCase().replace(' ', '-')}">${pay.status}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Reports table
    if (data.reports && data.reports.length > 0) {
      html += `
        <div class="section">
          <h2>Generated Reports (${data.reports.length})</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Period</th>
                <th>Generated On</th>
                <th>Status</th>
                <th>File Size</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      data.reports.forEach(report => {
        html += `
          <tr>
            <td>${report.id}</td>
            <td>${report.title}</td>
            <td>${report.type}</td>
            <td>${report.period}</td>
            <td>${report.generated_on}</td>
            <td class="status-${report.status.toLowerCase().replace(' ', '-')}">${report.status}</td>
            <td>${report.file_size || 'N/A'}</td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    // User Profile section
    if (data.user_profile) {
      html += `
        <div class="section">
          <h2>User Profile</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Department</th>
                <th>Join Date</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${data.user_profile.name}</td>
                <td>${data.user_profile.email}</td>
                <td>${data.user_profile.position}</td>
                <td>${data.user_profile.department}</td>
                <td>${data.user_profile.join_date}</td>
                <td>${data.user_profile.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    html += `
        </div>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// API Routes

// Employee routes
app.get('/api/employees', (req, res) => {
  db.getAllEmployees((err, employees) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }
    res.json(employees);
  });
});

app.get('/api/employees/:id', (req, res) => {
  db.getEmployeeById(req.params.id, (err, employee) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch employee' });
    }
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  });
});

app.post('/api/employees', upload.single('avatar'), (req, res) => {
  const employeeData = { ...req.body };
  
  if (req.file) {
    employeeData.avatar = req.file.filename;
  }

  db.createEmployee(employeeData, function(err) {
    if (err) {
      console.error('Error creating employee:', err);
      return res.status(500).json({ error: 'Failed to create employee' });
    }
    res.json({ id: this.lastID, message: 'Employee created successfully' });
  });
});

app.put('/api/employees/:id', upload.single('avatar'), (req, res) => {
  const employeeData = { ...req.body };
  
  if (req.file) {
    employeeData.avatar = req.file.filename;
  }

  db.updateEmployee(req.params.id, employeeData, function(err) {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ error: 'Failed to update employee' });
    }
    res.json({ message: 'Employee updated successfully' });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  db.deleteEmployee(req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});

// Upload avatar route
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// Department routes
app.get('/api/departments', (req, res) => {
  db.getAllDepartments((err, departments) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch departments' });
    }
    res.json(departments);
  });
});

app.post('/api/departments', (req, res) => {
  db.createDepartment(req.body, function(err) {
    if (err) {
      console.error('Error creating department:', err);
      return res.status(500).json({ error: 'Failed to create department' });
    }
    res.json({ id: this.lastID, message: 'Department created successfully' });
  });
});

app.put('/api/departments/:id', (req, res) => {
  db.updateDepartment(req.params.id, req.body, function(err) {
    if (err) {
      console.error('Error updating department:', err);
      return res.status(500).json({ error: 'Failed to update department' });
    }
    res.json({ message: 'Department updated successfully' });
  });
});

app.delete('/api/departments/:id', (req, res) => {
  db.deleteDepartment(req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete department' });
    }
    res.json({ message: 'Department deleted successfully' });
  });
});

// Attendance routes
app.get('/api/attendance', (req, res) => {
  db.getAllAttendance((err, attendance) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch attendance' });
    }
    res.json(attendance);
  });
});

app.post('/api/attendance', (req, res) => {
  db.createAttendance(req.body, function(err) {
    if (err) {
      console.error('Error creating attendance:', err);
      return res.status(500).json({ error: 'Failed to create attendance record' });
    }
    res.json({ id: this.lastID, message: 'Attendance record created successfully' });
  });
});

// Leave request routes
app.get('/api/leave-requests', (req, res) => {
  db.getAllLeaveRequests((err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
    res.json(requests);
  });
});

app.post('/api/leave-requests', (req, res) => {
  db.createLeaveRequest(req.body, function(err) {
    if (err) {
      console.error('Error creating leave request:', err);
      return res.status(500).json({ error: 'Failed to create leave request' });
    }
    res.json({ id: this.lastID, message: 'Leave request created successfully' });
  });
});

app.put('/api/leave-requests/:id/status', (req, res) => {
  const { status } = req.body;
  db.updateLeaveRequestStatus(req.params.id, status, function(err) {
    if (err) {
      console.error('Error updating leave request status:', err);
      return res.status(500).json({ error: 'Failed to update leave request status' });
    }
    res.json({ message: 'Leave request status updated successfully' });
  });
});

// Payroll routes
app.get('/api/payroll', (req, res) => {
  db.getAllPayroll((err, payroll) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch payroll' });
    }
    res.json(payroll);
  });
});

app.post('/api/payroll', (req, res) => {
  db.createPayroll(req.body, function(err) {
    if (err) {
      console.error('Error creating payroll:', err);
      return res.status(500).json({ error: 'Failed to create payroll record' });
    }
    res.json({ id: this.lastID, message: 'Payroll record created successfully' });
  });
});

// Reports routes
app.get('/api/reports', (req, res) => {
  db.getAllReports((err, reports) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch reports' });
    }
    res.json(reports);
  });
});

app.post('/api/reports', (req, res) => {
  db.createReport(req.body, function(err) {
    if (err) {
      console.error('Error creating report:', err);
      return res.status(500).json({ error: 'Failed to create report' });
    }
    res.json({ id: this.lastID, message: 'Report created successfully' });
  });
});

// User profile routes
app.get('/api/profile', (req, res) => {
  db.getUserProfile((err, profile) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
    res.json(profile);
  });
});

app.put('/api/profile', (req, res) => {
  db.updateUserProfile(req.body, function(err) {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
});
// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: 'Only image files are allowed!' });
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`HR Server running on http://localhost:${PORT}`);
  console.log(`Database view available at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close();
  process.exit(0);
});