const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// API: Save Personal Info & TRX
app.post('/api/update-flow', async (req, res) => {
    const { userId, fullName, phone, country, city, trxId, status } = req.body;
    
    const { data, error } = await supabase
        .from('profiles')
        .upsert([{ 
            id: userId, 
            full_name: fullName, 
            phone_number: phone, 
            country: country, 
            city: city, 
            payment_trx_id: trxId,
            status: status 
        }]);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
});

// API: Real-time Status Check for Heart Loop
app.get('/api/status/:userId', async (req, res) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('status, balance')
        .eq('id', req.params.userId)
        .single();
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));
  
