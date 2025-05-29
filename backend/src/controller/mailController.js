import Mail from "../models/mailModel.js";
import nodemailer from "nodemailer";
import {getParsedURL, s3} from '../lib/awsS3.js'
import axios from 'axios'
export const AddMailContents = async (req, res) => {
  const { sender, title, body, file } = req.body;

  if (!sender) {
    return res.status(400).json({ message: "Sender is required" });
  }

  try {
    // Step 1: Find existing Mail document for the sender
    let mail = await Mail.findOne({ sender });

    // Step 2: If not found, create a new one with empty arrays
    if (!mail) {
      mail = await Mail.create({
        sender,
        title: [],
        body: [],
        file: [],
      });
    }

    const updateFields = {};
    if (title) updateFields.$push = { ...(updateFields.$push || {}), title };
    if (body) updateFields.$push = { ...(updateFields.$push || {}), body };
    if (file) updateFields.$push = { ...(updateFields.$push || {}), file };

    if (!updateFields.$push) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedMail = await Mail.findByIdAndUpdate(mail._id, updateFields, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "Mail updated successfully", updatedMail });

  } catch (error) {
    console.error("Mail update failed:", error);
    return res.status(500).json({ message: error.message });
  }
};
export const deleteMailContent = async (req, res) => {
  console.log("Delete request received:", req.body);
  const { sender, title, body } = req.body;
  
  if (!sender) {
    return res.status(400).json({ message: "Sender is required" });
  }

  if (!title && !body) {
    return res.status(400).json({ message: "Specify title or body to delete" });
  }

  try {
    // Step 1: Find the Mail document
    const mail = await Mail.findOne({ sender });
    if (!mail) {
      return res.status(404).json({ message: "Mail document not found" });
    }

    // Step 2: Prepare update operation
    const updateFields = {};
    if (title) updateFields.$pull = { ...(updateFields.$pull || {}), title };
    if (body) updateFields.$pull = { ...(updateFields.$pull || {}), body };

    // Step 3: Perform update
    const updatedMail = await Mail.findByIdAndUpdate(mail._id, updateFields, {
      new: true,
    });

    return res.status(200).json({
      message: "Mail content deleted successfully",
      updatedMail,
    });

  } catch (error) {
    console.error("Deletion failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getMailContents = async (req, res) => {
    const {sender} = req.body;
    if (!sender) {
        return res.status(400).json({message: "Sender is required"});
    }
    
    try {
        const mailContents = await Mail.findOne({sender});
        if(!mailContents){
            return res.status(404).json({message: "Mail contents not found"});
        }
        return res.status(200).json({message: "Mail contents retrieved successfully", mailContents});
    } catch (error) {
        console.error("Error retrieving mail contents:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}
export const composeMail = async (req, res) => {
    const { senderEmailId,userName,userEmail, senderPassword,to, title, body, file } = req.body;
    try {
        if(!senderEmailId || !senderPassword){
            return res.status(400).json({message: "Official Sender email and password are required"});
        }
        if(!to || !title || !body){
            return res.status(400).json({message: "Recipient email, title and body are required"});
        }
        let uploadeFile;
        if(file){
          const url = getParsedURL(req,res,file.key);
          const resp = await axios.get(url ,{
            responseType: 'arraybuffer'
          })
          uploadeFile = Buffer.from(resp.data, 'binary');
        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
                user: senderEmailId,
                pass: senderPassword,
            },
        });
        const mailOptions = {
            from: {
              name : userName,
              address: userEmail
            },
            to: to,
            subject: title,
            text: body,
            attachments: [
              {
                filename : file ? file.name : undefined,
                content: uploadeFile ? uploadeFile : undefined,
              }
            ],
        };

        const info = await transporter.sendMail(mailOptions);
        if (info.accepted.length > 0) {
            return res.status(200).json({ message: "Mail sent successfully", info });
        } else {
            return res.status(400).json({ message: "Mail not sent", info });
        }
    } catch (error) {
        console.error("Error sending mail:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const uploadFile = async (req, res)=>{
  const file = req.file;
  const sender = req.body.sender;
  if (!file || !sender) {
    return res.status(400).json({ message: "File and sender are required" });
  }
  const fileKey = `${Date.now()}-${file.originalname}`;
  const params = {
    Bucket : process.env.AWS_S3_BUCKET,
    Key : fileKey,
    Body : file.buffer,
    ContentType: file.mimetype,
  }
  
  try {
    s3.upload(params, async (err,data)=>{
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ message: "File upload failed", error: err });
      }
      
      try {
        const updatedContent = await Mail.findOneAndUpdate(
          {sender:sender},
          {$push : {file: { url: data.Location, name: file.originalname , key :data.Key  }}},
          { new: true, upsert: true }
        )
        if (!updatedContent) {
          return res.status(404).json({ message: "Mail content not found" });
        }
        console.log("File URL added to mail content:", updatedContent);
        return res.status(200).json({ message: "File uploaded successfully", updatedContent });
      } catch (error) {
        console.error("Error updating mail content with file URL:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
      }
      console.log("File uploaded successfully:", data);
      return res.status(200).json({ message: "File uploaded successfully", data});
    })
  } catch (error) {
    console.error("Error in uploadFile:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}