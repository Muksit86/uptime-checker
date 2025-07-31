const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
  url: String,
  status: Number,
  statusText: String,
  responseTime: Number,
  isUp: Boolean,
  contentType: String,
  server: String,
  contentLength: Number,
  finalUrl: String,
  redirected: Boolean,
  title: String,
  checkedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Check', checkSchema);
