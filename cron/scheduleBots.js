const cron = require('node-cron');
const logger = require('../utils/logger');

const runInstagramBot = require('../bots/instagramBot');
const runTwitterBot = require('../bots/twitterBot');
const runTikTokBot = require('../bots/tiktokBot');
const runTelegramBot = require('../bots/telegramBot');
const runFacebookBot = require('../bots/facebookBot');
const runRedditBot = require('../bots/redditBot');
const runGmbBot = require('../bots/gmbBot');
const runPinterestBot = require('../bots/pinterestBot');
const runSnapchatBot = require('../bots/snapchatBot');
const runLinkedInBot = require('../bots/linkedinBot');
const runQuoraBot = require('../bots/quoraBot');
const runDiscordBot = require('../bots/discordBot');

function startCronJobs() {
  logger.info('[CRON] All bots will start on schedule');

  cron.schedule('*/15 * * * *', () => {
    logger.info('[CRON] InstagramBot Triggered');
    runInstagramBot();
  });

  cron.schedule('5,35 * * * *', () => {
    logger.info('[CRON] TwitterBot Triggered');
    runTwitterBot();
  });

  cron.schedule('10,40 * * * *', () => {
    logger.info('[CRON] TikTokBot Triggered');
    runTikTokBot();
  });

  cron.schedule('20 * * * *', () => {
    logger.info('[CRON] TelegramBot Triggered');
    runTelegramBot();
  });

  cron.schedule('25,55 * * * *', () => {
    logger.info('[CRON] FacebookBot Triggered');
    runFacebookBot();
  });

  cron.schedule('30 * * * *', () => {
    logger.info('[CRON] RedditBot Triggered');
    runRedditBot();
  });

  cron.schedule('45 * * * *', () => {
    logger.info('[CRON] GmbBot Triggered');
    runGmbBot();
  });

  cron.schedule('50 * * * *', () => {
    logger.info('[CRON] PinterestBot Triggered');
    runPinterestBot();
  });

  cron.schedule('0,30 * * * *', () => {
    logger.info('[CRON] SnapchatBot Triggered');
    runSnapchatBot();
  });

  cron.schedule('15,45 * * * *', () => {
    logger.info('[CRON] LinkedInBot Triggered');
    runLinkedInBot();
  });

  cron.schedule('10,50 * * * *', () => {
    logger.info('[CRON] QuoraBot Triggered');
    runQuoraBot();
  });

  cron.schedule('5,25 * * * *', () => {
    logger.info('[CRON] DiscordBot Triggered');
    runDiscordBot();
  });
}

module.exports = startCronJobs;
