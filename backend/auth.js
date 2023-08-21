import dotenv from 'dotenv'
import supa from "@supabase/supabase-js";
// Supabase Connection

dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supa.createClient(supabaseUrl, supabaseKey) 

const auth = async (req, res, next) => {
    try {
      req.body.jwt = req.headers.authorization.split(' ')[1];
      console.log(req.body.jwt)
    } catch (err) {
      res.status(400).json({ "error_message": "No jwt given!" });
      return;
    }

    try {
        var jwt = req.body.jwt;
        if (!jwt) {
          res.status(400).json({ "error_message": "No jwt given!" });
          return;
        }
      } catch (err) {
        res.status(500).json({ "error_message": "Unable to get jwt - in ai.js", "error": err });
        return;
      }

      try{
     var {data}=await supabase.auth.getUser(jwt);
        if (!data.user) {
            res.status(404).json({ "error_message": "Access Token is expired! Please login again and/or send the latest token." });
            return;
          }
        } catch (err) {
            //console.log(err)
          res.status(500).json({ "error_message": "Unable to connect to Supabase for getting user", "error": err });
          console.log(err)
          return;
        }
      
        req.userData = data.user;
         next();
    };
        


export default auth