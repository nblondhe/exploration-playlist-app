
exports.handler = async (event, context) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES, REDIRECT_URI } = process.env

  const settings = {
    SPOTIFY_CLIENT_ID: SPOTIFY_CLIENT_ID,
    SPOTIFY_SCOPES: SPOTIFY_SCOPES,
    REDIRECT_URI: REDIRECT_URI
  };

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(settings)
  };
};