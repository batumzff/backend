const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');


const passwordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const seedDb = async () => {
  try {
    // Clear the database
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();



    // Create users
    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@mail.com",
        password: await passwordHash("adminpass"),
        role: "admin"
      },
      {
        name: "Manager User",
        email: "manager@mail.com",
        password: await passwordHash("managerpass"),
        role: "manager"
      },
      {
        name: "Developer One",
        email: "dev1@mail.com",
        password: await passwordHash("dev1pass"),
        role: "developer"
      },
      {
        name: "Developer Two",
        email: "dev2@mail.com",
        password: await passwordHash("dev2pass"),
        role: "developer"
      },
      {
        name: "Developer Three",
        email: "dev3@mail.com",
        password: await passwordHash("dev3pass"),
        role: "developer"
      }
    ]);

    // Get user references
    const adminUser = users[0];
    const developerUsers = users.filter(user => user.role === 'developer');

    // Create a project with the admin as creator
    const project = await Project.create({
      name: "Main Project",
      description: "This is our main development project",
      createdBy: adminUser._id,
      members: users.map(user => user._id)
    });

    // Create 3 tasks, one assigned to each developer
    const tasks = await Task.insertMany([
      {
        title: "Backend API Development",
        description: "Develop RESTful API endpoints for the application",
        project: project._id,
        status: "pending",
        priority: "high",
        assignedTo: developerUsers[0]._id,
        createdBy: adminUser._id
      },
      {
        title: "Frontend UI Implementation",
        description: "Implement user interface components based on design mockups",
        project: project._id,
        status: "in-progress",
        priority: "medium",
        assignedTo: developerUsers[1]._id,
        createdBy: adminUser._id
      },
      {
        title: "Database Schema Optimization",
        description: "Optimize database schema for improved performance",
        project: project._id,
        status: "completed",
        priority: "low",
        assignedTo: developerUsers[2]._id,
        createdBy: adminUser._id
      }
    ]);

    console.log(`Database seeded with ${users.length} users`);
    console.log(`Database seeded with ${1} project`);
    console.log(`Database seeded with ${tasks.length} tasks`);
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDb;