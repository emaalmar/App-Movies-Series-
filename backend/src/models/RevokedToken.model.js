import mongoose from 'mongoose'

const revokedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
})

// TTL index to automatically remove expired revoked tokens
revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('RevokedToken', revokedTokenSchema)
