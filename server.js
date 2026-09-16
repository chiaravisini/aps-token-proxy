const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/token', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const clientId = process.env.APS_CLIENT_ID;
        const clientSecret = process.env.APS_CLIENT_SECRET;

        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await axios.post(
            'https://developer.api.autodesk.com/authentication/v2/token',
            'grant_type=client_credentials&scope=data:read data:write data:create bucket:create bucket:read viewables:read',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            }
        );

        res.json({
            access_token: response.data.access_token,
            expires_in: response.data.expires_in
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Errore generazione token Autodesk' });
    }
});

app.listen(PORT, () => {
    console.log(`Server proxy avviato sulla porta ${PORT}`);
});
