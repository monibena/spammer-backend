import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ success: true, message: "Spammer Backend" });
});

//---------------------------------------------------
app.get("/messages", async (req, res) => {
  // get the actual messages from the db
  const messages = await prisma.message.findMany({
    include: {
      children: true,
    },
  });
  res.send({ success: true, messages });
});

//----------------------------------------------------
//If a parent-id is present, create a child message(reply)
//else, if parentId not present, create a top-level message (parent)
app.post("/messages", async (req, res) => {
  const { text, parentId } = req.body;

  //checks if text is provided in request body, if not it returns an error response
  if (!text) {
    return res.send({
      success: false,
      error: "Text must be provided to create a message!",
    });
  }

  try {
    let message;
    if (parentId) {
      //check if parent message exists
      const parentMessage = await prisma.message.findUnique({
        where: {
          id: parentId,
        },
      });

      //Adds children to a parent message,
      message = await prisma.child.create({
        data: {
          text,
          parentId,
        },
      });
    } else {
      message = await prisma.message.create({
        data: {
          text,
        },
      });
    }

    res.send({ success: true, message });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

//-----------------------------------------------------
app.put("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.send({
      success: false,
      error: "Text wasn't included in your update request.",
    });
  }

  const message = await prisma.message.update({
    where: { id: messageId },
    data: { text },
  });

  res.send({
    success: true,
    message,
  });
});

//--------------------------------------------------------
app.delete("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const message = await prisma.message.delete({
    where: {
      id: messageId,
    },
  });

  res.send({
    success: true,
    message,
  });
});

//returns success: false for bad json
app.use((error, req, res, next) => {
  res.send({
    success: false,
    error: error.message,
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
