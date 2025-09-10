const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database directory if it doesn't exist
const dbPath = path.join(__dirname, 'hr_database.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    // Create employees table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        department TEXT,
        position TEXT,
        status TEXT DEFAULT 'Active',
        join_date DATE,
        address TEXT,
        salary TEXT,
        emergency_contact TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create departments table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        manager TEXT,
        employee_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create attendance table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        employee_name TEXT,
        date DATE,
        check_in TIME,
        check_out TIME,
        hours_worked REAL,
        overtime REAL,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    // Create leave_requests table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        employee_name TEXT,
        leave_type TEXT,
        start_date DATE,
        end_date DATE,
        days INTEGER,
        reason TEXT,
        status TEXT DEFAULT 'Pending',
        applied_on DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    // Create payroll table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER,
        employee_name TEXT,
        position TEXT,
        basic_salary REAL,
        allowances REAL,
        overtime REAL,
        deductions REAL,
        gross_pay REAL,
        tax_deduction REAL,
        net_pay REAL,
        pay_period TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (id)
      )
    `);

    // Create reports table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        generated_on DATE,
        period TEXT,
        status TEXT DEFAULT 'Generated',
        file_size TEXT,
        file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_profiles table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        position TEXT,
        department TEXT,
        join_date DATE,
        address TEXT,
        bio TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Insert sample data
    this.insertSampleData();
  }

  insertSampleData() {
    // Check if data already exists
    this.db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
      if (err) {
        console.error('Error checking employees:', err);
        return;
      }

      if (row.count === 0) {
        // Insert sample employees
        const employees = [
          ['Sarah Johnson', 'sarah.johnson@company.com', '+1 (555) 123-4567', 'Engineering', 'Senior Developer', 'Active', '2022-03-15', '123 Main St, New York, NY', '75000', '+1 (555) 999-0001', null],
          ['Michael Chen', 'michael.chen@company.com', '+1 (555) 234-5678', 'Marketing', 'Marketing Manager', 'Active', '2021-08-22', '456 Oak Ave, Los Angeles, CA', '65000', '+1 (555) 999-0002', null],
          ['Emily Rodriguez', 'emily.rodriguez@company.com', '+1 (555) 345-6789', 'Sales', 'Sales Representative', 'On Leave', '2023-01-10', '789 Pine St, Chicago, IL', '55000', '+1 (555) 999-0003', null],
          ['David Kim', 'david.kim@company.com', '+1 (555) 456-7890', 'Engineering', 'DevOps Engineer', 'Active', '2022-11-05', '321 Elm St, Seattle, WA', '80000', '+1 (555) 999-0004', null],
          ['Lisa Wang', 'lisa.wang@company.com', '+1 (555) 567-8901', 'HR', 'HR Specialist', 'Active', '2021-06-18', '654 Maple Dr, Boston, MA', '60000', '+1 (555) 999-0005', null]
        ];

        const stmt = this.db.prepare(`
          INSERT INTO employees (name, email, phone, department, position, status, join_date, address, salary, emergency_contact, avatar)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        employees.forEach(employee => {
          stmt.run(employee);
        });
        stmt.finalize();

        // Insert sample departments
        const departments = [
          ['Engineering', 'Software development and technical operations', 'Sarah Johnson', 25],
          ['Marketing', 'Brand promotion and digital marketing', 'Michael Chen', 8],
          ['Sales', 'Business development and client relations', 'Emily Rodriguez', 12],
          ['HR', 'Human resources and employee management', 'Lisa Wang', 5]
        ];

        const deptStmt = this.db.prepare(`
          INSERT INTO departments (name, description, manager, employee_count)
          VALUES (?, ?, ?, ?)
        `);

        departments.forEach(dept => {
          deptStmt.run(dept);
        });
        deptStmt.finalize();

        // Insert sample attendance records
        const attendanceRecords = [
          [1, 'Sarah Johnson', '2024-01-15', '09:00', '17:30', 8.5, 0.5, 'Present'],
          [2, 'Michael Chen', '2024-01-15', '09:15', '17:00', 7.75, 0, 'Late'],
          [3, 'Emily Rodriguez', '2024-01-15', null, null, 0, 0, 'Absent'],
          [4, 'David Kim', '2024-01-15', '09:00', '18:00', 9, 1, 'Present'],
          [5, 'Lisa Wang', '2024-01-15', '09:00', '13:00', 4, 0, 'Half Day']
        ];

        const attStmt = this.db.prepare(`
          INSERT INTO attendance (employee_id, employee_name, date, check_in, check_out, hours_worked, overtime, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        attendanceRecords.forEach(record => {
          attStmt.run(record);
        });
        attStmt.finalize();

        // Insert sample leave requests
        const leaveRequests = [
          [1, 'Sarah Johnson', 'Annual Leave', '2024-01-20', '2024-01-25', 6, 'Family vacation', 'Approved', '2024-01-10'],
          [2, 'Michael Chen', 'Sick Leave', '2024-01-18', '2024-01-19', 2, 'Medical appointment', 'Pending', '2024-01-15'],
          [3, 'Emily Rodriguez', 'Personal Leave', '2024-01-22', '2024-01-22', 1, 'Personal emergency', 'Rejected', '2024-01-16']
        ];

        const leaveStmt = this.db.prepare(`
          INSERT INTO leave_requests (employee_id, employee_name, leave_type, start_date, end_date, days, reason, status, applied_on)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        leaveRequests.forEach(request => {
          leaveStmt.run(request);
        });
        leaveStmt.finalize();

        // Insert sample payroll records
        const payrollRecords = [
          [1, 'Sarah Johnson', 'Senior Developer', 5000, 500, 200, 100, 5600, 840, 4760, 'January 2024', 'Paid'],
          [2, 'Michael Chen', 'Marketing Manager', 6000, 600, 0, 50, 6550, 982.5, 5567.5, 'January 2024', 'Processed'],
          [4, 'David Kim', 'DevOps Engineer', 4000, 400, 300, 80, 4620, 693, 3927, 'January 2024', 'Pending']
        ];

        const payrollStmt = this.db.prepare(`
          INSERT INTO payroll (employee_id, employee_name, position, basic_salary, allowances, overtime, deductions, gross_pay, tax_deduction, net_pay, pay_period, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        payrollRecords.forEach(record => {
          payrollStmt.run(record);
        });
        payrollStmt.finalize();

        // Insert sample reports
        const reports = [
          ['Monthly Payroll Report - January 2024', 'Payroll', 'Complete payroll summary including taxes and deductions', '2024-01-31', 'January 2024', 'Generated', '2.3 MB', '/reports/payroll_jan_2024.pdf'],
          ['Employee Attendance Summary - Q1 2024', 'Attendance', 'Quarterly attendance analysis with overtime calculations', '2024-01-15', 'Q1 2024', 'Generated', '1.8 MB', '/reports/attendance_q1_2024.pdf'],
          ['Leave Requests Analysis - 2023', 'Leave', 'Annual leave patterns and approval statistics', '2024-01-10', '2023', 'Processing', null, null]
        ];

        const reportStmt = this.db.prepare(`
          INSERT INTO reports (title, type, description, generated_on, period, status, file_size, file_path)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        reports.forEach(report => {
          reportStmt.run(report);
        });
        reportStmt.finalize();

        // Insert sample user profile
        const profileStmt = this.db.prepare(`
          INSERT INTO user_profiles (name, email, phone, position, department, join_date, address, bio, avatar)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        profileStmt.run([
          'Sarah Johnson',
          'sarah.johnson@company.com',
          '+1 (555) 123-4567',
          'HR Manager',
          'Human Resources',
          '2021-03-15',
          '123 Main St, New York, NY 10001',
          'Experienced HR professional with over 8 years in talent management and organizational development.',
          '/placeholder.svg'
        ]);
        profileStmt.finalize();
        console.log('Sample data inserted successfully');
      }
    });
  }

  // Employee operations
  getAllEmployees(callback) {
    this.db.all("SELECT * FROM employees ORDER BY created_at DESC", callback);
  }

  getEmployeeById(id, callback) {
    this.db.get("SELECT * FROM employees WHERE id = ?", [id], callback);
  }

  createEmployee(employee, callback) {
    const { name, email, phone, department, position, status, join_date, address, salary, emergency_contact, avatar } = employee;
    this.db.run(`
      INSERT INTO employees (name, email, phone, department, position, status, join_date, address, salary, emergency_contact, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, email, phone, department, position, status || 'Active', join_date, address, salary, emergency_contact, avatar], callback);
  }

  updateEmployee(id, employee, callback) {
    const { name, email, phone, department, position, status, join_date, address, salary, emergency_contact, avatar } = employee;
    this.db.run(`
      UPDATE employees 
      SET name = ?, email = ?, phone = ?, department = ?, position = ?, status = ?, 
          join_date = ?, address = ?, salary = ?, emergency_contact = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, email, phone, department, position, status, join_date, address, salary, emergency_contact, avatar, id], callback);
  }

  deleteEmployee(id, callback) {
    this.db.run("DELETE FROM employees WHERE id = ?", [id], callback);
  }

  // Department operations
  getAllDepartments(callback) {
    this.db.all("SELECT * FROM departments ORDER BY created_at DESC", callback);
  }

  // Attendance operations
  getAllAttendance(callback) {
    this.db.all("SELECT * FROM attendance ORDER BY date DESC", callback);
  }

  // Leave requests operations
  getAllLeaveRequests(callback) {
    this.db.all("SELECT * FROM leave_requests ORDER BY applied_on DESC", callback);
  }

  // Payroll operations
  getAllPayroll(callback) {
    this.db.all("SELECT * FROM payroll ORDER BY created_at DESC", callback);
  }

  createPayroll(payrollData, callback) {
    const { employee_id, employee_name, position, basic_salary, allowances, overtime, deductions, gross_pay, tax_deduction, net_pay, pay_period, status } = payrollData;
    this.db.run(`
      INSERT INTO payroll (employee_id, employee_name, position, basic_salary, allowances, overtime, deductions, gross_pay, tax_deduction, net_pay, pay_period, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [employee_id, employee_name, position, basic_salary, allowances, overtime, deductions, gross_pay, tax_deduction, net_pay, pay_period, status], callback);
  }

  // Attendance operations
  createAttendance(attendanceData, callback) {
    const { employee_id, employee_name, date, check_in, check_out, hours_worked, overtime, status } = attendanceData;
    this.db.run(`
      INSERT INTO attendance (employee_id, employee_name, date, check_in, check_out, hours_worked, overtime, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [employee_id, employee_name, date, check_in, check_out, hours_worked, overtime, status], callback);
  }

  // Leave request operations
  createLeaveRequest(leaveData, callback) {
    const { employee_id, employee_name, leave_type, start_date, end_date, days, reason, status, applied_on } = leaveData;
    this.db.run(`
      INSERT INTO leave_requests (employee_id, employee_name, leave_type, start_date, end_date, days, reason, status, applied_on)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [employee_id, employee_name, leave_type, start_date, end_date, days, reason, status, applied_on], callback);
  }

  updateLeaveRequestStatus(id, status, callback) {
    this.db.run("UPDATE leave_requests SET status = ? WHERE id = ?", [status, id], callback);
  }

  // Department operations
  createDepartment(deptData, callback) {
    const { name, description, manager, employee_count, status } = deptData;
    this.db.run(`
      INSERT INTO departments (name, description, manager, employee_count, status)
      VALUES (?, ?, ?, ?, ?)
    `, [name, description, manager, employee_count, status], callback);
  }

  updateDepartment(id, deptData, callback) {
    const { name, description, manager, employee_count, status } = deptData;
    this.db.run(`
      UPDATE departments 
      SET name = ?, description = ?, manager = ?, employee_count = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, manager, employee_count, status, id], callback);
  }

  deleteDepartment(id, callback) {
    this.db.run("DELETE FROM departments WHERE id = ?", [id], callback);
  }

  // Reports operations
  getAllReports(callback) {
    this.db.all("SELECT * FROM reports ORDER BY created_at DESC", callback);
  }

  createReport(reportData, callback) {
    const { title, type, description, generated_on, period, status, file_size, file_path } = reportData;
    this.db.run(`
      INSERT INTO reports (title, type, description, generated_on, period, status, file_size, file_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, type, description, generated_on, period, status, file_size, file_path], callback);
  }

  // User profile operations
  getUserProfile(callback) {
    this.db.get("SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 1", callback);
  }

  updateUserProfile(profileData, callback) {
    const { name, email, phone, position, department, join_date, address, bio, avatar } = profileData;
    this.db.run(`
      UPDATE user_profiles 
      SET name = ?, email = ?, phone = ?, position = ?, department = ?, join_date = ?, address = ?, bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [name, email, phone, position, department, join_date, address, bio, avatar], callback);
  }
  // Get all tables data for admin view
  getAllTablesData(callback) {
    const result = {};
    
    this.getAllEmployees((err, employees) => {
      if (err) return callback(err);
      result.employees = employees;
      
      this.getAllDepartments((err, departments) => {
        if (err) return callback(err);
        result.departments = departments;
        
        this.getAllAttendance((err, attendance) => {
          if (err) return callback(err);
          result.attendance = attendance;
          
          this.getAllLeaveRequests((err, leaveRequests) => {
            if (err) return callback(err);
            result.leave_requests = leaveRequests;
            
            this.getAllPayroll((err, payroll) => {
              if (err) return callback(err);
              result.payroll = payroll;
              
              this.getAllReports((err, reports) => {
                if (err) return callback(err);
                result.reports = reports;
                
                this.getUserProfile((err, profile) => {
                  if (err) return callback(err);
                  result.user_profile = profile;
                  
                  callback(null, result);
                });
              });
            });
          });
        });
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

module.exports = Database;