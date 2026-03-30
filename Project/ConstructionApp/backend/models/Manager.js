const managerSchema = new mongoose.Schema({
  department: String,
  phone: String,
});
module.exports = mongoose.model('Manager', userSchema.discriminator('Manager', managerSchema));
