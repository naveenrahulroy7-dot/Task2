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
              
              callback(null, result);
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