import express from "express"
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js"; 
import UserChats from "./models/userChats.js";
import { clerkMiddleware, requireAuth} from '@clerk/express'
import {createClerkClient} from '@clerk/backend'


const port = process.env.PORT || 3000;
const app = express();

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
})

const clerkClient = createClerkClient(
  { 
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY, 
    secretKey: process.env.CLERK_SECRET_KEY
  }
)

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json())

app.use(clerkMiddleware({client: clerkClient}))

const connect = async()=>{
  try{
    await mongoose.connect(process.env.MONGO)
    console.log("Connected to Mongo")
  }catch(err){
    console.log(err)
  }
}

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters()
  res.send(result)
})



app.post("/api/chats", requireAuth(),async (req, res) => {
  const userId = req.auth.userId;
  console.log("THis is userid",userId)
  const { text} = req.body;
  try{

    const newChat = new Chat({
      userId: userId,
      history: [{role: "user", parts:[{text}]}]
    });

    const savedChat = await newChat.save()

    const userChats = await UserChats.find({userId: userId})

    if(!userChats.length){
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0,30)
          },
        ],
      });

      await newUserChats.save()

    }else{
      await UserChats.updateOne({userId: userId},{
        $push: {
          chats: {
            _id: savedChat._id,
            title: text.substring(0,30)
          }
        }
      }
    );

      res.status(201).send(newChat._id)
    }

  }catch(err){
    console.log(err)
    res.status(500).send("Internal Server Error")
  } 
});

app.get("/api/userchats", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId });

    if (!userChats) {
      return res.status(200).send([]); // Return empty array instead of crashing
    }

    res.status(200).send(userChats[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
});

app.get("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(401).send("Invalid token")
  
})

app.listen(port, () => {
  connect()
  console.log(`Server is running on port ${port}`);
})

