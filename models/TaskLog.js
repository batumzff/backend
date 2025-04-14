const mongoose = require('mongoose');

const TaskLogSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed']
  },
  newStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed']
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TaskLog', TaskLogSchema);