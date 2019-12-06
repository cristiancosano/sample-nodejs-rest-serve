
// Port

process.env.PORT = process.env.PORT || 3000


// Environment

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Expiration Token

process.env.EXP_TOKEN = '48h'

// Seed Token

process.env.SEED = process.env.SEED || 'development-seed'


// Database

process.env.URL_DB = (process.env.NODE_ENV === 'dev') ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI


// Google Client ID

process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '219758474264-vh1bibcphgvbc32km508lubtqkanikf1.apps.googleusercontent.com'