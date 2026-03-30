const technicalCoordinatorSchema = new mongoose.Schema({
  specialization: String,
  experience: Number,
});
module.exports = mongoose.model('TechnicalCoordinator', userSchema.discriminator('TechnicalCoordinator', technicalCoordinatorSchema));
