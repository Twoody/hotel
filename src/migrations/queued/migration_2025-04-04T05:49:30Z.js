// src/utils/migrations.js
import { dbAdmin, admin } from '../../firebaseAdmin.js'
import { logMessage } from '../../utils/serverUtils.js'

/**
 * Runs a single migration.
 * Each migration is explicitly defined as a function.
 */
export async function setupPropertyAndReviews() {
  console.log('Starting Firestore migration...')
  try {
    // Example Migration: create "properties" collection
    const propertyRef = dbAdmin.collection('properties').doc()
    await propertyRef.set({
      daily_rate: 100,
      address: '123 Main Street',
      city: 'Portland',
      state: 'OR',
      zip_code: '97201',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log(`Created properties doc with ID: ${propertyRef.id}`)

    // Example Migration: create "reviews" collection
    const reviewRef = dbAdmin.collection('reviews').doc()
    await reviewRef.set({
      propertyId: propertyRef.id,
      guestId: 'guestUserId_123',
      rating: 5,
      review: 'Excellent stay!',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log(`Created reviews doc with ID: ${reviewRef.id}`)

    logMessage('Migration completed successfully.', 'info')
  } catch (error) {
    console.error('Migration failed:', error)
    logMessage('Migration failed', 'error')
    throw error
  }
}

setupPropertyAndReviews().catch(console.error);
