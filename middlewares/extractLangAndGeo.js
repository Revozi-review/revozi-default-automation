const { supportedLangs } = require('../utils/translate');

/**
 * Middleware to extract language and geo params from query/body
 */
function extractLangAndGeo(req, res, next) {
  // Extract lang from query params or body, default to 'en'
  req.targetLang = (req.query.lang || req.body.lang || 'en').toLowerCase();
  
  // Validate language is supported
  if (!supportedLangs.includes(req.targetLang)) {
    req.targetLang = 'en';
  }

  // Extract geo from query params, body, or use detected geo from middleware
  req.geoRegion = (req.query.geo || req.body.geo || req.geo || 'US').toUpperCase();

  next();
}

module.exports = extractLangAndGeo;