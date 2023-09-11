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
  try {
    const messages = await prisma.message.findMany({
      include: {
        children: true,
      },
    });
    res.send({ success: true, messages });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

//----------------------------------------------------
//If a parent-id is present, create a child message(reply)
//else, if parentId not present, create a top-level message (parent)
app.post("/messages", async (req, res) => {
  const { text, parentId, childId } = req.body;

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
      //}
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

  try {
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
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

//--------------------------------------------------------
app.delete("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;

  try {
    let message;

    //if it's a parent message, id will get stored into parentMessage
    const parentMessage = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    // console.log(parentMessage);

    //if child message, id will get stored into childMessage
    const childMessage = await prisma.child.findUnique({
      where: {
        id: messageId,
      },
    });

    //console.log(childMessage);

    if (childMessage) {
      //if a child message, DELETE
      await prisma.child.delete({
        where: {
          id: messageId,
        },
      });
    } else if (parentMessage) {
      //if a parent message, DELETE child message first
      await prisma.child.deleteMany({
        where: {
          parentId: messageId,
        },
      });

      //then DELETE parent message
      message = await prisma.message.delete({
        where: {
          id: messageId,
        },
      });
    } else {
      //error handler if invalid ID or no message is found
      return res.status(404).send({
        success: false,
        error: "Message not found, invalid ID.",
      });
    }

    res.send({
      success: true,
      message,
    });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

//--------------------------------------------------------

//returns success: false for bad json
app.use((error, req, res, next) => {
  res.send({
    success: false,
    error: error.message,
  });
});

//handles invalid endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Invalid enpoint. The requested resource was not found.",
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
