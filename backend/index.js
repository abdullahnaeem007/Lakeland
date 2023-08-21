import { config } from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import supa from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from 'openai';

config();
import auth from "./auth.js"



// Supabase Connection
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supa.createClient(supabaseUrl, supabaseKey) 

const configg = new Configuration({ apiKey: process.env.OPENAI_KEY });
const api = new OpenAIApi(configg);

const apiKey = process.env.OPENAI_KEY
//const country='florida';


// let name=null;
// let price=null;
// let cuisines=[];

const app = express();
app.use(cors());
app.use(express.json());
app.use(auth)



const typehead = async function (country) {

    const encodedParams = new URLSearchParams();
    encodedParams.set('q', country);
    encodedParams.set('language', 'en_US');

    const options = {
        method: 'POST',
        url: 'https://worldwide-restaurants.p.rapidapi.com/typeahead',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'YOUR RAPID API KEY',
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        data: encodedParams,
    };

    try {
        const response = await axios.request(options);
        return response.data
    } catch (error) {
        console.error(error);
        return null;
    }

}



app.post("/state", async function(req, res) {
    var  country = req.body.state;
    console.log('country'+country)
    try {
      const response = await typehead(country);
      let localId=null
      for(var i=0;i<response.results.data.length;i++)
      {
        localId= response.results.data[i].result_object.location_id;
        const response1= await fetchRestaurants(localId)
        if(!response1.results.errors)
        {
          break;
        }
      }
      res.json({ 
        localId:localId
       });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  

 const fetchRestaurants=async function(localId){
  const encodedParams = new URLSearchParams();
  encodedParams.set('language', 'en_US');
  encodedParams.set('limit', '30');
  encodedParams.set('location_id', localId);
  encodedParams.set('currency', 'USD');

const options = {
  method: 'POST',
  url: 'https://worldwide-restaurants.p.rapidapi.com/search',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': 'YOUR RAPID API KEY',
    'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
  },
  data: encodedParams,
};
try {
	var response = await axios.request(options);
	console.log(`Local ID= ${localId} ${response.data}`);
  return  response.data
} catch (error) {
	console.error(error);
}


 }
    


 app.post("/restaurants", async function(req, res) {
    var localId  = req.body.localId;
    try {
      const response = await fetchRestaurants(localId);
      var restaurants = [];



      console.log(`My API RESPONSE IF ${response.results.data}`)
      console.dir(response)


      var newData=response.results.data
  
      for (let i = 0; i < newData.length; i++) {
        var cuisines = [];
        for (let j = 0; j < newData[i].cuisine.length; j++) {
          cuisines.push(newData[i].cuisine[j].name);
        }


        var restaurant = {
           name : newData[i].name,
          price: newData[i].price,
          cuisines: cuisines
        };
        restaurants.push(restaurant);
      }
      
  
      res.json({
        restaurants: restaurants
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });



  app.post('/chat', async (req, res) => {
    const { messagesArray } = req.body;
    const completion = await api.createChatCompletion(
        {
            model: "gpt-3.5-turbo-16k",
            messages: messagesArray,
            stream: true,
        },
        { responseType: "stream" }
    );

    try{
    completion.data.on("data", (data) => {
        const lines = data
            ?.toString()
            ?.split("\n")
            .filter((line) => line.trim() !== "");
        for (const line of lines) {
            const message = line.replace(/^data: /, "");
            try {
                const parsed = JSON.parse(message);
                if (parsed.choices && parsed.choices.length > 0) {
                    const delta = parsed.choices[0].delta;
                    if (delta && delta.content) {
                        res.write(delta.content);
                        console.log(delta);
                    } else {
                        console.log("Content not found in the delta", parsed);
                    }
                    if (parsed.choices[0].finish_reason === 'stop') {
                        res.end();
                        console.log("Stream finished");
                        break;
                    }
                } else {
                    console.log("Choices not found or empty in the response", parsed);
                }
            } catch (error) {
                console.error("Could not JSON parse stream message", message, error);
            }
        }
    });
    } catch (error) {
        console.error("Could not JSON parse stream message", error);
    }

    completion.data.on('end', () => {
        console.log('End of data.');
        res.end();
    });
});


app.post('/saveHistory', async (req, res) => {
  const { messageArray } = req.body;
  const uuid = req.userData.id;

  console.log(`User ID = ${uuid}`)

  try {
    // Check if UUID exists in the table
    const { data: existingData, error } = await supabase
      .from('history')
      .select('*')
      .eq('id', uuid);

    if (error) {
      console.log(error)
      throw new Error('Error fetching history from Supabase',error);
    }

    if (existingData.length === 0) {
      // Inserting data

      const { data, error } = await supabase.from('history').insert([
        { "id":uuid, "history": messageArray },
      ]);

      if (error) {
        throw new Error('Error inserting history into Supabase');
      }
    } else {
      // Get Previous Entry
      console.log(existingData[0].history)
      const previousEntry = existingData[0].history;
      // Append new message object as a list
      previousEntry.push(messageArray);
      // Update the record
      const { data, error } = await supabase
        .from('history')
        .update({ history: previousEntry })
        .eq('id', existingData[0].id);

      if (error) {
        throw new Error('Error updating history in Supabase');
      }
    }

    res.status(200).json({ message: 'History saved successfully.' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ message: 'An error occurred while saving history.' });
  }
});

app.get('/getHistory', async (req, res) => {
  // Extract the UUID from req.userData.id
  const uuid = req.userData.id;
  console.log('UUID '+uuid)

  try {
    // Query the history table with the filter of UUID
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('id', uuid);

    // Handle error fetching history from Supabase
    if (error) {
      throw new Error('Error fetching history from Supabase');
    }

    if (data.length === 0) {
      
      res.status(404).json({ message: 'History not found.' });
    } else {
      // If history is found, retrieve the first entry
      const history = data;
      
      res.status(200).json({ history });
    }
  } catch (error) {
    // Handle any errors and respond with an error message
    console.error('Error retrieving history:', error);
    res.status(500).json({ message: 'An error occurred while retrieving history.' });
  }
});













// console.log(`Supabase URL ${process.env.SUPABASE_URL}`)




app.listen(3001,() =>{
    console.log("Listening on port 3000");
})

