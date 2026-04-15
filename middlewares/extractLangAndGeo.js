const { supportedLangs } = require('../utils/translate');

/**
 * Middleware to extract language and geo params from query/body
 */
function extractLangAndGeo(req, res, next) {
  // Safely extract lang from query params or body, default to 'en'
  const query = req.query || {};
  const body = req.body || {};
  
  req.targetLang = (query.lang || body.lang || 'en').toLowerCase();
  
  // Validate language is supported
  if (!supportedLangs.includes(req.targetLang)) {
    req.targetLang = 'en';
  }
  
  // Extract geo from query params, body, or use detected geo from middleware
  req.geoRegion = (query.geo || body.geo || req.geo || 'US').toUpperCase();
  
  next();
}

module.exports = extractLangAndGeo;
