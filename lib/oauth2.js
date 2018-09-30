const util = require('util');
const OAuth2Strategy = require('passport-oauth2');

const { InternalOAuthError } = OAuth2Strategy;

function Strategy(options, verify) {
  const newOptions = options || {};
  newOptions.authorizationURL = newOptions.authorizationURL || 'https://id.twitch.tv/oauth2/authorize';
  newOptions.tokenURL = newOptions.tokenURL || 'https://id.twitch.tv/oauth2/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'twitch';

  this._oauth2.setAuthMethod('Bearer');
  this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function userProfile(accessToken, done) {
  this._oauth2.get('https://api.twitch.tv/helix/users', accessToken, (err, body) => {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }

    try {
      const json = JSON.parse(body).data[0];
      const profile = { provider: 'twitch' };

      profile.id = json.id;
      profile.username = json.login;
      profile.displayName = json.display_name;
      profile.email = json.email;

      profile.raw = body;
      profile.json = json;

      return done(null, profile);
    } catch (e) {
      return done(e);
    }
  });
};

Strategy.prototype.authorizationParams = function authorizationParams(options) {
  const params = {};
  if (options.forceVerify) {
    params.force_verify = !!options.forceVerify;
  }
  return params;
};

module.exports = Strategy;
